# Research Report: Turborepo Documentation Analysis

**Date**: 2025-12-31
**Researcher**: Turborepo Documentation Specialist
**Sources**: turborepo.com official documentation

---

## Workspace Structure Best Practices

### Directory Convention

**Recommended structure**:
```
monorepo/
├── apps/           # Applications and services
├── packages/       # Libraries, tooling, shared utilities
├── turbo.json      # Task orchestration
└── package.json    # Root workspace config
```

**Key Constraints**:
- NO nested packages like `apps/**` or `packages/**` (causes ambiguity)
- CAN use multiple globs: `packages/*` + `packages/group/*` (without package.json at group level)
- Each directory with package.json becomes discoverable workspace

### Package Philosophy

Each package = "own unit within workspace" with:
- Independent package.json
- Own source code and configuration
- Individual tooling setup

**Anti-patterns**:
- DON'T create root tsconfig.json (let packages own configs)
- DON'T use relative paths across packages (`../`) - use formal imports
- DON'T create monolithic shared packages - use focused, single-purpose packages

---

## Internal Package Creation

### Structure Requirements

1. **Create directory**: e.g., `./packages/types`
2. **Add package.json** with scoped name: `@repo/types`
3. **Configure exports** for multiple entrypoints

### Key Configuration

**package.json**:
```json
{
  "name": "@repo/types",
  "exports": {
    "./service": "./src/service.ts",
    "./gallery": "./src/gallery.ts"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

**tsconfig.json**:
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Workspace Dependencies

**Package manager protocols**:
- pnpm/bun: `"@repo/math": "workspace:*"`
- yarn/npm: `"@repo/math": "*"`

Benefit: "Turborepo will recognize @repo/math as dependent for ordering tasks"

---

## turbo.json Configuration

### Core Concepts

Turborepo "schedules tasks for maximum speed, parallelizing work across all cores."

**Configuration manages**:
- Task dependencies (build → test → lint order)
- Caching outputs (prevent redundant work)
- Task inputs/outputs
- Environment variable handling

**Key feature**: Remote caching - "CI never needs to do same work twice"

---

## Environment Variables Strategy

### System Variables

Turborepo supports "System environment variables" for environment-specific settings across workspace packages.

**Vite Integration**: Standard Vite env var conventions apply (VITE_ prefix)

**Best Practice**: Define per-package .env files, reference in turbo.json

---

## Docker Integration

### The Problem

Monorepo changes trigger global lockfile updates → unnecessary rebuilds across all services.

### Solution: `turbo prune --docker`

Creates minimal Docker context in `./out/`:
- `./out/json/` - Package manifests only (for dependency installation)
- `./out/full/` - Complete source files

**Benefit**: Docker layer caching skips `npm install` when only source changes

### Multi-Stage Dockerfile Pattern

```dockerfile
FROM base AS prepare
RUN yarn global add turbo
COPY . .
RUN turbo prune web --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
RUN yarn install
COPY --from=prepare /app/out/full/ .
RUN yarn turbo build

FROM base AS runner
COPY --from=builder /app .
CMD ["node", "server.js"]
```

**Strategy**: Separate immutable dependency installation from volatile source code

### Remote Caching in Docker

```dockerfile
ARG TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
RUN yarn turbo build
```

**Invoke**: `docker build --build-arg TURBO_TEAM="name" --build-arg TURBO_TOKEN="token"`

---

## Vite-Specific Guidance

### Project Setup

Scaffold Vite apps in monorepo:
```bash
pnpm create vite@latest apps/my-app
```

Reference internal packages as workspace dependencies in app's package.json.

### Build Configuration

For microfrontends, configure base path:
```typescript
export default defineConfig({
  base: '/admin',
});
```

Ensures assets route correctly.

### Task Inheritance

Apps inherit task definitions from root `turbo.json` by default.
Customize per-app via Package Configurations when needed.

### Best Practices

- Use `workspace:*` protocol for internal packages
- Run package manager install after adding dependencies
- Consider "with-vite" example template as starting point

---

## Key Insights for Pink Nail Salon

1. **Structure**: apps/ for client/admin/api, packages/ for shared code
2. **Shared packages**: Create focused packages (@repo/types, @repo/ui, @repo/utils)
3. **Docker**: Use turbo prune to optimize container builds
4. **Vite**: Works seamlessly, configure base paths for routing
5. **Environment vars**: Per-package .env files, standard Vite conventions
6. **Caching**: Remote caching can dramatically speed up CI/CD

---

## Open Questions

1. NestJS-specific turbo.json configuration patterns?
2. How to handle different design systems (client vs admin) in shared UI package?
3. Hot-reload performance with Turborepo + Docker volumes?
4. Migration strategy for existing git hooks (husky)?
