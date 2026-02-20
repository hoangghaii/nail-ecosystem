# Phase 04 — Validation & Cleanup

**Parent plan**: [plan.md](./plan.md)
**Depends on**: [phase-03-dockerfile-and-docker-compose.md](./phase-03-dockerfile-and-docker-compose.md)

---

## Overview

- **Date**: 2026-02-20
- **Priority**: High
- **Status**: pending
- **Description**: Verify full stack works with pnpm, update documentation, finalize cleanup.

---

## Key Insights

- Turborepo task runner invocation changes: `npm run X` → `pnpm run X` (or just `pnpm X`)
- `npx turbo` references in README become `pnpm exec turbo` or `pnpm turbo` (via root script)
- CLAUDE.md and README.md have numerous `npm run` / `npm install` / `npx turbo` references — all must update
- VS Code may cache old npm settings — `.vscode/settings.json` may need `npm.packageManager` update
- `pnpm-lock.yaml` must be committed; `package-lock.json` must be confirmed deleted from git history

---

## Requirements

- Phases 01–03 complete
- Local pnpm install succeeds
- All Docker builds pass

---

## Related Code Files

| File | Action |
|------|--------|
| `/Users/hainguyen/Documents/nail-project/README.md` | modify — npm → pnpm command references |
| `/Users/hainguyen/Documents/nail-project/CLAUDE.md` | modify — npm → pnpm command references |
| `/Users/hainguyen/Documents/nail-project/.vscode/settings.json` | inspect / modify if needed |
| `pnpm-lock.yaml` | commit to git |
| All `package-lock.json` | confirm deleted from git |

---

## Implementation Steps

### Step 1 — Run full local validation suite

```bash
cd /Users/hainguyen/Documents/nail-project

# Type-check all apps in parallel
pnpm run type-check

# Build all apps (verify Turborepo + pnpm integration)
pnpm run build

# Lint all apps
pnpm run lint

# Format check
pnpm run format
```

Expected: same output as before migration, same build times (~7s full, ~89ms cached).

### Step 2 — Run Docker integration tests

```bash
# Dev mode (hot-reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Verify endpoints:
# Client: http://localhost:5173
# Admin:  http://localhost:5174
# API:    http://localhost:3000/health

docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Prod mode
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify endpoints via nginx:
# http://localhost       → Client
# http://localhost/admin → Admin
# http://localhost/api   → API

docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Step 3 — Update README.md

Replace all npm command references. Key substitutions:

| Old | New |
|-----|-----|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm run dev` |
| `npm run build` | `pnpm run build` |
| `npm run type-check` | `pnpm run type-check` |
| `npm run lint` | `pnpm run lint` |
| `npm run clean` | `pnpm run clean` |
| `npm run format` | `pnpm run format` |
| `npx turbo build --filter=client` | `pnpm exec turbo build --filter=client` |
| `npx turbo dev --filter=client` | `pnpm exec turbo dev --filter=client` |
| `npm >= 9.0.0` (prerequisites) | `pnpm >= 10.0.0` |

Also update Quick Start prerequisites section:

```markdown
### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0 (`corepack enable && corepack use pnpm@10.30.0`)
- Docker + Docker Compose (for containerized deployment)
```

### Step 4 — Update CLAUDE.md

Same substitutions as README.md. Key sections in CLAUDE.md to update:

1. **Project Overview** section — `npm workspaces` → `pnpm workspaces`
2. **Turborepo Commands** section:
   ```bash
   pnpm run dev        # Run all apps in parallel
   pnpm run build      # Build all apps
   pnpm run type-check # Type-check all apps
   pnpm run lint       # Lint all apps
   ```
3. **Docker Quick Start** section — no change (docker compose commands unchanged)
4. **Development Workflow / Turborepo Workflow** section:
   ```bash
   # All apps:
   pnpm run dev
   # Single app:
   pnpm exec turbo dev --filter=client|admin|api
   # Build:
   pnpm run build
   ```
5. **Working with Shared Packages** section — workspace protocol note:
   ```json
   { "@repo/types": "workspace:*" }
   ```
6. **Troubleshooting** section:
   ```bash
   # Turbo cache:
   pnpm run clean
   # Reinstall:
   pnpm install
   ```
7. **Tech Stack / DevOps** bullet: `npm workspaces` → `pnpm workspaces`
8. **Quick Reference** block at bottom — update all npm commands

