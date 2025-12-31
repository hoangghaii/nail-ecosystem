# Pink Nail Salon - Turborepo Monorepo

Complete nail salon business management system built with React, NestJS, and MongoDB in a Turborepo monorepo.

## Quick Overview

**Architecture**: Customer website + Admin dashboard + Backend API
**Build Performance**: 7s full build / 89ms cached (79x faster with Turbo)
**Type Safety**: 100% shared types, zero duplication
**Status**: Production-ready

## Monorepo Structure

```
pink-nail-salon/
├── apps/
│   ├── client/          # Customer website (React + Vite)
│   ├── admin/           # Admin dashboard (React + Vite)
│   └── api/             # Backend API (NestJS)
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── utils/           # Shared utilities (cn, formatters, hooks)
│   ├── typescript-config/  # TS configs (base, react, nestjs)
│   ├── eslint-config/   # ESLint rules (react, nestjs)
│   ├── tailwind-config/ # Tailwind themes (client, admin)
│   └── ui/              # UI components (intentionally empty)
├── tooling/
│   └── prettier-config/ # Code formatting config
├── turbo.json           # Turborepo configuration
└── docker-compose*.yml  # Docker orchestration
```

## Applications

| App | Description | Port (Dev/Prod) | Tech Stack |
|-----|-------------|-----------------|------------|
| **Client** | Customer-facing website | 5173 / 80 | React 19 + Vite 7 + Tailwind v4 |
| **Admin** | Business dashboard | 5174 / 81 | React 19 + Vite 7 + TanStack Table |
| **API** | Backend services | 3000 / 3000 | NestJS 11 + MongoDB + Redis |

## Shared Packages

| Package | Purpose | Exports |
|---------|---------|---------|
| `@repo/types` | TypeScript types | service, gallery, booking, auth |
| `@repo/utils` | Utilities + hooks | cn, formatters, useDebounce |
| `@repo/typescript-config` | TS configs | base, react, nestjs |
| `@repo/eslint-config` | Linting rules | react, nestjs |
| `@repo/tailwind-config` | Theme configs | base, client-theme, admin-theme |
| `@repo/prettier-config` | Code formatting | Standard config |

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Docker + Docker Compose (for containerized deployment)

### Development (Local)

```bash
# Install dependencies
npm install

# Run all apps in parallel
npm run dev

# Access:
# Client: http://localhost:5173
# Admin:  http://localhost:5174
# API:    http://localhost:3000
```

### Development (Docker)

```bash
# Setup environment files
cp apps/client/.env.example apps/client/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with MongoDB/Redis/Cloudinary credentials

# Start all services with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Access same ports as local dev
```

### Production (Docker)

```bash
# Build and start all services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Access via Nginx reverse proxy:
# http://localhost       → Client (customer website)
# http://localhost/admin → Admin (dashboard)
# http://localhost/api   → API (backend)
```

## Turborepo Commands

```bash
# Build all apps (7s full, 89ms cached)
npm run build

# Run all apps in dev mode
npm run dev

# Type-check all apps (3.9s)
npm run type-check

# Lint all apps
npm run lint

# Clean all caches
npm run clean

# Format code
npm run format
```

### Filtered Commands

```bash
# Build specific app
npx turbo build --filter=client
npx turbo build --filter=admin
npx turbo build --filter=api

# Run specific app
npx turbo dev --filter=client
```

## Tech Stack

### Frontend (Client + Admin)
- React 19.2 + TypeScript 5.9
- Vite 7.2 (SWC compiler)
- Tailwind CSS v4
- React Router v7
- Zustand (state) + TanStack Query (data)
- React Hook Form + Zod
- Motion (animations)

### Backend (API)
- NestJS 11 + TypeScript 5.7
- MongoDB + Mongoose
- Redis + ioredis
- JWT auth (access + refresh)
- Argon2 (password hashing)
- Cloudinary (image upload)
- class-validator + class-transformer

### DevOps
- Turborepo 2.3 (build system)
- Docker + Docker Compose
- Nginx (production proxy)
- npm workspaces

## Design Systems

**Client (Customer Website)**:
- Warm, cozy, feminine aesthetic
- Soft neutrals (beige, cream, warm grays)
- Border-based design (NO shadows)
- Organic shapes

**Admin (Dashboard)**:
- Professional, clean, modern
- Blue theme (shadcn/ui style)
- Glassmorphism with shadows
- Structured layouts

**Critical**: UI components NOT shared between apps due to distinct design systems.

## Environment Variables

