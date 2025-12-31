# CLAUDE.md - Pink Nail Salon Ecosystem

This file provides guidance to Claude Code (claude.ai/code) when working with the complete Pink Nail Salon project ecosystem.

---

## 🚨 CRITICAL - Shared Type System

**The admin panel and client share type definitions. Types MUST remain compatible across projects.**

**Rule**: Never modify shared types without updating both nail-client and nail-admin projects!

**Full reference**: See `./docs/shared-types.md`

---

## Role & Responsibilities

Your role is to analyze user requirements across the entire ecosystem, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards across all projects.

---

## Project Overview

**Pink Nail Salon** is a complete nail salon business management system consisting of 3 interconnected applications:

1. **nail-client** - Customer-facing website (React + Vite)
2. **nail-admin** - Admin dashboard (React + Vite)
3. **nail-api** - Backend API (NestJS + MongoDB)

All projects run together via Docker Compose with development and production configurations.

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
- `/` → nail-client (customer site)
- `/admin` → nail-admin (dashboard)
- `/api` → nail-api (backend)

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

### DevOps
- Docker + Docker Compose + Nginx
- Health checks + logging
- Ready for GitHub Actions CI/CD

---

## Project Structure

```
nail-project/
├── nail-client/      # Customer site (React + Vite, port 5173)
├── nail-admin/       # Admin dashboard (React + Vite, port 5174)
├── nail-api/         # Backend API (NestJS, port 3000)
├── nginx/            # Nginx config (production reverse proxy)
├── docs/             # Project documentation
├── .claude/          # Claude workflows & skills
├── docker-compose.yml       # Base config
├── docker-compose.dev.yml   # Dev override (hot-reload)
├── docker-compose.prod.yml  # Prod override (nginx)
├── CLAUDE.md         # This file
├── README.md         # Project overview
└── README-DOCKER.md  # Docker setup guide
```

---

## Environment Configuration

**Development**: See `.env.example` files in each project:
- `nail-client/.env.example` - Client config (API URL)
- `nail-admin/.env.example` - Admin config (API URL, mock mode)
- `nail-api/.env.example` - API config (MongoDB, Redis, Cloudinary, JWT secrets)

**Production**: Same files with production values (API URL = `/api`, no mock mode)

**Setup**:
```bash
cp nail-client/.env.example nail-client/.env
cp nail-admin/.env.example nail-admin/.env
cp nail-api/.env.example nail-api/.env
# Edit nail-api/.env with real MongoDB/Redis/Cloudinary credentials
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

**Full Docker documentation**: See `README-DOCKER.md`

---

## Development Workflow

### Project-Specific Work

**Client**: `cd nail-client && npm run dev` (port 5173) | See `nail-client/CLAUDE.md`
**Admin**: `cd nail-admin && npm run dev` (port 5174) | See `nail-admin/CLAUDE.md`
**API**: `cd nail-api && npm run start:dev` (port 3000) | See `nail-api/CLAUDE.md`

### Docker Workflow

**Dev**: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up [service]`
**Prod**: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
**Logs**: `docker compose logs -f [service-name]`
**Shell**: `docker exec -it [container-name] sh`

---

## Design System Differences

**Client (nail-client)**:
- Theme: Warm, cozy, feminine, organic
- Colors: Soft neutrals (beige, cream, warm grays)
- Design: Border-based (NO shadows), organic shapes
- Animations: Motion (Framer Motion)

**Admin (nail-admin)**:
- Theme: Professional, clean, modern
- Colors: Blue theme (shadcn/ui default)
- Design: Glassmorphism with shadows
- Animations: Simple CSS transitions

**CRITICAL**: Do NOT mix design systems between projects!

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
**Type errors**: `npm run build` + check `import type` + verify shared types synced
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

### Multi-Project Changes

If change affects multiple projects:

1. **Plan the change** across all affected projects
2. **Update shared types** first (if needed) - see `docs/shared-types.md`
3. **Implement in order**: API → Admin → Client
4. **Test integration** with Docker Compose
5. **Update all affected CLAUDE.md files**

---

## Quick Reference

**Docs**: `./docs/{code-standards,shared-types,api-endpoints,system-architecture}.md`
**Docker**: `README-DOCKER.md`
**Project READMEs**: `{nail-client,nail-admin,nail-api}/{CLAUDE,README}.md`

**Commands**:
```bash
# Dev all: docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# Prod all: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
# Logs: docker compose logs -f [service]
# Shell: docker exec -it [container] sh
```

---

**Last Updated**: 2025-12-31
**Project Status**: Production-ready with Docker Compose setup
**Current Version**: 0.1.0
**Context Optimized**: 2025-12-31 (context engineering applied)