### Step 5 — Update docs/code-standards.md

One section references workspace protocol. Already shows both `"*"` and `"workspace:*"` — update to only show `"workspace:*"`:

```json
// apps/client/package.json
{
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

Also update the Turborepo Task Naming section:
```bash
pnpm run build
pnpm run type-check
pnpm run lint
pnpm exec turbo build --filter=client
```

### Step 6 — Check VS Code settings

Read `/Users/hainguyen/Documents/nail-project/.vscode/settings.json`. If it contains `"npm.packageManager": "npm"` or similar, update to `"npm.packageManager": "pnpm"`.

If no package manager setting exists, no change needed — VS Code auto-detects from `packageManager` field.

### Step 7 — Git cleanup

```bash
cd /Users/hainguyen/Documents/nail-project

# Stage deleted lockfiles
git rm --cached package-lock.json 2>/dev/null || true
git rm --cached apps/client/package-lock.json 2>/dev/null || true
git rm --cached apps/admin/package-lock.json 2>/dev/null || true
git rm --cached apps/api/package-lock.json 2>/dev/null || true

# Stage new and modified files
git add pnpm-workspace.yaml
git add .npmrc
git add pnpm-lock.yaml
git add package.json
git add .gitignore
git add apps/client/package.json apps/admin/package.json apps/api/package.json
git add packages/types/package.json packages/utils/package.json
git add apps/client/Dockerfile apps/admin/Dockerfile apps/api/Dockerfile
git add README.md CLAUDE.md docs/code-standards.md

# Verify staged files look correct
git status
git diff --cached --stat

# Commit
git commit -m "chore(root): migrate from npm workspaces to pnpm workspaces

- Replace npm workspaces with pnpm-workspace.yaml
- Update all @repo/* deps from '*' to 'workspace:*'
- Add .npmrc with public-hoist-pattern for Turborepo compatibility
- Update Dockerfiles to use pnpm fetch + install --offline pattern
- Remove package-lock.json files, generate pnpm-lock.yaml
- Update packageManager field to pnpm@10.30.0
- Update README, CLAUDE.md, code-standards.md command references"
```

---

## Todo Checklist

- [ ] `pnpm run type-check` passes (all apps)
- [ ] `pnpm run build` passes (all apps, correct output)
- [ ] `pnpm run lint` passes
- [ ] Docker dev mode: all 3 containers healthy, hot-reload works
- [ ] Docker prod mode: all 3 containers healthy, nginx routing works
- [ ] README.md — all `npm` references replaced
- [ ] CLAUDE.md — all `npm` references replaced
- [ ] `docs/code-standards.md` — workspace protocol example updated
- [ ] `.vscode/settings.json` checked
- [ ] `package-lock.json` files removed from git tracking
- [ ] `pnpm-lock.yaml` committed to git
- [ ] Final commit created with conventional commit message

---

## Success Criteria

- Zero npm references in non-script/non-comment contexts across Dockerfiles, README, CLAUDE.md
- `pnpm run build` output matches pre-migration (7s full / 89ms cached)
- Docker prod stack passes all health checks
- `pnpm-lock.yaml` present in git, `package-lock.json` absent
- Team members can clone and run `pnpm install` without additional setup (corepack handles pnpm version)

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Turborepo cache invalidated after migration | Certain (one-time) | Expected — first build after migration always full build; cache rebuilds from pnpm artifacts |
| `pnpm run build` filter syntax differs | Low | `pnpm run build -- --filter=client` syntax identical to npm; double-dash passes args to turbo |
| Docker layer cache fully invalidated | Certain (one-time) | Expected after Dockerfile changes; subsequent builds use new pnpm cache mounts |
| Developer machines still have npm-installed node_modules | Medium | Document: run `rm -rf node_modules && pnpm install` after pulling |

---

## Post-Migration Developer Onboarding Note

Add to README.md `## Quick Start` section:

```markdown
> **Migration note (2026-02-20)**: This project uses pnpm. Run `corepack enable` once
> on your machine, then `pnpm install`. Do not run `npm install`.
```

---

## Next Steps

Migration complete. Monitor for:
- Any `npm install` accidentally run by team members (will fail due to `packageManager` enforcement via corepack)
- Renovate/Dependabot PRs — if configured later, must support pnpm lockfile format
