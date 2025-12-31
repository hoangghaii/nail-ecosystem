# Docker Compose Best Practices Research (2025)
## Development vs Production Environments

**Date**: 2025-12-27
**Research Focus**: Separation of concerns, hot reload, volume strategies, environment management, health checks, resource limits, networking, Nginx patterns
**Target Stack**: React 19 + Vite 7 + TypeScript + Node.js + Docker Compose

---

## Executive Summary

Docker Compose remains the standard for multi-container development and single-server production deployments in 2025. Key shifts from previous years:

- **Compose File Versioning**: The `version` field is now **obsolete**—modern files omit it entirely
- **BuildKit Standard**: `DOCKER_BUILDKIT=1` is now default behavior; cache mounts significantly improve rebuild times
- **compose.override.yml Pattern**: Automatically loaded in dev; supersedes previous `docker-compose.yml` + `-f prod.yml` approach
- **Health Checks + Conditional Dependencies**: Prevents service startup race conditions using `condition: service_healthy`
- **Docker Secrets**: Production mandatory for sensitive data; `.env` files prohibited in version control
- **Vite HMR Configuration**: Requires explicit `host: "0.0.0.0"`, `watch.usePolling: true`, and `hmr.clientPort` settings

---

## 1. Separation of Concerns: Compose File Architecture

### 1.1 Modern Pattern (2025 Recommended)

Use file composition instead of monolithic files:

```
docker-compose/
├── compose.yaml              # Base configuration (dev + prod common)
├── compose.override.yaml     # Dev overrides (auto-loaded)
├── compose.prod.yaml         # Production overrides (-f flag)
└── .dockerignore
```

### 1.2 Base Compose File (`compose.yaml`)

```yaml
# Minimal, environment-agnostic service definitions
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      cache_from:
        - type=gha  # GitHub Actions cache (if applicable)
    image: nail-admin:latest
    # No ports, no volumes, no restart policy
    networks:
      - app-network
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173/_ping"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 20s

  postgres:
    image: postgres:16-alpine
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  redis:
    image: redis:7-alpine
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:1.27-alpine
    networks:
      - app-network
    depends_on:
      app:
        condition: service_healthy
    # Port binding defined in overrides

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### 1.3 Development Override (`compose.override.yaml`)

**Auto-loaded by default. Enables hot reload and debug tooling.**

```yaml
services:
  app:
    build:
      target: development  # Multi-stage target
    ports:
      - "5173:5173"        # Vite dev server
    volumes:
      - ./src:/app/src     # Hot reload
      - ./public:/app/public
    environment:
      - NODE_ENV=development
      - DEBUG=true
      - VITE_USE_MOCK_API=true
    command: npm run dev
    restart: on-failure

  postgres:
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${DB_USER:-admin}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password123}
      POSTGRES_DB: ${DB_NAME:-nail_admin_dev}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    ports:
      - "80:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/nginx.conf:ro
      - ./dist:/usr/share/nginx/html:ro
    depends_on:
      app:
        condition: service_started  # Don't wait for health in dev
```

### 1.4 Production Compose (`compose.prod.yaml`)

**Activated with**: `docker compose -f compose.yaml -f compose.prod.yaml up -d`

```yaml
services:
  app:
    image: registry.example.com/nail-admin:1.0.0  # Pre-built image
    restart: always
    # NO volumes for source code
    environment:
      - NODE_ENV=production
      - VITE_USE_MOCK_API=false
      - LOG_LEVEL=warn
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    secrets:
      - db_password
      - api_key

  postgres:
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password  # From Docker secret
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: json-file
      options:
        max-size: "20m"
        max-file: "5"

  nginx:
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
      - /var/log/nginx:/var/log/nginx
    depends_on:
      app:
        condition: service_healthy

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
```

### 1.5 Usage Commands

```bash
# Development (auto-loads compose.override.yaml)
docker compose up
docker compose up -d
docker compose logs -f app

# Production
docker compose -f compose.yaml -f compose.prod.yaml up -d
docker compose -f compose.yaml -f compose.prod.yaml logs postgres

