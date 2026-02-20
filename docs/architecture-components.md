# Architecture — Components & Monorepo Structure

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
├── tooling/
│   └── prettier-config/
├── turbo.json
├── package.json
└── docker-compose*.yml
```

**Benefits**:
- **Type Safety**: Single source of truth via @repo/types
- **Build Speed**: 79x faster with Turbo caching
- **Code Reuse**: 7 shared packages eliminate duplication
- **Atomic Commits**: Single commit affects all apps

---

## Frontend Layer

**apps/client** (Customer-facing)
- Port: 5173 (dev) / served from `/` (prod)
- React 19.2 + Vite 7.2 + TypeScript 5.9
- Tailwind CSS v4 (warm theme via @repo/tailwind-config/client-theme)
- Radix UI, React Router v7, Zustand
- Shared: @repo/types, @repo/utils

**apps/admin** (Admin dashboard)
- Port: 5174 (dev) / served from `/admin` (prod)
- React 19.2 + Vite 7.2 + TypeScript 5.9
- Tailwind CSS v4 (blue theme via @repo/tailwind-config/admin-theme)
- Shadcn/ui, TanStack Table, Zustand
- Shared: @repo/types, @repo/utils

---

## Backend Layer

**apps/api** (REST API)
- Port: 3000
- NestJS 11 + TypeScript 5.7 + Node.js 25
- MongoDB (Mongoose) for data
- Redis (ioredis) for caching
- JWT authentication (access + refresh tokens)
- Argon2 password hashing
- Cloudinary image storage
- Shared: @repo/types (aligned with frontend)

---

## Shared Packages Layer

**@repo/types** — TypeScript type definitions
- Single source of truth for Service, Gallery, NailOptions, Booking, BusinessInfo types
- Modules: `service`, `gallery`, `nail-options`, `booking`, `business-info`
- See [shared-types.md](./shared-types.md)

**@repo/utils** — Shared utilities
- `cn` — Tailwind class merger
- `formatCurrency`, `formatDate`, `formatPhoneNumber`
- `useDebounce` — Shared React hook

**@repo/typescript-config** — TS configurations
- `base.json` — Strict mode, ES2022, verbatimModuleSyntax
- `react.json` — React-specific settings
- `nestjs.json` — Node.js backend settings

**@repo/eslint-config** — Linting rules
- `react.js` — React + TypeScript + Perfectionist
- `nestjs.js` — NestJS linting

**@repo/tailwind-config** — Theme configurations
- `client-theme.js` — Warm/cozy/feminine theme
- `admin-theme.js` — Professional/modern/blue theme

---

## External Services

**MongoDB Atlas** — Primary database
- Collections: `services`, `gallery`, `bookings`, `users`, `business_info`, `contacts`, `nail_shapes`, `nail_styles`
- `nail_shapes` — admin-managed nail shape lookup (value, label, labelVi, isActive, sortIndex)
- `nail_styles` — admin-managed nail style lookup (same schema as nail_shapes)

**Redis Cloud** — Caching layer
- Session caching, rate limiting storage, query result caching

**Cloudinary** — Image service
- Upload, transformations, CDN delivery
