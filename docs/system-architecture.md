# System Architecture

Pink Nail Salon - Turborepo Monorepo Architecture

---

## High-Level Overview

**Monorepo**: Turborepo with 3 apps + 7 shared packages
**Architecture**: Client (5173) + Admin (5174) → API (3000) → MongoDB/Redis/Cloudinary
**Build System**: Turborepo 2.3 (7s full / 89ms cached)

**Production**: Nginx reverse proxy routing:
- `/` → client (apps/client)
- `/admin` → admin (apps/admin)
- `/api` → api (apps/api)

---

## Monorepo Structure

```
pink-nail-salon/
├── apps/                    # Applications
│   ├── client/              # Customer website (React + Vite)
│   ├── admin/               # Admin dashboard (React + Vite)
│   └── api/                 # Backend API (NestJS)
├── packages/                # Shared packages
│   ├── types/               # TypeScript types (eliminates duplication)
│   ├── utils/               # Utilities (cn, formatters, hooks)
│   ├── typescript-config/   # TS configs (base, react, nestjs)
│   ├── eslint-config/       # ESLint rules (react, nestjs)
│   ├── tailwind-config/     # Tailwind themes (client, admin)
│   └── prettier-config/     # Code formatting
├── tooling/                 # Development tooling
│   └── prettier-config/     # Prettier config
├── turbo.json               # Turborepo configuration
├── package.json             # Root workspace config
└── docker-compose*.yml      # Docker orchestration
```

**Benefits**:
- **Type Safety**: Single source of truth via @repo/types
- **Build Speed**: 79x faster with Turbo caching
- **Code Reuse**: 7 shared packages eliminate duplication
- **Atomic Commits**: Single commit affects all apps

---

## Component Architecture

### Frontend Layer

**apps/client** (Customer-facing)
- Port: 5173 (dev) / served from / (prod)
- React 19.2 + Vite 7.2 + TypeScript 5.9
- Tailwind CSS v4 (warm theme via @repo/tailwind-config/client-theme)
- Radix UI, React Router v7, Zustand
- Shared: @repo/types, @repo/utils

**apps/admin** (Admin dashboard)
- Port: 5174 (dev) / served from /admin (prod)
- React 19.2 + Vite 7.2 + TypeScript 5.9
- Tailwind CSS v4 (blue theme via @repo/tailwind-config/admin-theme)
- Shadcn/ui, TanStack Table, Zustand, Firebase Storage
- Shared: @repo/types, @repo/utils

### Backend Layer

**apps/api** (REST API)
- Port: 3000
- NestJS 11 + TypeScript 5.7 + Node.js 25
- MongoDB (Mongoose) for data
- Redis (ioredis) for caching
- JWT authentication (access + refresh tokens)
- Argon2 password hashing
- Cloudinary image storage
- Shared: @repo/types (aligned with frontend)

### Shared Packages Layer

**@repo/types** - TypeScript type definitions
- Eliminates 100% type duplication
- Single source of truth for Service, Gallery, Booking, Auth types
- Used by all apps (client, admin, API)

**@repo/utils** - Shared utilities
- `cn` - Tailwind class merger
- `formatCurrency`, `formatDate`, `formatPhoneNumber`
- `useDebounce` - Shared React hook

**@repo/typescript-config** - TS configurations
- `base.json` - Strict mode, ES2022, verbatimModuleSyntax
- `react.json` - React-specific settings
- `nestjs.json` - Node.js backend settings

**@repo/eslint-config** - Linting rules
- `react.js` - React + TypeScript + Perfectionist
- `nestjs.js` - NestJS linting

**@repo/tailwind-config** - Theme configurations
- `client-theme.js` - Warm/cozy/feminine theme
- `admin-theme.js` - Professional/modern/blue theme
- Design system separation (intentional)

### External Services

**MongoDB Atlas**
- Primary database
- Document storage for services, gallery, bookings, users

**Redis Cloud**
- Session caching
- Rate limiting storage
- Query result caching

**Cloudinary**
- Image upload and storage
- Image transformations
- CDN delivery

---

## Network Architecture

### Development Mode

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

**Features**:
- CORS enabled for localhost ports
- Hot-reload via CHOKIDAR_USEPOLLING=true
- Volume mounts for entire monorepo
- BuildKit cache mounts for dependencies

### Production Mode

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

**Features**:
- Multi-stage Dockerfiles (optimized builds)
- Turbo builds with `--filter` flag
- BuildKit cache mounts
- Non-root users (uid 1001)
- Health checks + dependencies
- Resource limits (CPU, memory)
- Log rotation
- Static file caching via Nginx

---

## Data Flow

### Customer Booking Flow

```
Client → API → MongoDB
  ↓       ↓
  ↓    Cloudinary (if image upload)
  ↓       ↓
  ↓    Redis (cache invalidation)
  ↓       ↓
  ←───────┘
```

### Admin Management Flow