# Validation
docker compose config                           # View merged config
docker compose config --environment             # Show interpolated vars
```

---

## 2. Hot Reload Configuration for Vite Development Servers

### 2.1 Critical Vite Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    // CRITICAL: Must be "0.0.0.0" for Docker, NOT localhost/127.0.0.1
    host: '0.0.0.0',

    // Default port inside container
    port: 5173,

    // Enable polling for Docker file system
    watch: {
      usePolling: true,
      interval: 100,  // Check every 100ms (adjust if CPU intensive)
      binaryInterval: 300,
    },

    // HMR configuration for Docker
    hmr: {
      host: 'localhost',          // Browser-visible hostname
      port: 5173,                 // Browser-visible port
      protocol: 'ws',
    },

    // Middleware config
    middlewareMode: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2.2 Dockerfile with Development Target

```dockerfile
# Multi-stage: separate build and dev stages

# Development stage
FROM node:20-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

# Enable HMR polling explicitly
ENV VITE_HMR_PROTOCOL=ws
ENV VITE_HMR_HOST=localhost
ENV VITE_HMR_PORT=5173

CMD ["npm", "run", "dev"]

# Production build stage
FROM node:20-alpine AS production-build
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production runtime stage
FROM nginx:1.27-alpine AS production
COPY --from=production-build /app/dist /usr/share/nginx/html
COPY nginx/prod.conf /etc/nginx/nginx.conf
EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

### 2.3 Docker Compose Dev Service

```yaml
services:
  app:
    build:
      context: .
      target: development      # Use dev stage
      args:
        VITE_HMR_PROTOCOL: ws
        VITE_HMR_HOST: localhost
        VITE_HMR_PORT: 5173

    # Critical for hot reload
    volumes:
      - ./src:/app/src         # Source code
      - ./public:/app/public   # Static assets
      - ./vite.config.ts:/app/vite.config.ts:ro  # Config
      - /app/node_modules      # Exclude node_modules

    ports:
      - "5173:5173"           # Vite dev server

    environment:
      - NODE_ENV=development
      - VITE_HMR_PROTOCOL=ws
      - VITE_HMR_HOST=localhost
      - VITE_HMR_PORT=5173

    # Quick restart on errors
    restart: on-failure

    # View logs in real-time
    stdin_open: true
    tty: true
```

### 2.4 Troubleshooting Hot Reload Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Files change but no reload | Watch not polling | `usePolling: true` + proper mount |
| WebSocket connection fails | HMR port mismatch | Browser port must match `hmr.port` |
| High CPU usage | Polling too frequent | Increase `interval` to 300-500ms |
| WSL2 issues | Host mismatch | Use IP address, not `localhost` |
| React HMR fails | Missing plugin | Ensure `@vitejs/plugin-react` installed |

---

## 3. Volume Mount Strategies

### 3.1 Bind Mounts vs Named Volumes: Decision Matrix

| Criterion | Bind Mount | Named Volume |
|-----------|-----------|--------------|
| **Use Case** | Development source code | Database persistence |
| **Portability** | Host-dependent | Docker-managed |
| **Performance** | Slower (Docker Desktop) | Faster (native) |
| **Host Access** | Direct file system | Requires `docker cp` |
| **Backups** | Simple copy | `docker compose run --rm` |
| **Security** | Lower (direct access) | Higher (Docker managed) |
| **Multi-container** | OK for single host | Better for sharing |

### 3.2 Development Volume Strategy

**Pattern**: Bind mounts for rapid iteration

```yaml
services:
  app:
    volumes:
      # Source code for hot reload
      - ./src:/app/src:cached
      - ./public:/app/public:cached
      - ./vite.config.ts:/app/vite.config.ts:ro

      # Local npm cache (speeds up reinstalls)
      - ~/.npm:/root/.npm:cached

      # Exclude node_modules from sync
      - /app/node_modules
      - /app/dist

    # For macOS Docker Desktop performance
    # cached = host write-through, container read-cached
```

### 3.3 Production Volume Strategy

