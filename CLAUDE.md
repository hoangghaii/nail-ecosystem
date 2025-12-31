# CLAUDE.md - Pink Nail Salon Ecosystem

This file provides guidance to Claude Code (claude.ai/code) when working with the complete Pink Nail Salon project ecosystem.

## Role & Responsibilities

Your role is to analyze user requirements across the entire ecosystem, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards across all projects.

## Project Overview

**Pink Nail Salon** is a complete nail salon business management system consisting of 3 interconnected applications:

1. **nail-client** - Customer-facing website (React + Vite)
2. **nail-admin** - Admin dashboard (React + Vite)
3. **nail-api** - Backend API (NestJS + MongoDB)

All projects run together via Docker Compose with development and production configurations.

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

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them, structure like below:

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*

---

## Project Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PINK NAIL SALON ECOSYSTEM                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │  nail-client     │      │  nail-admin      │           │
│  │  (Customer Site) │      │  (Admin Panel)   │           │
│  │  Port: 5173      │      │  Port: 5174      │           │
│  │  React + Vite    │      │  React + Vite    │           │
│  └────────┬─────────┘      └────────┬─────────┘           │
│           │                         │                      │
│           └─────────┬───────────────┘                      │
│                     │                                      │
│                     ▼                                      │
│           ┌──────────────────┐                            │
│           │    nail-api      │                            │
│           │  (Backend API)   │                            │
│           │  Port: 3000      │                            │
│           │  NestJS + MongoDB│                            │
│           └────────┬─────────┘                            │
│                    │                                      │
│                    ▼                                      │
│  ┌─────────────────────────────────────────┐             │
│  │   External Cloud Services               │             │
│  │   - MongoDB Atlas (Database)            │             │
│  │   - Redis Cloud (Caching)               │             │
│  │   - Cloudinary (Image Storage)          │             │
│  └─────────────────────────────────────────┘             │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Production Architecture (Nginx Reverse Proxy)

```
┌──────────────────────────────────────────┐
│  Nginx Reverse Proxy (Port 80/443)      │
│  ├─ / → nail-client                     │
│  ├─ /admin → nail-admin                 │
│  └─ /api → nail-api                     │
└──────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend (Client + Admin)
- **Framework**: React 19.2
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2 with SWC
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives (shadcn/ui pattern)
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand
- **HTTP Client**: TanStack Query (React Query)
- **Animations**: Motion (Framer Motion)

### Backend (API)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: MongoDB + Mongoose
- **Cache**: Redis + ioredis
- **Auth**: JWT (Access + Refresh tokens)
- **Password**: Argon2
- **Validation**: class-validator + class-transformer
- **Storage**: Cloudinary
- **Rate Limiting**: @nestjs/throttler with Redis

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production reverse proxy)
- **CI/CD**: Ready for GitHub Actions
- **Monitoring**: Health checks + logging

---

## Project Structure

```
nail-project/
├── nail-client/              # Customer-facing website
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── CLAUDE.md             # Client-specific instructions
│   └── README.md
│
├── nail-admin/               # Admin dashboard
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── CLAUDE.md             # Admin-specific instructions
│   └── README.md
│
├── nail-api/                 # Backend API
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── CLAUDE.md             # API-specific instructions
│   └── README.md
│
├── nginx/                    # Nginx configuration
│   ├── nginx.conf            # Main nginx config
│   └── conf.d/
│       └── default.conf      # Reverse proxy routing
│
├── docs/                     # Project documentation
│
├── docker-compose.yml        # Base Docker config
├── docker-compose.dev.yml    # Development override
├── docker-compose.prod.yml   # Production override
│
├── CLAUDE.md                 # This file (ecosystem guide)
├── README.md                 # Project overview
└── README-DOCKER.md          # Docker setup guide
```

---

## Environment Configuration

### Development Mode

**nail-client/.env**
```env
VITE_API_BASE_URL=http://localhost:3000
```

**nail-admin/.env**
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
```

