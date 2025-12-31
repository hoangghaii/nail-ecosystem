# Turborepo Migration Plan: Pink Nail Salon

**Created**: 2025-12-31
**Author**: Planning Agent
**Status**: Ready for Implementation
**Estimated Total Time**: 18-24 hours
**Overall Risk**: MEDIUM

---

## Executive Summary

Migrate Pink Nail Salon project from independent apps to Turborepo monorepo to eliminate code duplication, improve build efficiency, and centralize configuration.

**Key Benefits**:
- **Eliminate 100% type duplication** between client and admin
- **Share ~70% of UI components** via common package
- **Centralize configs** (TypeScript, ESLint, Prettier, Tailwind)
- **Enable build caching** for faster CI/CD
- **Maintain Docker compatibility** throughout

**Key Risks**:
- Import path changes across many files (mitigated by incremental approach)
- Docker configuration complexity (mitigated by testing at each phase)
- Hot-reload compatibility (mitigated by proper volume mounts)

---

## Current State Analysis

### Structure
```
nail-project/
├── nail-client/    # React + Vite (port 5173)
├── nail-admin/     # React + Vite (port 5174)
├── nail-api/       # NestJS (port 3000)
└── docker-compose setup
```

### Problems
1. **100% duplicate types**: service.types.ts, gallery.types.ts identical in client/admin
2. **~70% duplicate UI components**: 16 in client, 11 in admin, significant overlap
3. **Duplicate dependencies**: 20+ shared packages installed twice
4. **Config inconsistency**: Manual sync required for TS/ESLint/Prettier configs
5. **No build caching**: Every build starts from scratch

### Current Tech Stack
- **Frontend**: React 19.2, TypeScript 5.9, Vite 7.2, Tailwind CSS v4
- **Backend**: NestJS 11, TypeScript 5.7, MongoDB, Redis
- **DevOps**: Docker Compose, Nginx (prod)

---

## Target Architecture

### Folder Structure
```
pink-nail-salon/
├── apps/
│   ├── client/      # Customer website
│   ├── admin/       # Admin dashboard
│   └── api/         # NestJS backend
├── packages/
│   ├── types/       # @repo/types - Shared TypeScript types
│   ├── ui/          # @repo/ui - Shared UI components
│   ├── utils/       # @repo/utils - Shared utilities
│   ├── typescript-config/
│   ├── eslint-config/
│   └── tailwind-config/
├── tooling/
│   └── prettier-config/
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### Shared Packages

**@repo/types** - Single source of truth for types
- Eliminates 100% duplication
- Exports: service, gallery, booking, auth
- Used by client, admin, API (DTOs)

**@repo/ui** - Shared UI primitives
- Base Radix components with variant support
- Themable via CSS variables
- Reduces ~70% UI component duplication

**@repo/utils** - Common utilities
- cn() function (clsx + tailwind-merge)
- Formatting helpers

**@repo/typescript-config** - Centralized TS configs
- base.json, react.json, nestjs.json

**@repo/eslint-config** - Shared linting rules
- react.js, nestjs.js

**@repo/tailwind-config** - Theme management
- base.js + client-theme.js + admin-theme.js
- Maintains design system separation

**@repo/prettier-config** - Unified formatting

### Package Manager: pnpm

**Why pnpm**:
- Better monorepo support
- Faster installs (hard links)
- Efficient disk usage
- Industry standard for Turborepo

---

## Migration Phases

### Phase 1: Preparation (1-2h, LOW risk)
- Install pnpm
- Create backup branch
- Verify current system works
- Document baseline

**Deliverables**: Backup created, pnpm installed

---

### Phase 2: Workspace Setup (2-3h, LOW risk)
- Configure pnpm workspace
- Install Turborepo
- Create root configs (package.json, turbo.json)
- Create directory structure

**Deliverables**: Turborepo installed, directories created

---

### Phase 3: Create Shared Packages (4-6h, LOW-MEDIUM risk)
- Create @repo/typescript-config
- Create @repo/prettier-config
- Create @repo/eslint-config
- Create @repo/types (copy shared types)
- Create @repo/utils
- Create @repo/tailwind-config

**Deliverables**: All shared packages created and installable

---

### Phase 4: Move Apps (2-3h, MEDIUM risk)
- Move nail-client → apps/client
- Move nail-admin → apps/admin
- Move nail-api → apps/api
- Update package.json with workspace dependencies
- Update configs to extend shared packages

**Deliverables**: Apps in monorepo structure, configs centralized

---

### Phase 5: Update Imports (3-4h, MEDIUM-HIGH risk)
- Replace local type imports with @repo/types
- Replace local utility imports with @repo/utils
- Delete duplicate files
- Verify type-check passes

**Deliverables**: No duplication, type-check passes

---

### Phase 6: Docker Migration (3-4h, HIGH risk)
- Update Dockerfiles with turbo prune
- Update docker-compose configs
- Update volume mounts for monorepo
- Test dev mode
- Test prod mode

**Deliverables**: Docker working with Turborepo

---

### Phase 7: Verification (2-3h, LOW risk)
- Full build test
- Lint and type-check
- Test Turbo caching
- Integration testing
- Update documentation
- Performance benchmarking

**Deliverables**: All tests pass, docs updated

---

## Risk Mitigation

### Import Path Changes (HIGH volume)
**Risk**: Breaking changes across many files
**Mitigation**:
- Use IDE global find-replace
- Type-check after each batch
- Commit frequently
- Keep backup branch

### Docker Complexity
**Risk**: Container build failures
**Mitigation**:
- Test at each phase
- Keep old configs until verified
- Use multi-stage builds for rollback points

### Hot-Reload Issues
**Risk**: Development workflow disruption
**Mitigation**:
- Proper volume mount configuration
- CHOKIDAR_USEPOLLING flag
- Test thoroughly in Phase 6

### Design System Separation
**Risk**: Mixing client/admin styles
**Mitigation**:
- Separate theme configs in @repo/tailwind-config
- Document theme usage clearly
- Review UI component imports

---

## Rollback Strategy

### Quick Rollback (Any Phase)
```bash
git checkout master
git branch -D feat/turborepo-migration
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Gradual Rollback
Each phase has specific rollback steps in phase documentation.

