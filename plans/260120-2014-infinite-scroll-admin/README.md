# Infinite Scroll Implementation Plan

**Plan Directory**: `260120-2014-infinite-scroll-admin`
**Created**: 2026-01-20
**Status**: Ready for Implementation

---

## Quick Start

Read `plan.md` first for complete overview, then follow tasks in order:

1. **Foundation** (Phase 1)
   - `task-01-create-infinite-hooks.md` - Create 4 infinite query hooks
   - `task-02-create-scroll-trigger.md` - Build InfiniteScrollTrigger component

2. **Gallery** (Phase 2)
   - `task-03-integrate-gallery-page.md` - Grid layout with infinite scroll

3. **Tables** (Phase 3)
   - `task-04a-integrate-bookings-page.md` - Bookings DataTable
   - `task-04b-integrate-contacts-page.md` - Contacts DataTable
   - `task-04c-integrate-banners-page.md` - Banners DataTable

4. **Validation** (Phase 4)
   - `task-05-testing-and-docs.md` - Testing & documentation

---

## Files Overview

```
260120-2014-infinite-scroll-admin/
├── README.md                           # This file
├── plan.md                             # Complete plan (executive summary)
├── task-01-create-infinite-hooks.md    # 4 hooks (Gallery, Bookings, Contacts, Banners)
├── task-02-create-scroll-trigger.md    # InfiniteScrollTrigger component
├── task-03-integrate-gallery-page.md   # Gallery Items Tab integration
├── task-04a-integrate-bookings-page.md # BookingsPage integration
├── task-04b-integrate-contacts-page.md # ContactsPage integration
├── task-04c-integrate-banners-page.md  # BannersPage integration
└── task-05-testing-and-docs.md         # Testing checklist & docs
```

---

## Key Decisions

**Pattern**: Follow existing `useInfiniteServices` (apps/admin/src/hooks/api/useServices.ts:33-55)

**Page Size**: 20 items (may increase gallery to 30-40)

**Component**: Single reusable `InfiniteScrollTrigger` with Intersection Observer + "Load More" fallback

**Priority**: Gallery (highest) → Bookings → Contacts → Banners (lowest)

---

## Critical Notes

⚠️ **Contacts API**: Verify returns `PaginationResponse<Contact>` not `Contact[]` (check backend before Task 1)

⚠️ **Gallery Images**: Test with >100 images for performance (Task 3)

⚠️ **DataTable Scroll**: May need container adjustment for Intersection Observer (Task 4)

---

## Success Metrics

- Initial load <2s (20 vs 100 items)
- Smooth scroll (no jank)
- All existing features work (search, filter, prefetch)
- Code quality: <200 LOC per file

---

## Implementation Order

**Start here**: `task-01-create-infinite-hooks.md`

Follow sequential order for dependencies. Each task is self-contained with code snippets and testing checklist.
