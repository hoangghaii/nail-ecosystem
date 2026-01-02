# React Query Integration Plan

**Created**: 2026-01-01
**Status**: Phases 1-4 Complete | Phases 5-6 Ready
**Estimated Time**: 15-22 hours total | 6-9 hours remaining
**Phase 1 Completed**: 2026-01-01 ✅
**Phase 2 Completed**: 2026-01-01 ✅
**Phase 3 Completed**: 2026-01-01 ✅
**Phase 4 Completed**: 2026-01-01 ✅

---

## Quick Start

1. ✅ Phase 1 (Foundation) - COMPLETED (2026-01-01)
2. ✅ Phase 2 (Admin Core Hooks) - COMPLETED (2026-01-01)
3. ✅ Phase 3 (Admin Secondary Hooks) - COMPLETED (2026-01-01)
4. ✅ Phase 4 (Client Hooks) - COMPLETED (2026-01-01)
5. Start with Phase 5 (Component Migration) - Read `phase-05-migration.md`
6. Work through phases sequentially
7. Test after each phase before proceeding

---

## Plan Structure

```
260101-2139-react-query-integration/
├── README.md                           # This file
├── plan.md                            # Complete implementation plan
├── phase-01-foundation.md             # Setup infrastructure (2-3h)
├── phase-02-admin-core-hooks.md       # Core admin hooks (3-4h)
├── phase-03-admin-secondary-hooks.md  # Secondary admin hooks (2-3h)
├── phase-04-client-hooks.md           # Client hooks (2-3h)
├── phase-05-migration.md              # Component migration (4-6h)
└── phase-06-advanced-features.md      # Optional features (2-3h)
```

---

## Implementation Phases

| Phase | Priority | Time | Status | Description |
|-------|----------|------|--------|-------------|
| 1 | P0 | 2-3h | ✅ COMPLETE | Foundation - QueryClient, query keys, DevTools |
| 2 | P0 | 3-4h | ✅ COMPLETE | Admin core hooks - auth, services, gallery, bookings (10 hooks) |
| 3 | P1 | 2-3h | ✅ COMPLETE | Admin secondary hooks - banners, contacts, etc. (30 hooks) |
| 4 | P1 | 2-3h | ✅ COMPLETE | Client hooks - services, gallery, booking (7 hooks) |
| 5 | P2 | 4-6h | ⏳ IN PROGRESS | Component migration - page by page |
| 6 | P3 | 2-3h | ⏳ Ready | Advanced features - prefetch, polling, offline |

**Total**: 15-22 hours | **Completed**: 10-13h | **Remaining**: 6-9h

---

## Key Decisions

### ✅ Hybrid Architecture
- **Shared**: Query keys, QueryClient configs
- **App-specific**: Query/mutation hooks

### ✅ Native Fetch
- Keep existing apiClient
- React Query wraps service layer

### ✅ Incremental Migration
- Page-by-page migration
- Keep service layer as backup
- Zero breaking changes to UI

---

## File Changes

### New Files (17)
- 1 query key factory (shared)
- 2 QueryClient configs (admin + client)
- 10 admin hook files
- 4 client hook files

### Modified Files (5)
- 2 main.tsx (QueryClientProvider)
- 2 package.json (DevTools)
- 1 shared utils export

### Deprecated Later (10+)
- Service layer files (after migration complete)

---

## Phase 1 Success Criteria ✅ ALL MET

- [x] DevTools installed and working in both apps
- [x] Query keys factory created with all resources
- [x] Admin QueryClient configured (30s stale, refetch on focus)
- [x] Client QueryClient configured (5min stale, no focus refetch)
- [x] QueryClientProvider wraps both apps
- [x] TypeScript compiles clean (all apps)
- [x] Both apps run successfully
- [x] DevTools hidden in production builds

## Full Project Success Criteria (All Phases)

- ⏳ All CRUD operations use hooks (Phase 2-5)
- ⏳ Automatic cache management (Phase 2-5)
- ⏳ Optimistic updates for toggles (Phase 2-3)
- ⏳ Zero UI breaking changes (Phase 5)
- ⏳ Bundle size < +15kb (Phase 2+)
- ⏳ Service layer deprecation (Phase 5+)

---

## Getting Started

```bash
# 1. Review plan
cat plan.md

# 2. Start Phase 1
cat phase-01-foundation.md

# 3. Install DevTools
npm install -D @tanstack/react-query-devtools@^5.90.11

# 4. Create query keys
# Follow phase-01-foundation.md tasks

# 5. Test in DevTools
npm run dev
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Component Layer (UI)                   │
│  - Uses hooks for data                  │
│  - Declarative loading/error states     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  React Query Hooks Layer                │
│  - useServices, useGallery, etc.        │
│  - Cache management                     │
│  - Mutations + invalidation             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Service Layer (existing)               │
│  - ServicesService, GalleryService      │
│  - Business logic                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  API Client Layer (existing)            │
│  - apiClient with JWT refresh           │
│  - Error handling                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  REST API (NestJS)                      │
└─────────────────────────────────────────┘
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking changes | Page-by-page migration + keep services |
| Cache bugs | Conservative invalidation + testing |
| Performance issues | Monitor DevTools + bundle size |
| Type errors | Strict TypeScript + test per hook |

---

## Next Steps

1. ✅ Phase 1 completed (2026-01-01) - Foundation
2. ✅ Phase 2 completed (2026-01-01) - Admin core hooks (10 hooks)
3. ✅ Phase 3 completed (2026-01-01) - Admin secondary hooks (30 hooks)
4. ✅ Phase 4 completed (2026-01-01) - Client hooks (7 hooks)
5. ⏳ Start Phase 5 - Component Migration
   - Read `phase-05-migration.md`
   - Migrate admin pages incrementally (Services, Gallery, Bookings, etc.)
   - Migrate client pages incrementally
   - Replace service layer calls with hooks
6. ⏳ Test Phase 5 with DevTools
7. ⏳ Proceed to Phase 6 - Advanced Features
8. ⏳ Document lessons learned

---

## Questions?

See `plan.md` section "Questions for Resolution" for unresolved decisions.

---

**Phases 1-4 Complete!**

✅ All hook creation phases complete. 47 total hooks created across 12 files.
- Phase 1: Foundation (QueryClient, query keys, DevTools)
- Phase 2: Admin core hooks (10 hooks - auth, services, gallery, bookings)
- Phase 3: Admin secondary hooks (30 hooks - banners, contacts, business info, hero, upload)
- Phase 4: Client hooks (7 hooks - services, gallery, booking)

Proceed to Phase 5 - Start with `phase-05-migration.md`.

For completion reports:
- Phase 1: See `PHASE-1-COMPLETION-REPORT.md`
- Phase 4: See `PHASE-4-COMPLETION-REPORT.md`
- Overall plan: See `plan.md`
