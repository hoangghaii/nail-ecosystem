# Turborepo Migration - Brainstorming Summary

**Date**: 2025-12-31
**Priority**: HIGHEST
**Status**: Plan approved, ready for implementation

---

## Problem Statement

**User Pain Point**: Code duplication across Pink Nail Salon projects

**Specific Issues**:
- Shared TypeScript types duplicated in nail-client and nail-admin
- Common UI components potentially duplicated
- Configuration files (TS/ESLint/Prettier) repeated per project
- No build caching or task orchestration
- Manual dependency management across 3 projects

**Current State**:
- 3 independent projects in single Git repo (multi-project monorepo)
- Manual type synchronization between client/admin
- Docker Compose orchestration only
- No workspace management

---

## Requirements

**Must Have**:
1. Eliminate code duplication (especially shared types)
2. Turborepo monorepo structure with workspaces
3. Maintain Docker Compose compatibility
4. Preserve current dev workflow (hot-reload, ports)
5. Keep production deployment working

**Should Have**:
- Build caching (local + remote capable)
- Shared component library
- Centralized configuration
- Parallel task execution

**Nice to Have**:
- CI/CD optimization
- Remote caching setup
- Shared utilities package

---

## Evaluated Approaches

### Option 1: Stay As-Is ❌ REJECTED

**Description**: Keep current multi-project structure with manual sync

**Pros**:
- Zero migration cost
- No learning curve
- Already working

**Cons**:
- Continued code duplication
- Manual type syncing error-prone
- No build optimization
- Doesn't solve user's pain point

**Verdict**: Rejected - doesn't address duplicate code issue

---

### Option 2: Lightweight Workspace (npm/pnpm workspaces) ⚠️ CONSIDERED

**Description**: Add workspace config without Turborepo orchestration

**Pros**:
- Minimal complexity
- Solves shared types issue
- 2-4 hour migration
- Low risk

**Cons**:
- No build caching
- No task orchestration
- Manual task running
- Doesn't meet user's explicit request

**Verdict**: Not selected - user explicitly wants Turborepo

---

### Option 3: Full Turborepo Migration ✅ SELECTED

**Description**: Complete migration to Turborepo with workspace management and build orchestration

**Pros**:
- ✅ Eliminates 100% type duplication
- ✅ Build caching (local + remote)
- ✅ Task orchestration & parallelization
- ✅ Shared packages infrastructure
- ✅ Centralized configs
- ✅ Scales to future growth
- ✅ Industry-standard monorepo solution
- ✅ Directly addresses user's pain point

**Cons**:
- ⚠️ 18-24 hour migration effort
- ⚠️ Learning curve for Turborepo
- ⚠️ Potential Docker conflicts (mitigated in plan)
- ⚠️ Breaking changes to file structure
- ⚠️ CI/CD rework required

**Verdict**: **RECOMMENDED** - best long-term solution for eliminating duplication

---

## Final Recommended Solution

### Architecture: Turborepo Monorepo

**Structure**:
```
pink-nail-salon/
├── apps/
│   ├── client/      # nail-client (React + Vite)
│   ├── admin/       # nail-admin (React + Vite)
│   └── api/         # nail-api (NestJS)
├── packages/
│   ├── types/       # @repo/types - Shared TypeScript types
│   ├── ui/          # @repo/ui - Shared React components
│   ├── utils/       # @repo/utils - Common utilities
│   ├── typescript-config/
│   ├── eslint-config/
│   └── tailwind-config/
├── tooling/
│   └── prettier-config/
├── turbo.json       # Build orchestration config
├── package.json     # Root workspace config
└── pnpm-workspace.yaml
```

**Package Manager**: pnpm (Turborepo best practice)

**Shared Packages Created**:
1. **@repo/types** - Service, Gallery, Booking types (eliminates duplication)
2. **@repo/ui** - Shared React components (~16+11 components)
3. **@repo/utils** - Common utilities (API client, formatters, validators)
4. **@repo/typescript-config** - Centralized TS configs
5. **@repo/eslint-config** - Unified linting rules
6. **@repo/tailwind-config** - Shared Tailwind setup

---

## Implementation Considerations

### Timeline

**Total Effort**: 18-24 hours over 3-4 days

**Phase Breakdown**:
- Day 1: Setup + Shared Packages (7-11h)
- Day 2: Move Apps + Update Imports (5-7h)
- Day 3: Docker Migration (3-4h)
- Day 4: Verification (2-3h)

