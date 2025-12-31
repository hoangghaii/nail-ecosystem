# Proposed Turborepo Architecture

**Date**: 2025-12-31

---

## Target Folder Structure

```
pink-nail-salon/                    # Root monorepo
├── apps/
│   ├── client/                     # Customer website (port 5173)
│   ├── admin/                      # Admin dashboard (port 5174)
│   └── api/                        # NestJS backend (port 3000)
│
├── packages/
│   ├── types/                      # @repo/types
│   ├── ui/                         # @repo/ui
│   ├── utils/                      # @repo/utils
│   ├── typescript-config/          # @repo/typescript-config
│   ├── eslint-config/              # @repo/eslint-config
│   └── tailwind-config/            # @repo/tailwind-config
│
├── tooling/
│   └── prettier-config/            # @repo/prettier-config
│
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## Package Dependency Graph

```
apps/client
  ├─> @repo/types
  ├─> @repo/ui
  ├─> @repo/utils
  ├─> @repo/typescript-config
  ├─> @repo/eslint-config
  ├─> @repo/tailwind-config
  └─> @repo/prettier-config

apps/admin
  ├─> @repo/types
  ├─> @repo/ui
  ├─> @repo/utils
  ├─> @repo/typescript-config
  ├─> @repo/eslint-config
  ├─> @repo/tailwind-config
  └─> @repo/prettier-config

apps/api
  ├─> @repo/types
  ├─> @repo/typescript-config
  ├─> @repo/eslint-config
  └─> @repo/prettier-config

@repo/ui → @repo/utils → @repo/typescript-config
```

---

## Shared Packages Detail

### @repo/types
- Service, Gallery, Booking, Auth types
- Single source of truth
- Eliminates 100% duplication

### @repo/ui
- Shared Radix UI primitives
- Variant support for different themes
- ~70% deduplication

### @repo/utils
- cn() - clsx + tailwind-merge
- Format helpers
- Common utilities

### @repo/typescript-config
- base.json, react.json, nestjs.json
- Centralized strict settings

### @repo/eslint-config
- react.js, nestjs.js
- Consistent linting

### @repo/tailwind-config
- base.js + client-theme.js + admin-theme.js
- Design system variants

### @repo/prettier-config
- Unified formatting rules

---

## Migration Benefits

| Metric | Impact |
|--------|--------|
| Type deduplication | HIGH - 0% duplication |
| UI component sharing | HIGH - ~70% reduction |
| Build caching | HIGH - Turborepo parallelization |
| Dependency deduplication | MEDIUM - Single node_modules |
| Config consistency | MEDIUM - Centralized |
| CI/CD efficiency | HIGH - Affected-only builds |