**Pattern**: Named volumes for data persistence, NO code volumes

```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # No bind mounts

  redis:
    volumes:
      - redis_data:/data

  app:
    # NO volumes for application code
    # Code embedded in immutable image

volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: nfs           # For remote NFS mounts in production
      o: addr=nfs.example.com,vers=4,soft,timeo=180,bg,tcp,rw
      device: ":/export/data"

  redis_data:
    driver: local
```

### 3.4 Volume Performance Tips

**macOS Docker Desktop** (significant performance impact):
```yaml
volumes:
  # Use cached mount for better performance
  - ./src:/app/src:cached

  # Delegated = container sees writes immediately (less consistency)
  - ./public:/app/public:delegated

  # Read-only when possible
  - ./config:/app/config:ro
```

**Linux** (native Docker, no cached/delegated needed):
```yaml
volumes:
  - ./src:/app/src           # Default behavior is fast
```

**Backup/Restore Named Volumes**:
```bash
# Backup
docker compose run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore
docker compose run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

---

## 4. Environment Variable Management

### 4.1 Precedence Hierarchy (2025)

Variables override in this order (highest to lowest):

1. **Shell environment** (`export VAR=value`)
2. **`environment:` in compose.yaml**
3. **`env_file:` in compose.yaml** (files listed later override earlier)
4. **`.env` file** (automatic, at compose root)
5. **Dockerfile ENV** (lowest priority)

### 4.2 .env File Structure & Security

**File**: `.env` (at `docker-compose/` root)

```env
# Database
DB_USER=admin
DB_PASSWORD=changeme123              # NEVER commit to git!
DB_NAME=nail_admin_dev
DB_HOST=postgres
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379

# App Config
NODE_ENV=development
VITE_USE_MOCK_API=true
LOG_LEVEL=debug
API_TIMEOUT=30000

# Firebase (only example, use Docker Secrets in prod)
VITE_FIREBASE_PROJECT_ID=nail-project
VITE_FIREBASE_API_KEY=AIzaSyD...  # Use secrets in production!
```

**Security**: Add to `.gitignore`:
```gitignore
.env
.env.local
.env.*.local
secrets/
```

### 4.3 Production: Docker Secrets (Mandatory)

**File**: `secrets/db_password.txt`
```
secure_password_123
```

**Compose file**:
```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt  # Owned by root, mode 0600
```

**App reads secret**:
```bash
# Inside container, secrets available at /run/secrets/[name]
DB_PASSWORD=$(cat /run/secrets/db_password)
```

### 4.4 Environment File per Stage

```
docker-compose/
├── .env              # Default (dev)
├── .env.dev          # Development explicit
├── .env.staging      # Staging
├── .env.prod         # Production (use secrets instead!)
└── .dockerignore
```

**Usage**:
```bash
# Load specific env file
docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml up
```

### 4.5 Variable Interpolation in Compose Files

```yaml
services:
  postgres:
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}

    volumes:
      - postgres_data:/var/lib/postgresql/data

    # Default values if variable not set
    ports:
      - "${DB_PORT:-5432}:5432"

  app:
    # Conditional service based on env
    ${ENABLE_REDIS:+redis:}

    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# View interpolated variables
# docker compose config --environment
```

---

## 5. Health Checks Configuration

### 5.1 Health Check Anatomy

```yaml
services:
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]

      # How often to run (default: 30s)
      interval: 10s

      # Max time to wait for response (default: 5s)
      timeout: 5s

      # Consecutive failures before unhealthy (default: 3)
      retries: 5

      # Grace period before checks start (default: 0s)
      start_period: 10s

      # Minimum time between checks during startup (default: interval)
      start_interval: 5s
```

### 5.2 Health Check Examples by Service

**React/Vite App**:
```yaml
app:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:5173/_ping"]
    interval: 10s
    timeout: 3s
    retries: 3
    start_period: 20s  # Vite takes time to start
```

**PostgreSQL**:
```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 10s
```

**Redis**:
```yaml
redis:
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 3s
    retries: 3