### Backup Branch
`backup/pre-turborepo-migration` preserved for emergency restoration.

---

## Success Metrics

**Code Quality**:
- ✅ 0% type duplication (currently 100%)
- ✅ Centralized configs (currently manual sync)
- ✅ Single package manager (currently npm in 3 places)

**Performance**:
- ✅ Faster CI/CD with Turbo caching
- ✅ Parallel task execution
- ✅ Smaller Docker images via turbo prune

**Developer Experience**:
- ✅ Single install command
- ✅ Consistent tooling across projects
- ✅ Easier onboarding

**Compatibility**:
- ✅ Docker dev mode functional
- ✅ Docker prod mode functional
- ✅ Hot-reload working
- ✅ Git hooks preserved

---

## Post-Migration

### Immediate Next Steps
1. Create GitHub Actions workflow using Turborepo
2. Consider remote caching setup
3. Add @repo/ui package with shared components
4. Document new development workflow for team

### Future Enhancements
- Remote caching (Vercel/self-hosted)
- Shared hooks package
- Shared API client package
- Automated dependency updates (Renovate/Dependabot)

---

## References

**Documentation**:
- Scout Report: `scout/scout-01-codebase-analysis.md`
- Research: `research/researcher-01-turborepo-docs.md`
- Architecture: `reports/01-proposed-architecture.md`
- Turbo Config: `reports/02-turbo-config.md`
- Docker: `reports/03-docker-integration.md`

**Phase Guides**:
- Phase 1: `phase-01-preparation.md`
- Phase 2: `phase-02-workspace-setup.md`
- Phase 3: `phase-03-shared-packages.md`
- Phase 4: `phase-04-move-apps.md`
- Phase 5: `phase-05-update-imports.md`
- Phase 6: `phase-06-docker-migration.md`
- Phase 7: `phase-07-verification.md`

**External Resources**:
- Turborepo Docs: https://turborepo.com/repo/docs
- Turborepo + Vite: https://turborepo.com/repo/docs/guides/frameworks/vite
- Docker Integration: https://turborepo.com/repo/docs/guides/tools/docker

---

## Unresolved Questions

1. **Git Hooks Migration**: Need to verify husky works at root level or per-package
2. **UI Package Design**: Decision needed on how to handle Motion (client) vs CSS transitions (admin)
3. **API Type Sharing**: Determine if API should import @repo/types or generate DTOs separately
4. **Environment Variables**: Finalize strategy for .env file organization in monorepo
5. **CI/CD Pipeline**: Design GitHub Actions workflow leveraging Turborepo features

---

## Approval & Timeline

**Recommended Approach**: Execute phases sequentially over 3-4 days

**Day 1**: Phases 1-3 (Preparation, Workspace, Shared Packages)
**Day 2**: Phases 4-5 (Move Apps, Update Imports)
**Day 3**: Phase 6 (Docker Migration)
**Day 4**: Phase 7 (Verification, Documentation)

**Critical Path**: Phase 5 (import updates) is highest risk - allocate extra time if needed.

---

**Plan Status**: ✅ READY FOR IMPLEMENTATION
**Next Step**: Review plan → Execute Phase 1
