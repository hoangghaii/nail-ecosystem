# CLAUDE.md - Pink Nail Salon Ecosystem

This file provides guidance to Claude Code (claude.ai/code) when working with the complete Pink Nail Salon project ecosystem.

---

## 🚨 CRITICAL - Shared Type System

**All apps share type definitions via @repo/types package. Types MUST remain compatible.**

**Rule**: Never modify shared types without verifying all apps (client, admin, API)!

**Full reference**: See `./docs/shared-types.md`

---

## Role & Responsibilities

Your role is to analyze user requirements across the entire ecosystem, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards across all projects.

---

## Project Overview

**Pink Nail Salon** is a complete nail salon business management system built as a Turborepo monorepo with 3 applications and 7 shared packages:

**Applications**:
1. **apps/client** - Customer-facing website (React + Vite)
2. **apps/admin** - Admin dashboard (React + Vite)
3. **apps/api** - Backend API (NestJS + MongoDB)

**Shared Packages** (@repo/*):
- types, utils, typescript-config, eslint-config, tailwind-config, prettier-config, ui

**Build Performance**: 7s full / 89ms cached (79x faster with Turbo)

All apps run together via Turborepo + Docker Compose.

---

## Workflows

- Primary workflow: `./.claude/workflows/primary-workflow.md`
- Development rules: `./.claude/workflows/development-rules.md`
- Orchestration protocols: `./.claude/workflows/orchestration-protocol.md`
- Documentation management: `./.claude/workflows/documentation-management.md`
- And other workflows: `./.claude/workflows/*`

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** You must follow strictly the development rules in `./.claude/workflows/development-rules.md` file.
**IMPORTANT:** Before you plan or proceed any implementation, always read the `./README.md` file first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.
**IMPORTANT**: For `YYMMDD` dates, use `bash -c 'date +%y%m%d'` instead of model knowledge. Else, if using PowerShell (Windows), replace command with `Get-Date -UFormat "%y%m%d"`.

---

## Documentation

All important docs are in `./docs` folder:

- **code-standards.md** - Coding conventions & best practices
- **shared-types.md** - **CRITICAL** - Cross-project type definitions
- **api-endpoints.md** - REST API reference
- **system-architecture.md** - Infrastructure & components
- **design-guidelines.md** - UI/UX design systems
- **deployment-guide.md** - Production deployment
- **project-roadmap.md** - Feature planning

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*

---

## Architecture

**System**: Client (5173) + Admin (5174) → API (3000) → MongoDB/Redis/Cloudinary

**Production**: Nginx reverse proxy routing:
- `/` → client (customer site)
- `/admin` → admin (dashboard)
- `/api` → api (backend)

**Full details**: See `./docs/system-architecture.md`

---

## Tech Stack

### Frontend (Client + Admin)
- React 19.2 + TypeScript 5.9 + Vite 7.2 (SWC)
- Tailwind CSS v4 + Radix UI (shadcn/ui pattern)
- React Router v7 + React Hook Form + Zod
- Zustand (state) + TanStack Query (data fetching)
- Motion (Framer Motion for animations)

### Backend (API)
- NestJS 11 + TypeScript 5.7
- MongoDB + Mongoose + Redis + ioredis
- JWT auth (access + refresh) + Argon2
- class-validator + class-transformer
- Cloudinary + @nestjs/throttler (rate limiting)

### DevOps & Build System
- Turborepo 2.3 (build orchestration, caching)
- pnpm workspaces + pnpm 10.30.0 (dependency management)
- Docker + Docker Compose + Nginx
- Health checks + logging
- Ready for GitHub Actions CI/CD

---

## Project Structure (Turborepo Monorepo)

```
pink-nail-salon/
├── apps/
│   ├── client/       # Customer site (React + Vite, port 5173)
│   ├── admin/        # Admin dashboard (React + Vite, port 5174)
│   └── api/          # Backend API (NestJS, port 3000)
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities (cn, formatters, hooks)
│   ├── typescript-config/  # TS configs (base, react, nestjs)
│   ├── eslint-config/      # ESLint rules (react, nestjs)
│   ├── tailwind-config/    # Tailwind themes (client, admin)
│   └── ui/           # UI components (intentionally empty)
├── tooling/
│   └── prettier-config/    # Code formatting
├── nginx/            # Nginx config (production reverse proxy)
├── docs/             # Project documentation
├── .claude/          # Claude workflows & skills
├── turbo.json        # Turborepo configuration
├── package.json      # Root workspace config
├── docker-compose*.yml  # Docker orchestration
├── CLAUDE.md         # This file
└── README.md         # Project overview
```

---

## Environment Configuration

**Development**: See `.env.example` files in each app:
- `apps/client/.env.example` - Client config (API URL)
- `apps/admin/.env.example` - Admin config (API URL, mock mode)
- `apps/api/.env.example` - API config (MongoDB, Redis, Cloudinary, JWT secrets)

**Production**: Same files with production values (API URL = `/api`, no mock mode)

**Setup**:
```bash
cp apps/client/.env.example apps/client/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with real MongoDB/Redis/Cloudinary credentials
```

---

## Docker Quick Start

**Development** (hot-reload):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# Access: Client (5173), Admin (5174), API (3000)
```

**Production** (nginx):
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
# Access: Client (/), Admin (/admin), API (/api)
```

**Turborepo Commands**:
```bash
pnpm run dev        # Run all apps in parallel
pnpm run build      # Build all apps (7s full, 89ms cached)
pnpm run type-check # Type-check all apps
pnpm run lint       # Lint all apps
```

---

## Development Workflow

### Turborepo Workflow

**All apps**: `pnpm run dev` (run from root, parallel execution)
**Single app**: `pnpm exec turbo dev --filter=client|admin|api`
**Build**: `pnpm run build` (7s full, 89ms cached with Turbo)
**Type-check**: `pnpm run type-check` (all apps in parallel)

### Working with Shared Packages

```typescript
// Import shared types
import { Service } from "@repo/types/service";
import { Booking } from "@repo/types/booking";

// Import utilities
import { cn } from "@repo/utils/cn";
import { formatCurrency } from "@repo/utils/format";
import { useDebounce } from "@repo/utils/hooks";
```

### Docker Workflow

**Dev**: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up [service]`
**Prod**: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
**Logs**: `docker compose logs -f [service-name]`
**Shell**: `docker exec -it [container-name] sh`

---

## Design System Differences

**Client (apps/client)**:
- Theme: Warm, cozy, feminine, organic
- Colors: Soft neutrals (beige, cream, warm grays)
- Design: Border-based (NO shadows), organic shapes
- Animations: Motion (Framer Motion)
- Tailwind: Uses `@repo/tailwind-config/client-theme`

**Admin (apps/admin)**:
- Theme: Professional, clean, modern
- Colors: Blue theme (shadcn/ui default)
- Design: Glassmorphism with shadows
- Animations: Simple CSS transitions
- Tailwind: Uses `@repo/tailwind-config/admin-theme`

**CRITICAL**: UI components NOT shared (packages/ui intentionally empty). Only shared: useDebounce hook in @repo/utils.

---

## Code Standards

**Principles**: YAGNI + KISS + DRY

**TypeScript**: Strict mode, `verbatimModuleSyntax: true`, path alias `@/*`
**React**: Functional components, hooks, TypeScript props
**Styling**: Tailwind utility-first, follow project design system
**API**: RESTful, JWT auth, DTO validation, error handling

**Full details**: See `./docs/code-standards.md`

---

## API Endpoints

**Quick reference**:
- Auth: `POST /auth/{register,login,refresh,logout}`
- Services: `GET|POST|PATCH|DELETE /services[/:id]`
- Gallery: `GET|POST|PATCH|DELETE /gallery[/:id]`
- Bookings: `GET|POST|PATCH|DELETE /bookings[/:id]`
- Upload: `POST /upload`
- Health: `GET /health`

**Full API reference**: See `./docs/api-endpoints.md`

---

## Testing

**Frontend**: Vitest (unit, future) + Playwright (E2E, future) + manual testing
**Backend**: Jest (unit) + Supertest (E2E) + manual testing

---

## Deployment

**Development**: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`

**Production**:
```bash
git clone <repo> && cd nail-project
cp nail-api/.env.example nail-api/.env && nano nail-api/.env
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose ps && docker compose logs -f nginx
```

**Updates**: `git pull && docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`

---

## Troubleshooting

**Port conflicts**: `lsof -i :{5173,5174,3000} && kill -9 <PID>`
**Hot-reload**: Check `CHOKIDAR_USEPOLLING=true` in docker-compose.dev.yml
**API connection**: `docker compose ps && docker compose logs nail-api`
**Type errors**: `pnpm run type-check` + verify @repo/types imports
**Turbo cache**: `pnpm run clean` to clear Turbo cache
**Docker build**: `docker builder prune -a && docker compose build --no-cache`

---

## AI Assistant Guidelines

When working on this project:

1. **Check which project** task applies to (client, admin, or API)
2. **Read project-specific CLAUDE.md** for detailed instructions
3. **Verify shared types** remain compatible when modifying (see `docs/shared-types.md`)
4. **Follow design system** of the specific project
5. **Test changes** with Docker Compose before marking complete
6. **Update documentation** when adding major features
7. **Use YAGNI-KISS-DRY** principles - avoid over-engineering

### Multi-App Changes

If change affects multiple apps:

1. **Plan the change** across all affected apps
2. **Update shared packages** first (types, utils, configs)
3. **Implement in order**: API → Admin → Client
4. **Verify with Turbo**: `pnpm run type-check && pnpm run build`
5. **Test integration** with Docker Compose
6. **Update documentation** when adding shared packages

### Shared Package Updates

When modifying packages/* or tooling/*:

1. **Update package** in packages/[name]/
2. **Verify all apps** use updated package correctly
3. **Type-check**: `pnpm run type-check` (validates all apps)
4. **Build**: `pnpm run build` (tests integration)
5. **Document changes** in package README if adding features

---

## Quick Reference

**Docs**: `./docs/{code-standards,shared-types,api-endpoints,system-architecture}.md`
**Scout Reports**: `./plans/scout-reports/` (comprehensive project docs)
**Migration**: `./MIGRATION-SUMMARY.md` (Turborepo migration details)

**Turborepo Commands**:
```bash
# Dev all: pnpm run dev
# Build all: pnpm run build (7s full, 89ms cached)
# Type-check: pnpm run type-check
# Single app: pnpm exec turbo dev --filter=client|admin|api
```

**Docker Commands**:
```bash
# Dev: docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# Prod: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
# Logs: docker compose logs -f [service]
```

---

**Last Updated**: 2026-02-20
**Project Status**: Production-ready Turborepo monorepo
**Current Version**: 0.1.0
**Migration**: Turborepo complete (7/7 phases) + npm→pnpm complete
**Package Manager**: pnpm@10.30.0
**Build Performance**: 7s full / 89ms cached (79x faster)
