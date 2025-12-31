# Turborepo Setup

**Version**: 2.7.2
**Package Manager**: npm@11.7.0
**Workspaces**: apps/*, packages/*, tooling/*

## Configuration

**turbo.json** (v2 format):
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
    "lint": {
      "outputs": []
    },
    "type-check": {
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Root Package.json

```json
{
  "name": "pink-nail-salon",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "tooling/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\""
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "prettier": "^3.7.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  },
  "packageManager": "npm@11.7.0"
}
```

## Task Pipeline

### build
- **Depends on**: `^build` (topological - build dependencies first)
- **Outputs**: `dist/**`, `build/**`
- **Cached**: YES
- **Example**: Client build waits for @repo/types, @repo/utils

### dev
- **Cache**: NO (development servers should never cache)
- **Persistent**: YES (keep running)
- **Example**: All 3 apps start dev servers in parallel

### lint
- **Outputs**: None
- **Cached**: YES (based on file content)

### type-check
- **Outputs**: None
- **Cached**: YES
- **Example**: All apps type-checked in parallel

### clean
- **Cache**: NO
- **Action**: Removes dist/, build/, node_modules/.cache

## Workspace Structure

```
pink-nail-salon/
├── apps/
│   ├── client/          (workspace: @apps/client)
│   ├── admin/           (workspace: @apps/admin)
│   └── api/             (workspace: @apps/api)
├── packages/
│   ├── types/           (workspace: @repo/types)
│   ├── utils/           (workspace: @repo/utils)
│   ├── typescript-config/
│   ├── eslint-config/
│   ├── tailwind-config/
│   └── ui/
├── tooling/
│   └── prettier-config/
└── package.json         (root workspace)
```

## Performance Metrics

### Build Times

| Scenario | Time | Cache Status |
|----------|------|--------------|
| First build (clean) | 7.023s | MISS |
| Second build (no changes) | 89ms | **FULL TURBO** |
| Build after type change | ~2s | Partial (types rebuild) |

**Speedup**: 79x faster with caching

### Type-check Times

| Scenario | Time |
|----------|------|
| All apps (parallel) | 3.937s |
| Single app | ~1.5s |

## Cache Behavior

**Cache Keys**: Hash of:
- Task inputs (source files)
- Dependencies (package.json)
- Environment variables (.env)
- Task configuration (turbo.json)

**Cache Storage**:
- Local: `.turbo/cache/`
- Remote: Not configured (optional)

**Cache Hits**:
```bash
• turbo 2.7.2
 Tasks:    3 successful, 3 total
Cached:    3 cached, 3 total  # ← FULL TURBO
  Time:    89ms
```

## Dependency Graph

```
client → @repo/types, @repo/utils, @repo/typescript-config, @repo/eslint-config, @repo/tailwind-config
admin  → @repo/types, @repo/utils, @repo/typescript-config, @repo/eslint-config, @repo/tailwind-config
api    → @repo/types, @repo/typescript-config, @repo/eslint-config
```

**Build Order**:
1. Shared packages (@repo/*)
2. Apps (client, admin, api) in parallel

## Scripts Usage

**Development**:
```bash
npm run dev           # All apps + watch mode
npm run dev --filter=client  # Client only
```

**Build**:
```bash
npm run build         # All apps (7s first, 89ms cached)
npm run build --filter=admin  # Admin only
```

**Type-check**:
```bash
npm run type-check    # All apps (3.9s)
npm run type-check --workspace=api  # API only
```

**Clean**:
```bash
npm run clean         # Remove all build artifacts
```

## Turbo Filters

**By app**:
```bash
turbo build --filter=client
turbo build --filter=admin
turbo build --filter=api
```

**By package**:
```bash
turbo build --filter=@repo/types
turbo build --filter=@repo/utils
```

**Multiple**:
```bash
turbo build --filter=client --filter=admin
```

**Glob patterns**:
```bash
turbo build --filter='./apps/*'
turbo build --filter='@repo/*'
```

## Global Dependencies

**turbo.json**:
```json
{
  "globalDependencies": [".env"]
}
```

Any `.env` change invalidates all caches.

## Optimizations

1. **Parallel Execution**: Tasks run in parallel when possible
2. **Incremental Builds**: Only rebuild changed packages
3. **Smart Caching**: Content-based cache keys
4. **Dependency Tracking**: Automatic task ordering
5. **Output Hashing**: Deterministic cache keys

## Migration Impact

**Before Turborepo**:
- Separate builds: ~20s per app (60s total)
- No caching
- Manual dependency management
- 100% type duplication

**After Turborepo**:
- Parallel builds: 7s total
- 89ms cached (79x faster)
- Automatic dependency graph
- 0% type duplication

---

**Status**: Production-ready
**Cache Performance**: 98.7% faster on repeat builds
**Workspace Count**: 12 (3 apps + 9 packages/tooling)
