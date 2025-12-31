# Docker Integration with Turborepo

**Date**: 2025-12-31

---

## Strategy

Use `turbo prune` to create minimal Docker contexts for each app, reducing build times and layer cache invalidation.

---

## Updated Dockerfile Pattern

### apps/client/Dockerfile

```dockerfile
# Stage 1: Prune workspace for client app
FROM node:20-alpine AS pruner
RUN npm install -g turbo pnpm
WORKDIR /app
COPY . .
RUN turbo prune client --docker

# Stage 2: Install dependencies
FROM node:20-alpine AS installer
RUN npm install -g pnpm
WORKDIR /app

# Copy package.json files (for dependency installation)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=pruner /app/out/full/ .

# Stage 3: Build the app
FROM installer AS builder
WORKDIR /app
RUN pnpm turbo build --filter=client

# Stage 4: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built app
COPY --from=builder /app/apps/client/dist ./dist
COPY --from=builder /app/apps/client/package.json ./

# Install production dependencies only
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

---

### apps/admin/Dockerfile

```dockerfile
FROM node:20-alpine AS pruner
RUN npm install -g turbo pnpm
WORKDIR /app
COPY . .
RUN turbo prune admin --docker

FROM node:20-alpine AS installer
RUN npm install -g pnpm
WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

FROM installer AS builder
WORKDIR /app
RUN pnpm turbo build --filter=admin

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/admin/dist ./dist
COPY --from=builder /app/apps/admin/package.json ./

RUN npm install -g serve

EXPOSE 5174
CMD ["serve", "-s", "dist", "-l", "5174"]
```

---

### apps/api/Dockerfile

```dockerfile
FROM node:20-alpine AS pruner
RUN npm install -g turbo pnpm
WORKDIR /app
COPY . .
RUN turbo prune api --docker

FROM node:20-alpine AS installer
RUN npm install -g pnpm
WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

FROM installer AS builder
WORKDIR /app
RUN pnpm turbo build --filter=api

FROM node:20-alpine AS runner
WORKDIR /app

# Copy built API
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

## Updated docker-compose.yml

```yaml
services:
  nail-client:
    build:
      context: .
      dockerfile: ./apps/client/Dockerfile
    container_name: nail-client
    hostname: nail-client-host
    restart: unless-stopped
    networks:
      - nail-network

  nail-admin:
    build:
      context: .
      dockerfile: ./apps/admin/Dockerfile
    container_name: nail-admin
    hostname: nail-admin-host
    restart: unless-stopped
    networks:
      - nail-network

  nail-api:
    build:
      context: .
      dockerfile: ./apps/api/Dockerfile
    container_name: nail-api
    hostname: nail-api-host
    restart: unless-stopped
    networks:
      - nail-network

networks:
  nail-network:
    driver: bridge
    name: nail-network
```

---

## docker-compose.dev.yml

```yaml
services:
  nail-client:
    build:
      target: installer
    command: pnpm turbo dev --filter=client
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/apps/client/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
      - VITE_API_BASE_URL=http://localhost:3000

  nail-admin:
    build:
      target: installer
    command: pnpm turbo dev --filter=admin
    ports:
      - "5174:5174"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/apps/admin/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
      - VITE_API_BASE_URL=http://localhost:3000

  nail-api:
    build:
      target: installer
    command: pnpm turbo dev --filter=api
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/apps/api/node_modules
    env_file:
      - ./apps/api/.env
```

---

## docker-compose.prod.yml

```yaml
services:
  nail-client:
    build:
      target: runner
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=production

  nail-admin:
    build:
      target: runner
    ports:
      - "5174:5174"
    environment:
      - NODE_ENV=production

  nail-api:
    build:
      target: runner
    ports:
      - "3000:3000"
    env_file:
      - ./apps/api/.env.production

  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - nail-client
      - nail-admin
      - nail-api
    networks:
      - nail-network
```

---

## Key Changes from Current Setup

1. **Build context**: Now root directory (was app directory)
2. **turbo prune**: Creates minimal context per app
3. **Multi-stage**: Separate pruner, installer, builder, runner
4. **Layer caching**: Dependencies layer separate from source layer
5. **Volume mounts**: Updated to monorepo structure
6. **Commands**: Use `pnpm turbo` instead of direct vite/nest commands

---

## Build Commands

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Build single service
docker compose build nail-client

# Rebuild without cache
docker compose build --no-cache
```

---

## Benefits

- **Faster builds**: Only rebuild changed apps
- **Better caching**: Dependencies cached separately
- **Smaller images**: Only include necessary files via turbo prune
- **Parallel builds**: Docker BuildKit + Turborepo parallelization
- **Consistent**: Same build process locally and CI/CD