### Client (`apps/client/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000  # Dev
VITE_API_BASE_URL=/api                    # Prod
```

### Admin (`apps/admin/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000  # Dev
VITE_USE_MOCK_API=true                    # Dev with mock data
VITE_API_BASE_URL=/api                    # Prod
VITE_USE_MOCK_API=false                   # Prod with real API
```

### API (`apps/api/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/nail-salon
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## Docker Configuration

### Compose Files
- `docker-compose.yml`: Base service definitions
- `docker-compose.dev.yml`: Development overrides (hot-reload, volume mounts)
- `docker-compose.prod.yml`: Production overrides (nginx, resource limits)

### Multi-Stage Builds
- **Client/Admin**: base → deps → dev → builder → production (nginx)
- **API**: base → deps → dev → builder → prod-deps → production

### Key Features
- BuildKit cache mounts for faster builds
- Non-root users (uid 1001)
- Health checks + startup dependencies
- Log rotation
- Resource limits (production)

## Project Documentation

### Core Docs
- `./docs/project-overview-pdr.md` - Product requirements & architecture
- `./docs/code-standards.md` - Coding conventions & best practices
- `./docs/system-architecture.md` - Infrastructure & components
- `./docs/shared-types.md` - **CRITICAL** - Cross-app type definitions
- `./docs/api-endpoints.md` - REST API reference

### Additional Docs
- `./docs/design-guidelines.md` - UI/UX design systems
- `./docs/deployment-guide.md` - Production deployment
- `./docs/project-roadmap.md` - Feature planning
- `./docs/codebase-summary.md` - Codebase overview
- `./MIGRATION-SUMMARY.md` - Turborepo migration details

### Scout Reports
- `./plans/scout-reports/` - Comprehensive project documentation
  - `executive-summary.md` - High-level overview
  - `apps/` - Detailed app breakdowns
  - `packages/` - Shared package docs
  - `infrastructure/` - Docker, Turbo, Nginx

## Development Workflow

### Working with Shared Packages

```typescript
// Import shared types
import { Service, ServiceCategory } from "@repo/types/service";
import { Booking, BookingStatus } from "@repo/types/booking";

// Import utilities
import { cn } from "@repo/utils/cn";
import { formatCurrency, formatDate } from "@repo/utils/format";
import { useDebounce } from "@repo/utils/hooks";
```

### Making Changes

1. **Single app change**: Work in `apps/<app>/` directory
2. **Type change**: Update `packages/types/` and verify all apps
3. **Shared util**: Add to `packages/utils/`
4. **Config change**: Update appropriate `packages/*-config/`

### Testing Changes

```bash
# Type-check all apps
npm run type-check

# Build all apps (tests integration)
npm run build

# Lint all apps
npm run lint
```

### Docker Testing

```bash
# Test dev mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Test prod build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker compose logs -f [service-name]

# Shell into container
docker exec -it [container-name] sh
```

## Performance

### Build Metrics
- **Full build**: 7s (all apps)
- **Cached build**: 89ms (FULL TURBO)
- **Type-check**: 3.9s (all apps)
- **Cache hit rate**: 100% on repeat builds

### Migration Results
- **Type duplication**: 100% → 0%
- **Build speed**: 79x faster with caching
- **Code sharing**: 7 shared packages

## Troubleshooting

### Port Conflicts
```bash
# Find process using port
lsof -i :5173  # Client
lsof -i :5174  # Admin
lsof -i :3000  # API

# Kill process
kill -9 <PID>
```

### Type Errors
```bash
# Rebuild all packages
npm run build

# Check type-check output
npm run type-check

# Verify shared types synced
cat packages/types/src/*.ts
```

### Docker Issues
```bash
# Clean build cache
docker builder prune -a

# Rebuild without cache
docker compose build --no-cache

# Check logs
docker compose logs -f [service-name]

# Restart services
docker compose restart [service-name]
```

### Turbo Cache Issues
```bash
# Clear Turbo cache
npm run clean

# Rebuild from scratch
npm run clean && npm run build
```

## API Routes (Production Nginx)

| Route | Target | Description |
|-------|--------|-------------|
| `/` | Client:80 | Customer website |
| `/admin` | Admin:81 | Admin dashboard |
| `/api` | API:3000 | Backend API |
| `/health` | API:3000/health | Health check |

## Contributing

### Code Standards
- Follow YAGNI + KISS + DRY principles
- Use TypeScript strict mode
- Follow project design systems (client vs admin)
- Write clear commit messages

### Before Committing
```bash
# Type-check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Build
npm run build
```

## License

Private - Pink Nail Salon Business

## Version

**Current Version**: 0.1.0
**Last Updated**: 2025-12-31
**Migration Status**: Complete (Turborepo)

## Support

See project documentation in `./docs/` directory or contact development team.