```

**Nginx**:
```yaml
nginx:
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
    interval: 30s
    timeout: 3s
    retries: 3
    start_period: 10s
```

### 5.3 Conditional Dependencies (Critical!)

**Problem**: `docker compose up` starts all services without waiting for readiness. API starts before database is ready → connection errors.

**Solution**: Use `condition: service_healthy`

```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy    # Wait for postgres health check
      redis:
        condition: service_healthy    # Wait for redis health check

  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
```

### 5.4 Troubleshooting Health Checks

**Error**: `depends_on contains condition: service_healthy but no healthcheck defined`

**Fix**: Ensure service defines a `healthcheck` block.

**Error**: Health check always fails

**Common causes**:
- Command not installed in image (e.g., `curl` missing)
- Wrong port/protocol
- Too short timeout
- Too strict retries

**Debug**:
```bash
docker compose exec postgres pg_isready -U admin  # Manual test
docker compose logs postgres                       # View logs
docker ps                                          # Check health status
```

**Performance Consideration**:
- High `interval` (e.g., 5s) across many services = CPU overhead
- Use 10-30s intervals for production
- Reduce retries if acceptable (3-5 typical)

---

## 6. Resource Limits and Restart Policies

### 6.1 Resource Limits (Production Critical)

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'           # Max 1 CPU core
          memory: 1G            # Max 1GB RAM

        reservations:
          cpus: '0.5'           # Guaranteed 0.5 cores
          memory: 512M          # Guaranteed 512MB

    logging:
      driver: json-file
      options:
        max-size: "10m"         # Rotate logs at 10MB
        max-file: "3"           # Keep 3 rotated logs

  postgres:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

    logging:
      driver: json-file
      options:
        max-size: "20m"
        max-file: "5"

  redis:
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 128M
```

### 6.2 Restart Policies

**Development**:
```yaml
restart: on-failure        # Restart only if exit code != 0
restart: unless-stopped    # Always restart unless explicitly stopped
```

**Production**:
```yaml
restart: always            # ALWAYS restart (prevents downtime)
```

**Never use in production**:
```yaml
restart: no                # Don't restart (WRONG for production)
```

### 6.3 Policy Comparison

| Policy | Behavior | Use Case |
|--------|----------|----------|
| `no` | Don't restart | Dev (manual restarts) |
| `on-failure` | Restart if exit != 0 | Tests, one-off commands |
| `unless-stopped` | Always unless explicit stop | Dev long-running |
| `always` | Always (Docker daemon restart) | Production |

---

## 7. Networks and Service Dependencies

### 7.1 Custom Network Best Practice

```yaml
services:
  app:
    networks:
      - app-network
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/nail_admin
      # Services communicate via service name on custom network

  postgres:
    networks:
      - app-network

  redis:
    networks:
      - app-network

  nginx:
    networks:
      - app-network

# Named network (default is bridge)
networks:
  app-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: br-nail-admin
```

### 7.2 DNS Resolution Inside Containers

On custom networks, services resolve via hostname:

```bash
# Inside app container
curl http://postgres:5432/  # Resolves to postgres container IP
redis-cli -h redis         # Resolves to redis container IP
```

### 7.3 Network Isolation

For multi-application setups:

```yaml
# Only expose specific services
services:
  api:
    networks:
      - backend

  postgres:
    networks:
      - backend

  nginx:
    networks:
      - frontend
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No outbound internet access
```

---

## 8. Nginx Reverse Proxy Pattern (React/SPA Deployments)

### 8.1 Architecture Overview

```
Client → Nginx (Port 80/443)
        ├─→ /api/* → Node.js backend
        ├─→ /* → React SPA (dist/)
        └─→ Health checks → App service
```

### 8.2 Production Nginx Configuration