**nail-api/.env**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://...
REDIS_HOST=...
REDIS_PORT=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_CLIENT_URL=http://localhost:5173
FRONTEND_ADMIN_URL=http://localhost:5174
```

### Production Mode

**nail-client/.env.production**
```env
VITE_API_BASE_URL=/api
```

**nail-admin/.env.production**
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api
```

**nail-api/.env.production**
```env
NODE_ENV=production
PORT=3000
# Same credentials as development
FRONTEND_CLIENT_URL=https://yourdomain.com
FRONTEND_ADMIN_URL=https://yourdomain.com/admin
```

---

## Docker Setup

### Quick Start - Development

```bash
# Copy environment files
cp nail-client/.env.example nail-client/.env
cp nail-admin/.env.example nail-admin/.env
cp nail-api/.env.example nail-api/.env

# Edit nail-api/.env with real credentials

# Start all services with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Access:**
- Client: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:3000

### Quick Start - Production

```bash
# Build and start with nginx reverse proxy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**Access:**
- Client: http://localhost/
- Admin: http://localhost/admin
- API: http://localhost/api

### Common Commands

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# View logs
docker compose logs -f
docker compose logs -f nail-api

# Rebuild
docker compose build --no-cache

# Shell access
docker exec -it nail-client sh
docker exec -it nail-admin sh
docker exec -it nail-api sh
```

**Full Docker documentation**: See `README-DOCKER.md`

---

## Shared Type System

### Critical Constraint

**The admin panel and client share type definitions.** Types MUST remain compatible across projects.

### Shared Types (Synced between client and admin)

```typescript
// Service types
Service {
  id: string
  name: string
  description: string
  category: ServiceCategory
  price: number
  duration: number
  imageUrl?: string
  featured: boolean
}

ServiceCategory = "extensions" | "manicure" | "nail-art" | "pedicure" | "spa"

// Gallery types
GalleryItem {
  id: string
  title: string
  imageUrl: string
  category: GalleryCategory
  description?: string
  duration?: number
  price?: number
  featured: boolean
  createdAt: Date
}

GalleryCategory = "all" | "extensions" | "manicure" | "nail-art" | "pedicure" | "seasonal"

// Booking types
Booking {
  id: string
  serviceId: string
  date: string
  timeSlot: string
  customerInfo: CustomerInfo
  notes?: string
  status: BookingStatus
}

BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}
```

**Rule**: Never modify shared types without updating both nail-client and nail-admin projects!

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate tokens)

### Services
- `GET /services` - List all services
- `GET /services/:id` - Get service by ID
- `POST /services` - Create service (admin)
- `PATCH /services/:id` - Update service (admin)
- `DELETE /services/:id` - Delete service (admin)

### Gallery
- `GET /gallery` - List gallery items (with filters)
- `GET /gallery/:id` - Get gallery item by ID
- `POST /gallery` - Create gallery item (admin)
- `PATCH /gallery/:id` - Update gallery item (admin)
- `DELETE /gallery/:id` - Delete gallery item (admin)

### Bookings
- `GET /bookings` - List bookings (admin)
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create booking (customer)
- `PATCH /bookings/:id` - Update booking (admin)
- `DELETE /bookings/:id` - Cancel booking

### Image Upload
- `POST /upload` - Upload image to Cloudinary

### Health
- `GET /health` - Health check endpoint

---

## Development Workflow

### Working on Client (nail-client)

```bash
cd nail-client
npm run dev  # Port 5173

# Or with Docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-client
```

**See**: `nail-client/CLAUDE.md` for client-specific instructions

### Working on Admin (nail-admin)

```bash
cd nail-admin
npm run dev  # Port 5174

# Or with Docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-admin
```

**See**: `nail-admin/CLAUDE.md` for admin-specific instructions

### Working on API (nail-api)

```bash
cd nail-api
npm run start:dev  # Port 3000

# Or with Docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-api
```

**See**: `nail-api/CLAUDE.md` for API-specific instructions

### Working on All Projects

```bash
# Development with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Design System Differences

