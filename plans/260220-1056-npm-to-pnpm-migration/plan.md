# npm → pnpm Migration Plan

**Date**: 2026-02-20
**Status**: Complete
**Description**: Migrate Pink Nail Salon Turborepo monorepo from npm workspaces to pnpm workspaces.

---

## Phase Table

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Analysis & Prep | complete | [phase-01-analysis-and-prep.md](./phase-01-analysis-and-prep.md) |
| 2 | pnpm Workspace Setup | complete | [phase-02-pnpm-workspace-setup.md](./phase-02-pnpm-workspace-setup.md) |
| 3 | Dockerfile & Docker Compose | complete | [phase-03-dockerfile-and-docker-compose.md](./phase-03-dockerfile-and-docker-compose.md) |
| 4 | Validation & Cleanup | complete | [phase-04-validation-and-cleanup.md](./phase-04-validation-and-cleanup.md) |

---

## Key Decisions

- **pnpm version**: 10.30.0 (latest stable as of 2026-02-20)
- **Node image**: keep `node:24.12.0-alpine` (client/admin), `node:20.18.2-alpine` (api) — unchanged
- **workspace:* protocol**: all `@repo/*` deps using `"*"` must become `"workspace:*"`
- **`.npmrc`**: use `public-hoist-pattern[]=*` for Turborepo compatibility; avoid `shamefully-hoist` (breaks isolation)
- **Docker strategy**: `pnpm fetch` + `pnpm install --offline` for optimal layer caching
- **No turbo.json changes needed**: Turborepo 2.3 is package-manager agnostic
- **husky `prepare` script**: pnpm runs lifecycle scripts differently — needs verification
- **`.gitignore`**: remove `!package-lock.json` line, add `pnpm-lock.yaml` keep (currently gitignored — must invert)

---

## Files Affected (summary)

| File | Action |
|------|--------|
| `/package.json` | modify — remove `workspaces`, update `packageManager`, update `engines` |
| `/pnpm-workspace.yaml` | create |
| `/.npmrc` | create |
| `/.gitignore` | modify |
| `apps/client/package.json` | modify — `@repo/*` deps `*` → `workspace:*` |
| `apps/admin/package.json` | modify — `@repo/*` deps `*` → `workspace:*` |
| `apps/api/package.json` | modify — `@repo/*` deps `*` → `workspace:*` |
| `packages/types/package.json` | modify — `@repo/*` devDeps `*` → `workspace:*` |
| `packages/utils/package.json` | modify — `@repo/*` devDeps `*` → `workspace:*` |
| `apps/client/Dockerfile` | modify — pnpm install pattern |
| `apps/admin/Dockerfile` | modify — pnpm install pattern |
| `apps/api/Dockerfile` | modify — pnpm install pattern |
| `package-lock.json` (root + 3 apps) | delete |
| `README.md`, `CLAUDE.md` | modify — command references |

---

## Unresolved Questions

- husky `prepare` hook: pnpm does not run `prepare` on `pnpm install` by default — confirm if husky init must be triggered differently or if `.husky/` dir already committed
- `@nestjs/cli` in api devDeps uses `nest build` which invokes local bin — confirm pnpm hoisting doesn't break NestJS CLI resolution inside Docker builder stage
- `turbo prune` output compatibility: confirm `turbo prune --docker --filter=<app>` generates correct `pnpm-lock.yaml` subset (Turborepo 2.3 supports this natively)