```
Admin → API → MongoDB
  ↓      ↓
  ↓   Validation + Auth check
  ↓      ↓
  ↓   Update data
  ↓      ↓
  ↓   Clear Redis cache
  ↓      ↓
  ←──────┘
```

### Gallery Display Flow

```
Client → API
  ↓       ↓
  ↓    Check Redis cache
  ↓       ↓
  ↓    If miss: MongoDB
  ↓       ↓
  ↓    Cache result
  ↓       ↓
  ←───────┘
  ↓
Display (Cloudinary CDN URLs)
```

---

## Authentication Flow

```
1. Login Request
   Client/Admin → POST /auth/login
                    ↓
              Validate credentials (Argon2)
                    ↓
              Generate tokens (JWT)
                    ↓
              Store refresh token (MongoDB)
                    ↓
              Return access + refresh tokens

2. Authenticated Request
   Client/Admin → GET /api/resource (Bearer token)
                    ↓
              Verify access token
                    ↓
              Execute request
                    ↓
              Return response

3. Token Refresh
   Client/Admin → POST /auth/refresh (refresh token)
                    ↓
              Validate refresh token (MongoDB)
                    ↓
              Generate new access token
                    ↓
              Return new access token
```

---

## Deployment Architecture

### Docker Compose Stack

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

### Container Communication

- **Development**: Direct port access
- **Production**: Nginx proxy routing via internal network

---

## Scalability Considerations

### Current Architecture

- Single API instance
- External managed services (MongoDB Atlas, Redis Cloud)
- Stateless API design (JWT tokens)

### Future Scaling Path

1. **Horizontal API Scaling**
   - Add load balancer before API
   - Deploy multiple API instances
   - Session state in Redis (already implemented)

2. **Database Optimization**
   - MongoDB read replicas
   - Query optimization
   - Index tuning

3. **Caching Strategy**
   - Increase Redis usage
   - CDN for static assets (Cloudinary already provides this)
   - API response caching

4. **Microservices (if needed)**
   - Split services module
   - Split booking module
   - Split gallery module
   - Event-driven communication

---

## Security Architecture

### API Security

- JWT authentication (RS256)
- Argon2 password hashing
- Rate limiting (@nestjs/throttler + Redis)
- Input validation (class-validator)
- CORS configuration
- Environment variable secrets

### Frontend Security

- HTTP-only cookies (if using cookie strategy)
- XSS protection (React escaping)
- HTTPS enforcement (production)
- Content Security Policy (via Nginx)

### Infrastructure Security

- Nginx reverse proxy (hides internal services)
- No direct database access from frontend
- Cloudinary signed uploads (if needed)
- Regular dependency updates

---

## Build System (Turborepo)

### turbo.json Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": { "outputs": [] },
    "type-check": { "outputs": [] },
    "clean": { "cache": false }
  }
}
```

### Build Performance

**Full Build** (all apps, parallel):
- Time: 7.023s
- Apps: client + admin + API
- Dependency graph: respects `^build` (packages first)

**Cached Build** (FULL TURBO):
- Time: 89ms
- Improvement: 79x faster (98.7% time reduction)
- Cache hit rate: 100% on repeat builds

### Task Execution

**Parallel Tasks**:
- `npm run type-check` - All apps in parallel (3.937s)
- `npm run lint` - All apps in parallel
- `npm run dev` - All apps in parallel (persistent)

**Sequential Tasks**:
- `npm run build` - Respects dependency graph (packages → apps)

### Filtering

```bash
# Build specific app
npx turbo build --filter=client
npx turbo build --filter=admin
npx turbo build --filter=api

# Run specific app in dev mode
npx turbo dev --filter=client
```

### Caching Strategy

**Local Cache**:
- Location: `.turbo/cache`
- Stores: Build outputs, task results
- Invalidation: On source file changes, dependency changes, env var changes

**Remote Cache** (future):
- Vercel Remote Cache
- GitHub Actions cache
- Self-hosted Turbo server

---

## Monitoring & Observability

### Health Checks

- API: `GET /health` endpoint
- Docker: Container health checks
- Database: MongoDB Atlas monitoring
- Cache: Redis Cloud monitoring

### Logging

- API: NestJS built-in logger
- Nginx: Access + error logs
- Docker: Container logs via `docker compose logs`

### Metrics (Future)

- Request latency
- Error rates
- Cache hit rates
- Database query performance

---

## Migration Summary

**Turborepo Migration**: 2025-12-31 (Complete)
**Phases**: 7/7 complete
**Duration**: ~2 hours

**Achievements**:
- ✅ Turborepo setup with npm workspaces
- ✅ 7 shared packages created
- ✅ Type duplication eliminated (100% → 0%)
- ✅ Build caching enabled (79x faster)
- ✅ Docker migration complete (monorepo-aware)
- ✅ All tests passing

**Performance**:
- Before: ~20s per app (sequential builds)
- After: 7s full / 89ms cached (parallel builds)

---

**Last Updated**: 2025-12-31
**Architecture Version**: 0.1.0 (Turborepo Monorepo)
**Status**: Production-ready
**Migration**: Complete (7/7 phases)