**Critical Path**:
1. Prepare & backup (Phase 1)
2. Workspace setup (Phase 2)
3. Create shared packages (Phase 3) ← CRITICAL
4. Move apps (Phase 4)
5. Update all imports (Phase 5) ← HIGH RISK
6. Migrate Docker (Phase 6) ← HIGH RISK
7. Verify & test (Phase 7)

---

### Risks & Mitigations

**HIGH RISK: Import Path Updates (Phase 5)**
- **Risk**: 100+ import statements need updates
- **Impact**: Build breaks if missed
- **Mitigation**: Automated search/replace scripts, frequent commits, testing per app

**HIGH RISK: Docker Integration (Phase 6)**
- **Risk**: Docker + Turborepo orchestration conflict
- **Impact**: Dev/prod environments broken
- **Mitigation**: Detailed integration guide, test both modes, rollback plan

**MEDIUM RISK: Shared Package Design**
- **Risk**: Wrong abstractions, tight coupling
- **Impact**: Reduced flexibility
- **Mitigation**: Start minimal (types only), add incrementally

**MEDIUM RISK: Breaking Changes**
- **Risk**: File paths, imports, scripts all change
- **Impact**: Developer workflow disruption
- **Mitigation**: Clear communication, comprehensive docs, training session

**LOW RISK: Learning Curve**
- **Risk**: Team unfamiliar with Turborepo
- **Impact**: Slower development initially
- **Mitigation**: Documentation, examples, gradual adoption

---

### Technical Challenges

**1. Environment Variables**
- Current: Per-project `.env` files
- Solution: Root `.env` + workspace-specific overrides
- Config: turbo.json globalEnv + apps dotenv-cli

**2. Docker Build Context**
- Current: Individual Dockerfiles per project
- Solution: Root Dockerfile with multi-stage builds OR keep individual + turbo prune
- Strategy: Documented in `reports/03-docker-integration.md`

**3. Type Imports in NestJS**
- Current: NestJS uses DTOs
- Solution: Either (A) import @repo/types in DTOs OR (B) keep DTOs, generate from types
- Decision needed: See unresolved questions

**4. Design System Differences**
- Current: Client (warm, borders) vs Admin (blue, shadows)
- Solution: @repo/ui with variant props OR separate @repo/ui-client + @repo/ui-admin
- Decision needed: See unresolved questions

**5. Hot-Reload Performance**
- Current: Vite HMR, NestJS watch
- Solution: Turborepo doesn't interfere, preserves existing behavior
- Verification: Test in Phase 7

---

## Success Metrics

**Quantitative**:
- ✅ 0% type duplication (currently ~70+ duplicated type lines)
- ✅ Build time reduction >30% with caching
- ✅ Single `pnpm install` for all projects
- ✅ All tests passing
- ✅ Docker dev + prod modes functional

**Qualitative**:
- ✅ Developer experience improved
- ✅ Easier to add new apps
- ✅ Simplified dependency management
- ✅ Clearer project structure
- ✅ Better maintainability

---

## Validation Criteria

**Before Migration Complete**:
- [ ] All apps build successfully
- [ ] All apps run in development mode
- [ ] Hot-reload working in all apps
- [ ] Docker Compose dev mode working
- [ ] Docker Compose prod mode working
- [ ] No type duplication exists
- [ ] turbo build runs successfully
- [ ] turbo dev runs successfully
- [ ] Environment variables working
- [ ] Port mapping preserved (5173, 5174, 3000)

**Post-Migration Verification**:
- [ ] Feature parity with pre-migration
- [ ] Performance equal or better
- [ ] All existing functionality works
- [ ] Documentation updated
- [ ] Team trained on new workflow

---

## Next Steps

### Immediate (Today)

1. **Review Plan**: Read `@plans/20251231-1912-turborepo-migration/README.md`
2. **Understand Phases**: Review all 7 phase guides
3. **Check Prerequisites**: Verify Node.js v18+, Git clean working directory
4. **Create Backup**: Branch `backup/pre-turborepo-migration`

### Day 1 (Tomorrow)

**Phase 1 - Preparation** (1-2h):
- Install pnpm globally
- Create backup branch
- Document current state
- Install Turborepo globally

**Phase 2 - Workspace Setup** (2-3h):
- Initialize Turborepo
- Configure pnpm workspace
- Set up turbo.json
- Create base package structure

**Phase 3 - Shared Packages** (4-6h):
- Create @repo/types package
- Extract shared type definitions
- Set up @repo/ui package
- Configure @repo/typescript-config
- Test package imports

### Day 2

**Phase 4 - Move Apps** (2-3h):
- Restructure to apps/ directory
- Update package.json files
- Configure workspace dependencies

