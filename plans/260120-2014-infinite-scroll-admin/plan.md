# Implementation Plan: Infinite Scroll for Admin Pages

**Plan ID**: 260120-2014-infinite-scroll-admin
**Created**: 2026-01-20
**Status**: ✅ COMPLETE (2026-01-20)
**Complexity**: Medium
**Estimated Phases**: 4
**Completion Date**: 2026-01-20
**Duration**: Same day delivery

---

## Executive Summary

Replace current 100-item limit pagination with infinite scroll across 4 admin pages (Gallery, Bookings, Contacts, Banners). Implementation leverages existing `useInfiniteServices` pattern, TanStack Query's `useInfiniteQuery`, maintains backward compatibility with search/filter features.

**Key Constraint**: Zero over-engineering - simple, maintainable solution following YAGNI/KISS/DRY.

---

## Problem Statement

**Current State**:
- Fixed `limit=100` with backend filtering
- `useInfiniteServices` hook exists but unused
- Scalability bottleneck: Cannot display >100 items
- Performance: Loading all data upfront
- UX degradation with large datasets

**Pages Affected** (Priority Order):
1. GalleryPage (Gallery Items Tab) - Grid, image-heavy ⚠️ HIGHEST
2. BookingsPage - Table, high volume
3. ContactsPage - Table, similar to bookings
4. BannersPage - Table, small dataset (lowest)

---

## Solution Architecture

### Core Components

1. **Infinite Query Hooks** (4 files)
   - Follow `useInfiniteServices` pattern
   - Initial page size: 20 items
   - Reset to page 1 on filter change

2. **InfiniteScrollTrigger Component** (1 file)
   - Intersection Observer based
   - "Load More" button fallback
   - Loading spinner

3. **Page Integration** (4 files)
   - Minimal changes: swap hook, flatten data, add trigger
   - Maintain: search, filter, prefetch, loading states

### Data Flow
```
Scroll → Observer → fetchNextPage() → API →
Append pages[] → Flatten → Render
```

---

## Implementation Phases

### ✅ Phase 1: Foundation (COMPLETE)
**Files**: 5 (4 hooks + 1 component)
**See**: `task-01-create-infinite-hooks.md`, `task-02-create-scroll-trigger.md`

✅ Created infinite query hooks + reusable component

### ✅ Phase 2: Gallery Integration (COMPLETE)
**Files**: 1 (gallery-items-tab.tsx)
**See**: `task-03-integrate-gallery-page.md`

✅ Grid layout with infinite scroll (highest value)

### ✅ Phase 3: Table Pages (COMPLETE)
**Files**: 3 (Bookings, Contacts, Banners)
**See**: `task-04-integrate-table-pages.md`

✅ DataTable integration

### ✅ Phase 4: Testing & Docs (COMPLETE)
**See**: `task-05-testing-and-docs.md`

✅ Manual testing, performance notes, README updates

---

## Technical Specs

### Hook Pattern
```typescript
export function useInfiniteX(params: Omit<XQueryParams, "page">) {
  return useInfiniteQuery({
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    queryFn: ({ pageParam }) =>
      xService.getAll({ ...params, page: pageParam, limit: 20 }),
    // ... config
  });
}
```

### Component API
```typescript
<InfiniteScrollTrigger
  hasMore={hasNextPage}
  isLoading={isFetchingNextPage}
  onLoadMore={fetchNextPage}
/>
```

### Page Usage
```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteX({ search, filters });

const items = data?.pages.flatMap(page => page.data) ?? [];
```

---

## Constraints

**Must Maintain**:
✅ Debounced search (300ms)
✅ Backend filters (status, category, sort)
✅ Prefetch on hover
✅ Loading/empty states

**Auto-Reset**: Filter change → queryKey change → clear pages, restart page 1

---

## Risk Assessment

**Low Risk**:
- TanStack Query handles complexity
- Pattern proven via useInfiniteServices
- Backend ready
- No API breaking changes

**Medium Risk**:
- Contacts API may return `Contact[]` not `PaginationResponse<Contact>` (verify)
- Gallery images (>100) may need progressive loading
- DataTable scroll container adjustments

**Mitigation**:
- Verify APIs return PaginationResponse
- Test gallery with >100 images first
- Error boundaries for failed loads
- Retry logic via TanStack Query

---

## Success Criteria

**Functional**:
- Infinite scroll works on 4 pages
- Search/filter reset correctly
- "Load More" accessible
- Prefetch preserved

**Performance**:
- Initial load <2s (20 vs 100 items)
- Smooth scroll (no jank)
- Progressive image loading

**Code Quality**:
- <200 LOC per file
- Follows patterns (keepPreviousData, prefetch)
- DRY (no duplication)

---

## Open Questions

1. **Contacts API**: Returns `Contact[]` or `PaginationResponse<Contact>`? (verify backend)
2. **Initial Page Size**: 20 items (gallery may need 30-40 for grid)?
3. **DataTable Scroll**: May need container adjustment for Intersection Observer
4. **Banners Priority**: Dataset likely <100 total - skip implementation?

---

## Task Files

1. `task-01-create-infinite-hooks.md` - Create 4 hooks
2. `task-02-create-scroll-trigger.md` - Build component
3. `task-03-integrate-gallery-page.md` - Gallery Items Tab
4. `task-04a-integrate-bookings-page.md` - Bookings page
5. `task-04b-integrate-contacts-page.md` - Contacts page
6. `task-04c-integrate-banners-page.md` - Banners page
7. `task-05-testing-and-docs.md` - Validation & docs

---

## References

- Existing: `apps/admin/src/hooks/api/useServices.ts:33-55`
- Types: `packages/types/src/pagination.ts`
- Standards: `docs/code-standards.md`
- Rules: `.claude/workflows/development-rules.md`