**File**: `nginx/prod.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/rss+xml font/truetype font/opentype
               application/vnd.ms-fontobject image/svg+xml;

    # Upstream backend service
    upstream app_backend {
        server app:5173;
    }

    # HTTP → HTTPS redirect
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name nail.example.com;

        # SSL certificates (from volume mount)
        ssl_certificate /etc/nginx/certs/cert.pem;
        ssl_certificate_key /etc/nginx/certs/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # SPA routing: all requests → index.html (except API)
        root /usr/share/nginx/html;
        index index.html;

        # API proxy
        location /api/ {
            proxy_pass http://app_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check endpoint
        location /_health {
            access_log off;
            return 200 "healthy";
            add_header Content-Type text/plain;
        }

        # Static files (cache forever)
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA fallback: 404 → index.html for client-side routing
        location / {
            try_files $uri $uri/ /index.html;
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
```

### 8.3 Development Nginx Configuration

**File**: `nginx/dev.conf`

```nginx
user nginx;
worker_processes 1;

events {
    worker_connections 512;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;

    upstream app_backend {
        server app:5173;
    }

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;

        # API proxy to dev server
        location /api/ {
            proxy_pass http://app_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Vite HMR WebSocket
        location /ws {
            proxy_pass http://app_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

### 8.4 Docker Compose Integration (Nginx + React)

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf:ro
      - ./dist:/usr/share/nginx/html:ro  # Built React app
      - ./certs:/etc/nginx/certs:ro      # SSL certificates
    depends_on:
      app:
        condition: service_healthy
    networks:
      - app-network
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  app:
    # Vite dev server or Express backend
    # Port 5173 NOT exposed (only via Nginx)
    networks:
      - app-network
```

### 8.5 Building React for Production in Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build        # Outputs to ./dist

# Stage 2: Production (Nginx)
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/prod.conf /etc/nginx/nginx.conf
EXPOSE 80 443
HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

---

## 9. Real-World Examples: Nail Admin Stack

### 9.1 Complete Development Setup

```yaml
# compose.yaml (base)
version: '3.8'  # Note: Can be omitted in modern Compose

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    image: nail-admin:dev
    networks:
      - nail-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173/"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 20s

  postgres:
    image: postgres:16-alpine
    networks:
      - nail-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-admin}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    networks:
      - nail-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:1.27-alpine
    networks:
      - nail-network
    depends_on:
      app:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:

networks:
  nail-network:
    driver: bridge
```

```yaml
# compose.override.yaml (auto-loaded)
services:
  app:
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src:cached
      - ./public:/app/public:cached
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_USE_MOCK_API=true
      - DEBUG=true
    command: npm run dev

  postgres:
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: devpass123
      POSTGRES_DB: nail_admin_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    ports:
      - "80:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      app:
        condition: service_started  # Don't wait in dev
```

```yaml
# compose.prod.yaml
services:
  app:
    image: registry.example.com/nail-admin:1.0.0
    restart: always
    environment:
      - NODE_ENV=production
      - VITE_USE_MOCK_API=false
      - LOG_LEVEL=warn
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  nginx:
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
```

### 9.2 Typical Development Workflow

```bash
# Start all services
docker compose up

# View logs
docker compose logs -f app

# Execute commands
docker compose exec app npm install

# Scale database for testing
docker compose up -d --scale postgres=2

# Stop and clean
docker compose down --volumes

# Production deployment
docker compose -f compose.yaml -f compose.prod.yaml up -d

# View production logs
docker compose -f compose.yaml -f compose.prod.yaml logs postgres
```

---

## 10. Key Recommendations Summary

### Development Priorities

1. **Use `compose.override.yaml`** for automatic dev-only config
2. **Bind mount source code** with `usePolling: true` for Vite HMR
3. **Configure host: "0.0.0.0"** in Vite to enable HMR in Docker
4. **Use named volumes** for databases (not bind mounts)
5. **Exclude node_modules** from volume mounts: `- /app/node_modules`
6. **Don't restart in dev** (`restart: on-failure` only)

### Production Priorities

1. **Remove all source code volumes** (code in image only)
2. **Use Docker Secrets** for sensitive data (never `.env` files)
3. **Set `restart: always`** for high availability
4. **Configure resource limits** (CPU, memory, logging)
5. **Implement health checks** with `condition: service_healthy`
6. **Use pre-built images** (tag with version, not `latest`)
7. **Add Nginx reverse proxy** for SSL/compression/caching
8. **Enable logging with max-size** to prevent disk overflow