**Phase 5 - Update Imports** (3-4h):
- Update all import paths
- Migrate to @repo/* packages
- Verify no broken imports
- Test builds

### Day 3

**Phase 6 - Docker Migration** (3-4h):
- Update Dockerfiles
- Modify docker-compose.yml
- Configure for Turborepo
- Test dev + prod modes

### Day 4

**Phase 7 - Verification** (2-3h):
- Run full test suite
- Verify all functionality
- Performance testing
- Documentation updates

---

## Dependencies

**External**:
- Node.js v18+ (verify: `node --version`)
- pnpm (install: `npm install -g pnpm`)
- Docker + Docker Compose (already have)
- Git (already have)

**Documentation**:
- Turborepo docs: https://turborepo.com/docs
- pnpm workspaces: https://pnpm.io/workspaces
- Vite + Turborepo guide: https://turborepo.com/docs/guides/frameworks/vite

**Skills/Tools**:
- Sequential-thinking skill (for complex troubleshooting)
- Docs-seeker skill (for latest package docs)
- Debugger agent (if issues arise)
- Code-reviewer agent (post-migration review)

---

## Unresolved Questions

**Require Decisions Before/During Implementation**:

1. **Git Hooks Strategy**
   - Option A: Husky at root (single pre-commit for all)
   - Option B: Per-package hooks (apps/client, apps/admin separate)
   - **Recommendation**: Root-level for consistency

2. **UI Package Design**
   - Option A: Single @repo/ui with variant props (theme prop)
   - Option B: Separate @repo/ui-client + @repo/ui-admin
   - **Recommendation**: Option B (cleaner separation, follows existing design systems)

3. **API Type Sharing**
   - Option A: Import @repo/types directly in NestJS DTOs
   - Option B: Keep DTOs separate, generate from @repo/types
   - **Recommendation**: Option A for simplicity (can refactor later)

4. **Environment Variable Organization**
   - How to structure .env files in monorepo?
   - Root .env + app-specific overrides?
   - **Recommendation**: Root .env.example + apps/.env for overrides

5. **CI/CD Pipeline Design**
   - GitHub Actions workflow structure?
   - How to leverage Turborepo caching in CI?
   - **Recommendation**: Address after migration, separate planning session

---

## Rollback Strategy

**If migration fails at any phase**:

1. Checkout backup branch: `git checkout backup/pre-turborepo-migration`
2. Verify everything works
3. Review what went wrong
4. Fix issue in plan
5. Retry migration

**Phase-specific rollback**: Each phase guide includes specific rollback steps

**Time to rollback**: <5 minutes (git checkout)

---

## Post-Migration Opportunities

**Once Turborepo is stable**:

1. **Remote Caching** - Set up Vercel/custom remote cache (10x faster CI builds)
2. **Shared Component Library** - Expand @repo/ui with more components
3. **Shared Utilities** - Extract common logic to @repo/utils
4. **Storybook Integration** - Document shared components
5. **Automated Type Generation** - Generate API types from OpenAPI spec
6. **Monorepo Best Practices** - Implement affected command (only build changed)

---

## Lessons Learned (Pre-Migration Notes)

**For Future Reference**:

1. **Context Engineering Applied** - Already optimized CLAUDE.md (53% reduction), good foundation
2. **Documentation First** - Comprehensive docs prevent confusion
3. **Incremental Migration** - Phase approach reduces risk
4. **Backup Everything** - Git branches = safety net
5. **Test Thoroughly** - Verification phase critical

---

## Conclusion

**Decision**: Proceed with Turborepo migration to eliminate code duplication

**Rationale**:
- Directly solves user's pain point (duplicate code)
- Industry-standard solution (Turborepo widely adopted)
- Comprehensive plan reduces risk
- Long-term benefits (scalability, maintainability)
- Acceptable effort (18-24 hours over 3-4 days)

**Confidence Level**: HIGH (plan vetted, risks identified, mitigations in place)

**Ready to Execute**: YES

---

## References

**Plan Location**: `@plans/20251231-1912-turborepo-migration/`

**Key Documents**:
- Main Plan: `plan.md`
- Architecture: `reports/01-proposed-architecture.md`
- Turbo Config: `reports/02-turbo-config.md`
- Docker Integration: `reports/03-docker-integration.md`

**External Resources**:
- Turborepo Docs: https://turborepo.com/docs
- Vite + Turbo Guide: https://turborepo.com/docs/guides/frameworks/vite
- pnpm Workspaces: https://pnpm.io/workspaces

**Planner Agent ID**: a8617ad (resume if need plan updates)

---

**Brainstorm Status**: ✅ COMPLETE
**Next Action**: Review plan → Execute Phase 1
**Expected Completion**: 3-4 days from start
