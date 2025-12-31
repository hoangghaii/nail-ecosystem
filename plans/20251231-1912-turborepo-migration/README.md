# Turborepo Migration Plan

**Created**: 2025-12-31
**Status**: Phase 4 Complete - Phase 5 Ready for Execution
**Estimated Time**: 18-24 hours
**Execution Time Used**: 8-10 hours
**Remaining**: 8-14 hours

---

## Execution Progress

### Completed Phases ✅

**Phase 1: Preparation** (100%)
- ✅ pnpm installed and verified
- ✅ Backup created (backup/pre-turborepo-migration)
- ✅ System verified working
- ✅ Baseline documented

**Phase 2: Workspace Setup** (100%)
- ✅ Turborepo 2.7.2 installed
- ✅ npm workspaces configured
- ✅ pnpm-workspace.yaml created
- ✅ Root package.json configured
- ✅ turbo.json created with pipeline

**Phase 3: Shared Packages** (100%)
- ✅ @repo/types created (service, gallery, booking types)
- ✅ @repo/utils created (cn function, helpers)
- ✅ @repo/typescript-config created
- ✅ @repo/eslint-config created
- ✅ @repo/prettier-config created
- ✅ @repo/tailwind-config created
- ✅ All 6 packages installable

**Phase 4: Move Apps** (100%)
- ✅ nail-client moved to apps/client
- ✅ nail-admin moved to apps/admin
- ✅ nail-api moved to apps/api
- ✅ package.json updated with workspace dependencies
- ✅ Config files extended from shared packages
- ✅ 1348 total packages installed
- ✅ Workspace structure validated

### Current Phase: Phase 5 - Update Imports

**Status**: Ready for Execution (HIGH RISK - Requires User Approval)

**Key Activities**:
- Update import statements across all apps (HIGH RISK)
- Replace local type imports with @repo/types
- Replace utility imports with @repo/utils
- Delete duplicate files from apps
- Type-check validation at each step
- Frequent commits for rollback capability

**Estimated Time**: 3-4 hours
**Risk Level**: MEDIUM-HIGH (many file changes)

### Pending Phases

**Phase 6**: Docker Migration (3-4h, HIGH risk)
**Phase 7**: Verification & Testing (2-3h, LOW risk)

---

## Quick Start

Read documents in this order:

1. **plan.md** - Executive summary, architecture, timeline
2. **Phase guides** - Step-by-step implementation
3. **Reports** - Technical details and configurations
4. **Scout/Research** - Background analysis

---

## Document Index

### Main Plan
- `plan.md` - Complete migration plan with all phases

### Phase Guides (Execute in Order)
1. `phase-01-preparation.md` - Install pnpm, create backup (1-2h)
2. `phase-02-workspace-setup.md` - Configure Turborepo (2-3h)
3. `phase-03-shared-packages.md` - Create shared packages (4-6h)
4. `phase-04-move-apps.md` - Move apps to workspace (2-3h)
5. `phase-05-update-imports.md` - Update import paths (3-4h)
6. `phase-06-docker-migration.md` - Update Docker configs (3-4h)
7. `phase-07-verification.md` - Test and verify (2-3h)

### Technical Reports
- `reports/01-proposed-architecture.md` - Target structure
- `reports/02-turbo-config.md` - Turbo.json configuration
- `reports/03-docker-integration.md` - Docker setup

### Analysis
- `scout/scout-01-codebase-analysis.md` - Current state analysis
- `research/researcher-01-turborepo-docs.md` - Turborepo research

---

## Key Benefits

- **Eliminate 100% type duplication** between client/admin
- **Share ~70% UI components**
- **Centralized configs** (TS, ESLint, Prettier)
- **Build caching** for faster CI/CD
- **Docker compatible**

---

## Risk Summary

| Phase | Risk | Mitigation |
|-------|------|------------|
| 1-2 | LOW | Config only, easy rollback |
| 3-4 | MEDIUM | Create packages before moving apps |
| 5 | HIGH | Many import changes, frequent commits |
| 6 | HIGH | Docker complexity, thorough testing |
| 7 | LOW | Verification only |

---

## Rollback Strategy

Each phase has specific rollback steps. Quick rollback:

```bash
git checkout master
git branch -D feat/turborepo-migration
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Backup branch: `backup/pre-turborepo-migration`

---

## Timeline

**Recommended**: 3-4 days sequential execution

- **Day 1**: Phases 1-3 (Prep, Workspace, Packages)
- **Day 2**: Phases 4-5 (Move Apps, Update Imports)
- **Day 3**: Phase 6 (Docker)
- **Day 4**: Phase 7 (Verification)

---

## Success Criteria

✅ All builds pass
✅ No type duplication
✅ Turbo caching works
✅ Docker dev/prod functional
✅ Hot-reload preserved
✅ Git hooks working
