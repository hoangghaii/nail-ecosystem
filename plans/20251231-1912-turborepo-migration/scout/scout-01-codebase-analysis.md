# Scout Report: Codebase Analysis

**Date**: 2025-12-31
**Scout**: Codebase Structure Analyzer
**Objective**: Analyze current Pink Nail Salon project structure and identify duplication

---

## Current Structure

```
nail-project/
├── nail-client/          # React + Vite (Port 5173)
├── nail-admin/           # React + Vite (Port 5174)
├── nail-api/             # NestJS (Port 3000)
├── nginx/                # Reverse proxy config
├── docker-compose.yml    # Base config
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

---

## Package Analysis

### nail-client (v0.0.0)

**Tech Stack**:
- React 19.2, TypeScript 5.9, Vite 7.2
- Tailwind CSS v4, Radix UI components
- React Router v7, TanStack Query, Zustand
- Motion (Framer Motion)

**Scripts**:
- `dev`: vite --port 5173
- `build`: tsc -b && vite build

**Components**: 16 UI components in `/src/components/ui`

### nail-admin (v0.0.0)

**Tech Stack**:
- React 19.2, TypeScript 5.9, Vite 7.2
- Tailwind CSS v4, Radix UI components
- React Router v7, TanStack Query, Zustand
- Firebase 12.6 (unique)

**Scripts**:
- `dev`: vite --port 5174
- `build`: tsc -b && vite build

**Components**: 11 UI components in `/src/components/ui`

**Differences from Client**:
- Additional: `@radix-ui/react-checkbox`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-radio-group`, `@radix-ui/react-switch`, `@tanstack/react-table`
- Has Firebase dependency
- Missing: Motion (animations)

### nail-api (v0.0.1)

**Tech Stack**:
- NestJS 11, TypeScript 5.7
- MongoDB + Mongoose, Redis + ioredis
- JWT authentication, Argon2 password hashing
- Cloudinary storage

**Scripts**:
- `start:dev`: nest start --watch
- `build`: nest build
- `start:prod`: node dist/main

---

## Shared Code Analysis

### Exact Duplicates (100% identical)

**Service Types** (`service.types.ts`):
- Both client & admin have IDENTICAL definitions
- Service type, ServiceCategory enum
- 27 lines duplicated

**Gallery Types** (`gallery.types.ts`):
- Both client & admin have IDENTICAL definitions
- GalleryItem type, GalleryCategory enum
- 29 lines duplicated

### Partial Duplicates

**UI Components**:
- Client: 16 components in `/components/ui`
- Admin: 11 components in `/components/ui`
- Estimated 60-70% overlap (Button, Input, Label, Dialog, Select, etc.)

**Utilities**:
- Both have `lib/utils.ts` with similar utility functions
- Both use `clsx` + `tailwind-merge` pattern

**Form Handling**:
- Both use React Hook Form + validation (Client: Yup, Admin: Zod)
- Similar form patterns

**Dependencies** (shared between client & admin):
```json
{
  "@hookform/resolvers": "^5.2.2",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-tabs": "^1.1.13",
  "@tanstack/react-query": "^5.90.11",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-hook-form": "^7.67.0",
  "react-router-dom": "^7.9.6",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.4.0",
  "tailwindcss": "^4.1.17",
  "zustand": "^5.0.8"
}
```

**DevDependencies** (shared):
```json
{
  "@eslint/js": "^9.39.1",
  "@types/node": "^24.10.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react-swc": "^4.2.2",
  "eslint": "^9.39.1",
  "eslint-plugin-perfectionist": "^4.15.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "husky": "^9.1.7",
  "lint-staged": "^16.2.7",
  "prettier": "3.7.1",
  "prettier-plugin-tailwindcss": "^0.7.1",
  "typescript": "~5.9.3",
  "typescript-eslint": "^8.46.4",
  "vite": "^7.2.4"
}
```

---

## Docker Configuration

**Current Setup**:
- Base: `docker-compose.yml` (service definitions)
- Dev: Hot-reload, volume mounts, CHOKIDAR_USEPOLLING
- Prod: Nginx reverse proxy, production builds

**Port Allocation**:
- Client: 5173 (dev) / 80 (prod via nginx)
- Admin: 5174 (dev) / 80/admin (prod via nginx)
- API: 3000 (both)
- Nginx: 80 (prod only)

---

## Critical Constraints

1. **Shared Types MUST Stay Compatible**: Admin & client share type definitions
2. **Different Design Systems**:
   - Client: Warm/feminine, border-based, Motion animations
   - Admin: Professional/modern, glassmorphism, CSS transitions
3. **Husky/Lint-staged**: Both projects have git hooks configured
4. **Path Aliases**: Both use `@/*` → `./src/*`

---

## Opportunities for Consolidation

### High Priority (Eliminate Duplication)
1. **Shared Types** → `@repo/types` package
2. **Common UI Components** → `@repo/ui` package
3. **Utilities** → `@repo/utils` package
4. **TypeScript Config** → `@repo/typescript-config` package
5. **ESLint Config** → `@repo/eslint-config` package

### Medium Priority (Centralize Tooling)
6. **Prettier Config** → `@repo/prettier-config` package
7. **Tailwind Config** → `@repo/tailwind-config` package (base)
8. **Vite Config** → `@repo/vite-config` package (base)

### Low Priority (Consider Later)
9. **Shared Hooks** (if patterns emerge)
10. **API Client** (if logic can be shared)

---

## Version Conflicts

**TypeScript**:
- Client/Admin: 5.9.3
- API: 5.7.3
- **Action**: Align to 5.9.3

**Prettier**:
- Client: 3.7.1
- Admin: 3.7.3
- **Action**: Align to latest (3.7.3)

**Lucide React**:
- Client: Dependency (0.555.0)
- Admin: DevDependency (0.555.0)
- **Action**: Consolidate as shared dependency

---

## Findings Summary

| Item | Status | Impact |
|------|--------|--------|
| Duplicated types | 100% identical | HIGH - Must consolidate |
| Duplicated UI components | ~60-70% overlap | HIGH - Significant savings |
| Duplicated dependencies | 20+ packages | MEDIUM - Deduplication benefit |
| Duplicated configs | ESLint, Prettier, TS | MEDIUM - Consistency gain |
| Docker setup | Working, needs adaptation | LOW - Minor refactor |
| Version conflicts | Minor misalignments | LOW - Easy to resolve |

---

## Recommendations

1. **Create shared packages FIRST** before moving apps
2. **Keep design system separation** (client vs admin styles)
3. **Use workspace protocol** for internal dependencies
4. **Maintain Docker compatibility** throughout migration
5. **Test incrementally** - one package at a time