### Client (nail-client)
- **Theme**: Warm, cozy, feminine, organic
- **Colors**: Soft neutrals (beige, cream, warm grays)
- **Design**: Border-based (NO shadows), organic shapes
- **Animations**: Motion (Framer Motion) for smooth transitions

### Admin (nail-admin)
- **Theme**: Professional, clean, modern
- **Colors**: Blue theme (shadcn/ui default)
- **Design**: Glassmorphism with shadows
- **Animations**: Simple CSS transitions

**CRITICAL**: Do NOT mix design systems between projects!

---

## Code Standards

### Principles
- **YAGNI** (You Aren't Gonna Need It)
- **KISS** (Keep It Simple, Stupid)
- **DRY** (Don't Repeat Yourself)

### TypeScript
- Strict mode enabled
- `verbatimModuleSyntax: true` (use `import type` for types)
- Path alias: `@/*` → `./src/*`

### React
- Functional components only
- Hooks for state management
- TypeScript for props

### Styling
- Tailwind CSS utility-first
- Component-specific styles in separate files
- Follow project design system

### API
- RESTful conventions
- JWT authentication
- Input validation with DTOs
- Error handling with filters

---

## Testing Strategy

### Frontend (Client + Admin)
- **Unit**: Vitest (future)
- **E2E**: Playwright (future)
- **Manual**: Development server testing

### Backend (API)
- **Unit**: Jest
- **E2E**: Supertest
- **Manual**: Postman/Thunder Client

---

## Deployment

### Development Deployment

```bash
# Start all services locally
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production Deployment

```bash
# On production server
git clone <repo-url>
cd nail-project

# Setup environment
cp nail-api/.env.example nail-api/.env
nano nail-api/.env  # Add production credentials

# Build and start
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check status
docker compose ps
docker compose logs -f nginx
```

### Update Deployment

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using the port
lsof -i :5173
lsof -i :5174
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Hot-reload not working:**
- Check `CHOKIDAR_USEPOLLING=true` in docker-compose.dev.yml
- Ensure volume mounts are correct

**API connection refused:**
- Verify API is running: `docker compose ps`
- Check API logs: `docker compose logs nail-api`
- Verify environment variables

**Type errors:**
- Run `npm run build` to check TypeScript
- Use `import type` for type imports
- Check shared types are synced

**Docker build fails:**
```bash
# Clear cache and rebuild
docker builder prune -a
docker compose build --no-cache
```

---

## AI Assistant Guidelines

When working on this project:

1. **Check which project** the task applies to (client, admin, or API)
2. **Read project-specific CLAUDE.md** for detailed instructions
3. **Verify shared types** remain compatible when modifying
4. **Follow design system** of the specific project
5. **Test changes** with Docker Compose before marking complete
6. **Update documentation** when adding major features
7. **Use YAGNI-KISS-DRY** principles - avoid over-engineering

### Multi-Project Changes

If a change affects multiple projects:

1. **Plan the change** across all affected projects
2. **Update shared types** first (if needed)
3. **Implement in order**: API → Admin → Client
4. **Test integration** with Docker Compose
5. **Update all affected CLAUDE.md files**

---

## Quick Reference

### Project-Specific Docs
- Client: `nail-client/CLAUDE.md` + `nail-client/README.md`
- Admin: `nail-admin/CLAUDE.md` + `nail-admin/README.md`
- API: `nail-api/CLAUDE.md` + `nail-api/README.md`

### Setup Guides
- Docker: `README-DOCKER.md`
- Main: `README.md`

### Key Files
- Base config: `docker-compose.yml`
- Dev config: `docker-compose.dev.yml`
- Prod config: `docker-compose.prod.yml`
- Nginx: `nginx/nginx.conf` + `nginx/conf.d/default.conf`

### Common Commands
```bash
# Dev (all)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Prod (all)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Logs
docker compose logs -f [service-name]

# Shell
docker exec -it [container-name] sh
```

---

**Last Updated**: 2025-12-30
**Project Status**: Production-ready with Docker Compose setup
**Current Version**: 0.1.0
