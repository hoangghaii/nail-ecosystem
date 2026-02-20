# Architecture — Network & Deployment

---

## Development Mode

**Local Development** (`npm run dev` from root):
```
┌─────────────────────────────────────────┐
│  Turborepo (parallel execution)        │
│  ├─ apps/client:5173 (Vite HMR)       │
│  ├─ apps/admin:5174 (Vite HMR)        │
│  └─ apps/api:3000 (NestJS watch)      │
│     ├─ MongoDB (local or cloud)        │
│     ├─ Redis (local or cloud)          │
│     └─ Cloudinary (cloud)              │
└─────────────────────────────────────────┘
```

**Docker Development** (`docker compose -f docker-compose.yml -f docker-compose.dev.yml up`):
```
┌─────────────────────────────────────────┐
│  Docker Compose (hot-reload)           │
│  ├─ client:5173 (volume mounts)        │
│  ├─ admin:5174 (volume mounts)         │
│  ├─ api:3000 (volume mounts)           │
│  ├─ mongodb:27017 (container)          │
│  └─ redis:6379 (container)             │
└─────────────────────────────────────────┘
```

Features: CORS for localhost, CHOKIDAR_USEPOLLING=true, volume mounts for entire monorepo, BuildKit cache mounts.

---

## Production Mode

**Docker Production** (`docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`):
```
┌─────────────────────────────────────────┐
│  Nginx Reverse Proxy (80/443)          │
│  ├─ / → client:80 (static files)       │
│  ├─ /admin → admin:81 (static files)   │
│  └─ /api → api:3000 (NestJS + PM2)     │
│     ├─ mongodb:27017 (container)        │
│     └─ redis:6379 (container)           │
└─────────────────────────────────────────┘
```

Features:
- Multi-stage Dockerfiles (optimized builds)
- Turbo builds with `--filter` flag
- BuildKit cache mounts
- Non-root users (uid 1001)
- Health checks + service dependencies
- Resource limits (CPU, memory)
- Log rotation
- Static file caching via Nginx

---

## Docker Compose Stack Summary

**Development**:
```yaml
services:
  nail-client:  # Hot reload, port 5173
  nail-admin:   # Hot reload, port 5174
  nail-api:     # Watch mode, port 3000
```

**Production**:
```yaml
services:
  nail-client:  # Built static files
  nail-admin:   # Built static files
  nail-api:     # Production build
  nginx:        # Reverse proxy (port 80)
```

**Container Communication**:
- Development: Direct port access
- Production: Nginx proxy routing via internal Docker network
