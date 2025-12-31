# Codebase Summary - Pink Nail Salon Monorepo

**Project**: Pink Nail Salon - Turborepo Monorepo
**Version**: 0.1.0
**Last Updated**: 2025-12-31
**Migration**: Turborepo complete (7/7 phases)

## Overview

Production-ready monorepo with 3 applications and 7 shared packages, built with Turborepo for optimal performance and zero type duplication.

**Key Metrics**:
- **Build Time**: 7s full / 89ms cached (79x faster)
- **Type Duplication**: 0% (eliminated via @repo/types)
- **Apps**: 3 (client, admin, API)
- **Shared Packages**: 7 (@repo/*)
- **Total LOC**: ~25,000+ (estimated)

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
│   ├── prettier-config/ # Code formatting
│   └── ui/              # UI components (intentionally empty)
├── tooling/
│   └── prettier-config/ # Tooling configuration
├── nginx/               # Nginx reverse proxy config
├── docs/                # Project documentation
├── .claude/             # Claude workflows & skills
├── plans/               # Planning & scout reports
├── turbo.json           # Turborepo configuration
├── package.json         # Root workspace config
├── docker-compose.yml   # Base Docker config
├── docker-compose.dev.yml   # Dev overrides
└── docker-compose.prod.yml  # Prod overrides
```

## Applications

### 1. Client App (`apps/client/`)

**Purpose**: Customer-facing website for nail salon services
**Port**: 5173 (dev) / 80 (prod)
**Framework**: React 19.2 + Vite 7.2 + TypeScript 5.9

#### Directory Structure

```
apps/client/
├── src/
│   ├── assets/          # Static images, fonts
│   ├── components/
│   │   ├── banner/      # Banner components
│   │   ├── gallery/     # Gallery grid, filters, modals
│   │   ├── home/        # Hero, About, Services, Gallery sections
│   │   ├── layout/      # Header, Footer, Layout
│   │   ├── services/    # Service cards, filters
│   │   ├── shared/      # Shared UI components
│   │   └── ui/          # shadcn/ui components (15 components)
│   ├── data/            # Static data (business hours, contact)
│   ├── hooks/           # Custom hooks (6 page-specific)
│   ├── lib/
│   │   └── validations/ # Yup form schemas
│   ├── pages/           # 5 page components
│   ├── services/        # API service layer (axios)
│   ├── styles/          # Global CSS (Tailwind v4)
│   └── types/           # TypeScript definitions (re-exports @repo/types)
├── Dockerfile           # Multi-stage build (Nginx)
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── tailwind.config.ts   # Uses @repo/tailwind-config/client-theme
```

#### Tech Stack

**Core**:
- React 19.2, TypeScript 5.9, Vite 7.2 (SWC)

**Styling**:
- Tailwind CSS v4
- @repo/tailwind-config/client-theme (warm/cozy/feminine)
- Radix UI primitives (shadcn/ui pattern)

**Routing**:
- React Router v7 (BrowserRouter)

**Forms**:
- React Hook Form 7.54
- Yup 1.6 validation
- @hookform/resolvers

**State**:
- Zustand (lightweight global state)
- No complex state management needed

**Animations**:
- Motion (Framer Motion) for smooth transitions

**HTTP**:
- Axios with interceptors

#### Pages

1. **HomePage** - Hero, About, Services preview, Gallery preview
2. **ServicesPage** - Full service catalog with filters
3. **GalleryPage** - Categorized nail art showcase
4. **BookingPage** - Multi-step booking form
5. **ContactPage** - Business info + contact form

#### Design System

**Theme**: Warm, cozy, feminine, organic
**Colors**: Beige/cream/warm grays (#fdf8f6 → #43302b)
**Borders**: YES (1-2px solid, rounded)
**Shadows**: NO (border-based design)
**Typography**: Poppins-style sans-serif

### 2. Admin App (`apps/admin/`)

**Purpose**: Business dashboard for salon management
**Port**: 5174 (dev) / 81 (prod)
**Framework**: React 19.2 + Vite 7.2 + TypeScript 5.9

#### Directory Structure

```
apps/admin/
├── src/
│   ├── components/
│   │   ├── auth/        # ProtectedRoute
│   │   ├── banners/     # Banner components (3 files)
│   │   ├── gallery/     # Gallery components (4 files)
│   │   ├── layout/      # Layout components (3 files)
│   │   ├── shared/      # DataTable, ImageUpload, VideoUpload
│   │   └── ui/          # shadcn/ui components (23 components)
│   ├── data/            # Mock data (banners, gallery)
│   ├── lib/             # Utils, Firebase
│   ├── pages/           # 7 page components
│   ├── services/        # Service layer (dual-mode: mock/API)
│   ├── store/           # Zustand stores (4 stores)
│   └── types/           # TypeScript definitions (re-exports @repo/types)
├── Dockerfile           # Multi-stage build (Nginx)
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── tailwind.config.ts   # Uses @repo/tailwind-config/admin-theme
```

#### Tech Stack

**Core**:
- React 19.2, TypeScript 5.9, Vite 7.2 (SWC)

**Styling**:
- Tailwind CSS v4
- @repo/tailwind-config/admin-theme (professional/modern/blue)
- Radix UI primitives (shadcn/ui pattern)

**Routing**:
- React Router v7

**Forms**:
- React Hook Form 7.54
- Zod validation
- @hookform/resolvers

**State**:
- Zustand 5.0 (authStore, bannersStore, galleryStore, heroSettingsStore)
- In-memory state with mock data support

**Tables**:
- TanStack Table v8 (DataTable component)

**Storage**:
- Firebase Storage 11.1 (image/video uploads)

**HTTP**:
- Dual-mode: Mock API (Zustand) or Real API (fetch)

#### Pages

1. **LoginPage** - JWT authentication
2. **DashboardPage** - Analytics overview (future)
3. **BannersPage** - Banner CRUD, drag-drop reorder
4. **GalleryPage** - Gallery CRUD, categories, bulk delete
5. **ServicesPage** - Service management (placeholder)
6. **BookingsPage** - Booking management
7. **ContactsPage** - Business info + messages (placeholder)

#### Zustand Stores

**authStore**:
- User authentication state
- JWT token management
- localStorage persistence

**bannersStore**:
- Banner CRUD operations
- Primary banner selection
- Drag-drop reordering
- Active/inactive toggle

**galleryStore**:
- Gallery CRUD operations
- Category filtering
- Featured items
- Bulk operations

**heroSettingsStore**:
- Hero display mode (image/video/carousel)
- Carousel interval
- Show controls toggle

#### Design System

**Theme**: Professional, clean, modern
**Colors**: Blue theme (#3b82f6, #0ea5e9, #f8fafc)
**Borders**: Subtle, shadows enabled
**Shadows**: YES (glassmorphism)
**Typography**: Inter-style sans-serif

### 3. API App (`apps/api/`)

**Purpose**: Backend services and data management
**Port**: 3000 (dev & prod)
**Framework**: NestJS 11 + TypeScript 5.7

#### Directory Structure

```
apps/api/
├── src/
│   ├── auth/            # Authentication module
│   │   ├── dto/         # Login, Register DTOs
│   │   ├── guards/      # JWT guards
│   │   ├── strategies/  # Passport strategies
│   │   └── auth.controller.ts, auth.service.ts
│   ├── bookings/        # Booking module
│   │   ├── dto/         # CreateBooking, UpdateBooking DTOs
│   │   ├── schemas/     # Mongoose schema
│   │   └── bookings.controller.ts, bookings.service.ts
│   ├── gallery/         # Gallery module (with categories)
│   │   ├── dto/         # CreateGallery, UpdateGallery DTOs
│   │   ├── schemas/     # Mongoose schema
│   │   └── gallery.controller.ts, gallery.service.ts
│   ├── services/        # Services module
│   │   ├── dto/         # CreateService, UpdateService DTOs
│   │   ├── schemas/     # Mongoose schema
│   │   └── services.controller.ts, services.service.ts
│   ├── upload/          # File upload module (Cloudinary)
│   ├── health/          # Health check module
│   ├── common/          # Shared utilities, decorators, filters
│   ├── config/          # Configuration (MongoDB, Redis, JWT, Cloudinary)
│   └── main.ts          # Application entry point
├── test/                # E2E tests (Supertest)
├── Dockerfile           # Multi-stage build (Node.js)
├── package.json         # Dependencies
├── tsconfig.json        # Extends @repo/typescript-config/nestjs
└── nest-cli.json        # NestJS CLI configuration
```

#### Tech Stack

**Framework**:
- NestJS 11.0
- TypeScript 5.7
- Node.js 25 (Alpine)

**Database**:
- MongoDB 9.0
- Mongoose 9.1 (ODM)

**Caching**:
- Redis 7.4
- ioredis 5.4

**Authentication**:
- @nestjs/jwt
- @nestjs/passport
- Passport JWT strategy
- Argon2 (password hashing)

**Validation**:
- class-validator
- class-transformer

**File Upload**:
- Cloudinary SDK
- Multer (multipart/form-data)

**Security**:
- @nestjs/throttler (rate limiting)
- CORS configuration
- Helmet (HTTP headers, future)

**Testing**:
- Jest (unit tests)
- Supertest (E2E tests)

#### Modules

**auth**:
- POST /auth/register (register admin)
- POST /auth/login (JWT tokens)
- POST /auth/refresh (refresh access token)
- POST /auth/logout (invalidate refresh token)

**services**:
- GET /services (list with filters)
- POST /services (create, admin)
- PATCH /services/:id (update, admin)
- DELETE /services/:id (delete, admin)

**gallery**:
- GET /gallery (list with category filter)
- POST /gallery (create, admin)
- PATCH /gallery/:id (update, admin)
- DELETE /gallery/:id (delete, admin)

**bookings**:
- GET /bookings (list, admin)
- POST /bookings (create, public)
- PATCH /bookings/:id (update status, admin)
- DELETE /bookings/:id (delete, admin)

**upload**:
- POST /upload (Cloudinary upload, admin)

**health**:
- GET /health (health check)

## Shared Packages

### @repo/types (`packages/types/`)

**Purpose**: Centralized TypeScript type definitions

**Structure**:
```
packages/types/
├── src/
│   ├── service.ts       # Service, ServiceCategory
│   ├── gallery.ts       # Gallery, GalleryCategory
│   ├── booking.ts       # Booking, BookingStatus, CustomerInfo
│   └── auth.ts          # User, LoginCredentials, AuthResponse
├── package.json         # Exports via "exports" field
└── tsconfig.json        # Extends @repo/typescript-config/base
```

**Exports**:
```typescript
import { Service, ServiceCategory } from "@repo/types/service";
import { Gallery, GalleryCategory } from "@repo/types/gallery";
import { Booking, BookingStatus } from "@repo/types/booking";
import { User, LoginCredentials } from "@repo/types/auth";
```

**Impact**: Eliminated 100% type duplication between client and admin

### @repo/utils (`packages/utils/`)

**Purpose**: Shared utility functions and React hooks

**Structure**:
```
packages/utils/
├── src/
│   ├── cn.ts            # Tailwind class name merger (clsx + tailwind-merge)
│   ├── format.ts        # formatCurrency, formatDate, formatPhoneNumber
│   └── hooks/
│       └── use-debounce.ts  # Debounce hook (shared between apps)
├── package.json
└── tsconfig.json
```

**Exports**:
```typescript
import { cn } from "@repo/utils/cn";
import { formatCurrency, formatDate, formatPhoneNumber } from "@repo/utils/format";
import { useDebounce } from "@repo/utils/hooks";
```

**Dependencies**:
- clsx 2.1
- tailwind-merge 3.4
- react (peer dependency)

### @repo/typescript-config (`packages/typescript-config/`)

**Purpose**: Centralized TypeScript configurations

**Configs**:
```
packages/typescript-config/
├── base.json            # Common settings (strict, ES2022, verbatimModuleSyntax)
├── react.json           # React-specific (JSX preserve, DOM lib, extends base)
└── nestjs.json          # Node.js backend (CommonJS, Node libs, extends base)
```

**Usage**:
```json
// apps/client/tsconfig.json
{
  "extends": "@repo/typescript-config/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### @repo/eslint-config (`packages/eslint-config/`)

**Purpose**: Centralized ESLint rules

**Configs**:
```
packages/eslint-config/
├── react.js             # React + TypeScript + Perfectionist
└── nestjs.js            # NestJS + Node.js linting
```

**Plugins**:
- @eslint/js
- typescript-eslint
- eslint-plugin-perfectionist (import sorting)
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

### @repo/tailwind-config (`packages/tailwind-config/`)

**Purpose**: Tailwind CSS theme configurations

**Configs**:
```
packages/tailwind-config/
├── base.js              # Common Tailwind settings
├── client-theme.js      # Warm theme (beige/cream/warm grays)
└── admin-theme.js       # Blue theme (professional/modern)
```

**Usage**:
```javascript
// apps/client/tailwind.config.ts
import clientTheme from "@repo/tailwind-config/client-theme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  ...clientTheme,
};
```

### @repo/prettier-config (`packages/prettier-config/`)

**Purpose**: Code formatting standards (placeholder, uses root)

### packages/ui

**Status**: **Intentionally empty**
**Rationale**: Client and admin have fundamentally different design systems, making component sharing impractical. Only shared hook: `useDebounce` in @repo/utils.

## Build System (Turborepo)

### turbo.json

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

### Root package.json

```json
{
  "name": "pink-nail-salon",
  "workspaces": ["apps/*", "packages/*", "tooling/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean"
  },
  "packageManager": "npm@11.7.0"
}
```

### Performance

**Full Build**: 7.023s (all apps, parallel)
**Cached Build**: 89ms (FULL TURBO)
**Type-Check**: 3.937s (all apps, parallel)
**Improvement**: 79x faster with caching

## Docker Configuration

### docker-compose.yml (Base)

**Services**:
- client (React + Vite)
- admin (React + Vite)
- api (NestJS)
- mongodb (MongoDB 9.0)
- redis (Redis 7.4)

### docker-compose.dev.yml (Development)

**Features**:
- Hot-reload enabled (CHOKIDAR_USEPOLLING=true)
- Volume mounts for source code
- Direct port access (5173, 5174, 3000)
- MongoDB + Redis containers

### docker-compose.prod.yml (Production)

**Features**:
- Multi-stage builds
- Nginx reverse proxy
- Resource limits (CPU, memory)
- Health checks + dependencies
- Log rotation

**Services**:
- nginx (reverse proxy, static serving)
- client (optimized build)
- admin (optimized build)
- api (PM2 process manager)
- mongodb (persistent volume)
- redis (persistent volume)

### Multi-Stage Dockerfiles

**Client/Admin** (5 stages):
1. **base**: Node.js Alpine
2. **deps**: Install dependencies (BuildKit cache mounts)
3. **dev**: Development stage (hot-reload)
4. **builder**: Build with Turbo `--filter=client|admin`
5. **production**: Nginx serving static files

**API** (6 stages):
1. **base**: Node.js Alpine
2. **deps**: Install all dependencies
3. **dev**: Development stage (watch mode)
4. **builder**: Build with Turbo `--filter=api`
5. **prod-deps**: Install only production dependencies
6. **production**: Run with PM2

### Nginx Configuration

**Routes** (Production):
```
/          → client:80       (customer website)
/admin     → admin:81        (dashboard)
/api       → api:3000        (backend API)
/health    → api:3000/health (health check)
```

**Static Files**:
- Client: `/usr/share/nginx/html/client`
- Admin: `/usr/share/nginx/html/admin`

## Type System Architecture

### Type Sharing Pattern

**Before Migration**:
```
nail-client/src/types/service.types.ts    (duplicated)
nail-admin/src/types/service.types.ts     (duplicated)
```

**After Migration**:
```
packages/types/src/service.ts             (single source of truth)
apps/client/src/types/                    (re-exports from @repo/types)
apps/admin/src/types/                     (re-exports from @repo/types)
```

### Import Convention

**TypeScript verbatimModuleSyntax** (strict):
```typescript
// ✅ Correct (type-only import)
import type { Service } from "@repo/types/service";

// ❌ Wrong (build error with verbatimModuleSyntax)
import { Service } from "@repo/types/service";
```

**Exception**: When importing for runtime use (rare with types package).

## Development Workflow

### Local Development

```bash
# Install dependencies (root)
npm install

# Run all apps in parallel
npm run dev

# Access:
# Client: http://localhost:5173
# Admin:  http://localhost:5174
# API:    http://localhost:3000
```

### Docker Development

```bash
# Start all services with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Logs
docker compose logs -f [service-name]

# Shell into container
docker exec -it [container-name] sh
```

### Turborepo Commands

```bash
# Build all apps (7s full, 89ms cached)
npm run build

# Type-check all apps
npm run type-check

# Lint all apps
npm run lint

# Clean Turbo cache
npm run clean

# Build specific app
npx turbo build --filter=client
npx turbo build --filter=admin
npx turbo build --filter=api

# Run specific app
npx turbo dev --filter=client
```

### Working with Shared Packages

**Adding a new type**:
1. Add to `packages/types/src/[module].ts`
2. Update `packages/types/package.json` exports if new module
3. Run `npm run type-check` to verify all apps
4. Apps auto-import updated types (no changes needed)

**Adding a utility**:
1. Add to `packages/utils/src/[utility].ts`
2. Update `packages/utils/package.json` exports
3. Use in apps: `import { util } from "@repo/utils/[utility]"`

**Updating configs**:
1. Modify `packages/typescript-config/[config].json`
2. Changes apply to all apps automatically
3. Run `npm run type-check` to verify

## Environment Variables

### Client (`apps/client/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000  # Dev
VITE_API_BASE_URL=/api                    # Prod (Nginx proxy)
```

### Admin (`apps/admin/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK_API=true                    # Dev (Zustand mock)
VITE_USE_MOCK_API=false                   # Prod (real API)
VITE_FIREBASE_*=                          # Firebase config
```

### API (`apps/api/.env`)

```env
NODE_ENV=development|production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nail-salon
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## Testing

### Unit Tests

**Client/Admin**: Vitest (future implementation)
**API**: Jest (implemented for core modules)

### E2E Tests

**Client/Admin**: Playwright (future implementation)
**API**: Supertest (implemented for endpoints)

### Manual Testing

Currently primary method for frontend applications.

## Code Quality

### TypeScript Strict Mode

All apps use strict TypeScript:
- `strict: true`
- `verbatimModuleSyntax: true`
- `noImplicitAny: true`
- `strictNullChecks: true`

### ESLint Rules

- TypeScript ESLint recommended
- React hooks rules
- React refresh (Vite)
- Perfectionist (import sorting)

### Prettier

- Standard formatting rules
- Enforced via pre-commit hooks (future)

### Path Aliases

All apps use `@/*` path alias:
```typescript
import { Button } from "@/components/ui/button";
```

## Migration Summary

### Turborepo Migration (2025-12-31)

**Phases**: 7/7 complete
**Duration**: ~2 hours
**Status**: Production-ready

**Achievements**:
- ✅ Turborepo setup (npm workspaces)
- ✅ 7 shared packages created
- ✅ Type duplication eliminated (100% → 0%)
- ✅ Build caching enabled (79x faster)
- ✅ Docker migration complete
- ✅ All tests passing
- ✅ Documentation complete

**Build Performance**:
- Before: ~20s per app (sequential)
- After: 7s full / 89ms cached
- Improvement: 98.7% time reduction

**Type Duplication**:
- Before: 100% duplication
- After: 0% duplication via @repo/types

## Architecture Decisions

### Why packages/ui is Empty

**Decision**: Keep UI components separate per app
**Rationale**:
- Client: Warm/cozy/feminine (border-based, NO shadows)
- Admin: Professional/modern (glassmorphism, WITH shadows)
- Fundamentally different design philosophies
- Only 1 shareable hook (useDebounce → @repo/utils)

### Dual-Mode Service Pattern (Admin)

**Pattern**:
```typescript
const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

if (useMockApi) {
  // Use Zustand stores (in-memory state)
} else {
  // Use real API calls
}
```

**Benefits**:
- Develop without backend
- Easy switch to production
- No code changes needed

### Monorepo Benefits

**Code Sharing**: 7 shared packages eliminate duplication
**Atomic Commits**: Single commit affects all apps
**Centralized Tooling**: One ESLint, TypeScript, Tailwind config
**Build Performance**: 79x faster with Turborepo caching
**Type Safety**: Single source of truth for types

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md) - Requirements and architecture
- [Code Standards](./code-standards.md) - Coding conventions
- [System Architecture](./system-architecture.md) - Infrastructure details
- [Shared Types](./shared-types.md) - Type definitions reference
- [API Endpoints](./api-endpoints.md) - API reference
- [Design Guidelines](./design-guidelines.md) - UI/UX standards
- [Project Roadmap](./project-roadmap.md) - Feature planning
- [Deployment Guide](./deployment-guide.md) - Production deployment
- [Migration Summary](../MIGRATION-SUMMARY.md) - Turborepo migration details
- [Scout Reports](../plans/scout-reports/) - Comprehensive project docs

---

**Document Version**: 1.0
**Last Updated**: 2025-12-31
**Turborepo Status**: Complete (7/7 phases)