### Security

1. Run as non-root user (`USER node` in Dockerfile)
2. Use `.dockerignore` (exclude secrets, node_modules, git)
3. Never commit `.env` files
4. Scan images: `docker scout cves image:tag`
5. Keep base images updated (`node:20-alpine`, etc.)
6. Use secrets for passwords/keys (not environment variables)

### Performance

1. **Multi-stage builds** reduce image size (50-70% reduction typical)
2. **Layer caching**: Copy `package*.json` before source code
3. **BuildKit**: `DOCKER_BUILDKIT=1` speeds up builds
4. **Health check intervals**: 10-30s typical (balance between overhead and responsiveness)
5. **Volume caching**: Use `:cached` on macOS Docker Desktop
6. **Nginx gzip**: Compress responses (10-50% reduction typical)

---

## References & Sources

### Docker Compose Official

- [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)
- [Use Compose in Production](https://docs.docker.com/compose/how-tos/production/)
- [Environment Variables Best Practices](https://docs.docker.com/compose/how-tos/environment-variables/best-practices/)
- [Control Startup Order](https://docs.docker.com/compose/how-tos/startup-order/)

### Vite + Docker

- [Vite Hot Module Reloading in Docker](https://patrickdesjardins.com/blog/docker-vitejs-hot-reload)
- [Dockerizing React + Vite with Hot Reloading](https://medium.com/@sankettikam17/dockerizing-your-react-app-with-hot-reloading-yarn-and-vite-a-smooth-development-workflow-303ae51ac11a)
- [Innokrea: Dockerizing the frontend with React.js + Vite](https://www.innokrea.com/dockerizing-the-frontend-do-it-right-with-react-js-vite/)

### Best Practices (2025)

- [Modern Docker Best Practices for 2025](https://talent500.com/blog/modern-docker-best-practices-2025/)
- [Docker Best Practices 2025 - Thinksys](https://thinksys.com/devops/docker-best-practices/)
- [6 Docker Compose Best Practices for Dev and Prod](https://release.com/blog/6-docker-compose-best-practices-for-dev-and-prod)
- [Nick Janetakis: Production-Ready Web Apps](https://nickjanetakis.com/blog/best-practices-around-production-ready-web-apps-with-docker-compose)

### Nginx + React

- [FreeCodeCamp: Deploy React to Production with Docker/NGINX](https://www.freecodecamp.org/news/how-to-deploy-react-apps-to-production/)
- [DEV Community: Dockerizing React with NGINX](https://dev.to/bahachammakhi/dockerizing-a-react-app-with-nginx-using-multi-stage-builds-1nfm)
- [Multi-containerized React with NGINX Reverse Proxy](https://medium.com/@olawalekareemdev/multi-containarized-react-appliation-with-nginx-as-a-reverse-proxy-using-docker-compose-f46691b4d5ad)

### Health Checks & Dependencies

- [Docker Compose Health Checks (2025 Guide)](https://www.tvaidyan.com/2025/02/13/health-checks-in-docker-compose-a-practical-guide/)
- [Health Checks: Practical Guide](https://last9.io/blog/docker-compose-health-checks/)
- [Forget wait-for-it: Use Health Checks](https://www.denhox.com/posts/forget-wait-for-it-use-docker-compose-healthcheck-and-depends-on-instead/)

---

## Unresolved Questions

1. **Swarm vs Kubernetes trade-offs**: Research did not deeply cover orchestration beyond single-node Compose
2. **Specific performance metrics**: Polling intervals and CPU overhead benchmarks vary by workload
3. **Windows WSL2 HMR**: Known issues exist but not fully addressed in sources
4. **Nginx caching strategies**: Cache invalidation patterns for SPA assets need application-specific guidance

**End of Research Report**

---

*Generated*: 2025-12-27
*Research Conducted By*: Haiku 4.5 Research Agent
*Target Audience*: Nail Admin React/Vite development and DevOps teams
