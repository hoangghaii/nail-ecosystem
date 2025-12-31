# Docker Configuration

**Compose Files**: 3 (base + dev override + prod override)
**Dockerfiles**: 3 (client, admin, API)
**Strategy**: Multi-stage builds with monorepo optimization

## Compose Files

### docker-compose.yml (Base)

```yaml
services:
  nail-client:
    build:
      context: .              # Monorepo root
      dockerfile: ./apps/client/Dockerfile
    container_name: nail-client
    restart: unless-stopped
    networks:
      - nail-network

  nail-admin:
    build:
      context: .
      dockerfile: ./apps/admin/Dockerfile
    container_name: nail-admin
    restart: unless-stopped
    networks:
      - nail-network

  nail-api:
    build:
      context: .
      dockerfile: ./apps/api/Dockerfile
    container_name: nail-api
    restart: unless-stopped
    networks:
      - nail-network

networks:
  nail-network:
    driver: bridge
```

### docker-compose.dev.yml (Development)

**Features**:
- Development build target
- Hot-reload via volume mounts
- Direct port exposure
- Health checks
- Interactive terminals

**Client/Admin Pattern**:
```yaml
nail-client:
  build:
    target: development
  ports:
    - "5173:5173"
  volumes:
    - .:/app                        # Mount monorepo
    - /app/node_modules             # Exclude root node_modules
    - /app/apps/client/node_modules # Exclude app node_modules
  env_file:
    - ./apps/client/.env
  working_dir: /app/apps/client
  environment:
    NODE_ENV: development
    CHOKIDAR_USEPOLLING: "true"    # Enable file watching
  stdin_open: true
  tty: true
  healthcheck:
    test: ["CMD", "wget", "--spider", "-q", "http://localhost:5173"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

### docker-compose.prod.yml (Production)

**Features**:
- Production build target
- Nginx reverse proxy
- Internal networking (no direct ports)
- Resource limits
- Log rotation

**Nginx Service**:
```yaml
nginx:
  image: nginx:1.27-alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/conf.d:/etc/nginx/conf.d:ro
  depends_on:
    nail-client:
      condition: service_healthy
    nail-admin:
      condition: service_healthy
    nail-api:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "wget", "--spider", "-q", "http://localhost/health"]
```

**Service Overrides**:
```yaml
nail-client:
  target: production
  expose:
    - "80"
  env_file:
    - ./apps/client/.env.production
  deploy:
    resources:
      limits:
        cpus: "0.25"
        memory: 256M
```

## Multi-Stage Dockerfiles

### Client/Admin Pattern

```dockerfile
# ==========================================
# BASE LAYER - Package Metadata
# ==========================================
FROM node:24.12.0-alpine AS base

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy workspace package files (cache optimization)
COPY package*.json ./
COPY turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY tooling/prettier-config/package.json ./tooling/prettier-config/
COPY apps/client/package*.json ./apps/client/

# ==========================================
# DEPENDENCIES LAYER - Shared Dependencies
# ==========================================
FROM base AS dependencies

RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts

# ==========================================
# DEVELOPMENT LAYER
# ==========================================
FROM dependencies AS development

COPY . .

WORKDIR /app/apps/client

EXPOSE 5173

RUN addgroup -g 1001 -S nodejs && \
  adduser -S viteuser -u 1001 -G nodejs && \
  chown -R viteuser:nodejs /app

USER viteuser

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================================
# BUILDER LAYER
# ==========================================
FROM dependencies AS builder

COPY . .

WORKDIR /app

RUN npm run build -- --filter=client

# ==========================================
# PRODUCTION LAYER - Nginx
# ==========================================
FROM nginx:1.27-alpine AS production

RUN apk add --no-cache dumb-init

COPY apps/client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

RUN addgroup -g 1001 -S nginx-user && \
  adduser -S nginx-user -u 1001 -G nginx-user && \
  chown -R nginx-user:nginx-user /usr/share/nginx/html && \
  chown -R nginx-user:nginx-user /var/cache/nginx && \
  chown -R nginx-user:nginx-user /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown -R nginx-user:nginx-user /var/run/nginx.pid

USER nginx-user

EXPOSE 80  # Client
# EXPOSE 81 for Admin

ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
```

### API Pattern (Different)

```dockerfile
FROM node:25-alpine AS base  # Note: Node 25 vs 24.12.0

# ... base + dependencies same ...

FROM dependencies AS development
WORKDIR /app/apps/api
EXPOSE 3000
# ... non-root nestjs user ...
CMD ["npm", "run", "start:dev"]

FROM dependencies AS builder
COPY . .
WORKDIR /app
RUN npm run build -- --filter=api

# ==========================================
# PRODUCTION DEPENDENCIES LAYER (API only)
# ==========================================
FROM base AS production-deps
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts --omit=dev

# ==========================================
# PRODUCTION LAYER - Node.js
# ==========================================
FROM node:25-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001 -G nodejs

COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package*.json ./

USER nestjs

ENV NODE_ENV=production PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

## Key Optimizations

### 1. Monorepo COPY Strategy
```dockerfile
# Copy only package.json files first (cache layer)
COPY package*.json ./
COPY turbo.json ./
COPY packages/*/package.json ./packages/*/
COPY apps/client/package*.json ./apps/client/

# Install deps (cached if package.json unchanged)
RUN npm ci

# Copy source (frequently changes, won't invalidate deps cache)
COPY . .
```

### 2. BuildKit Cache Mounts
```dockerfile
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts
```
- Persists npm cache across builds
- Faster installs (no re-download)

### 3. Non-Root Security
```dockerfile
RUN addgroup -g 1001 -S nodejs && \
  adduser -S viteuser -u 1001 -G nodejs

USER viteuser
```
- All production containers run as uid 1001
- Reduces attack surface

### 4. dumb-init Signal Handling
```dockerfile
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]
```
- Proper SIGTERM/SIGINT handling
- Clean shutdowns

### 5. Turborepo Builds
```dockerfile
RUN npm run build -- --filter=client
```
- Uses Turbo caching
- Only builds target app + dependencies

## Port Mapping

| Service | Dev Port | Prod Port (Internal) | External Access |
|---------|----------|----------------------|-----------------|
| Client | 5173 | 80 | nginx / (dev: 5173) |
| Admin | 5174 | 81 | nginx /admin (dev: 5174) |
| API | 3000 | 3000 | nginx /api (dev: 3000) |
| Nginx | - | 80/443 | 80/443 |

## Volume Mounts (Dev)

```yaml
volumes:
  - .:/app                        # Mount monorepo root
  - /app/node_modules             # Exclude (use container's)
  - /app/apps/client/node_modules # Exclude (use container's)
```

**Why exclude node_modules?**
- Prevents host/container conflicts
- Uses container-built dependencies
- Faster on macOS/Windows (no bind mount overhead)

## Health Checks

**Client/Admin**:
```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost:5173"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**API**:
```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
```

**Nginx** (production only):
```yaml
depends_on:
  nail-client:
    condition: service_healthy
  nail-admin:
    condition: service_healthy
  nail-api:
    condition: service_healthy
```

## Resource Limits (Production)

```yaml
deploy:
  resources:
    limits:
      cpus: "0.25"        # 25% of 1 CPU
      memory: 256M        # 256 MB RAM
    reservations:
      cpus: "0.1"
      memory: 128M
```

**Allocations**:
- Client: 0.25 CPU / 256M
- Admin: 0.25 CPU / 256M
- API: 0.5 CPU / 512M

## Log Rotation

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```
- Max 30MB logs per container
- 3 files × 10MB

## Commands

**Development**:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

**Production**:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

**Logs**:
```bash
docker compose logs -f nail-client
docker compose logs -f nail-api
```

**Shell**:
```bash
docker exec -it nail-client sh
docker exec -it nail-api sh
```

---

**Status**: Production-ready
**Strategy**: Multi-stage with monorepo optimization
**Security**: Non-root users, dumb-init, resource limits
**Performance**: BuildKit cache, layer optimization
