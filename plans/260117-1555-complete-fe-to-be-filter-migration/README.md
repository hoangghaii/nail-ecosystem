# Complete Frontend-to-Backend Filter Migration

**Plan ID:** 260117-1555-complete-fe-to-be-filter-migration
**Created:** 2026-01-17 15:55
**Status:** Planning Complete
**Estimated Effort:** 8-10 hours

---

## Quick Start

### What This Plan Does

Completes migration of ALL filtering from frontend to backend across admin and client apps.

**Previous Migration (260114-2134):** Admin bookings/contacts backend filtering (85% done)
**This Migration:** Completes admin + migrates client services/gallery

### Affected Applications

- **Admin:** BookingsPage, BannersPage, GalleryItemsTab (7 files)
- **Client:** ServicesPage, GalleryPage (7 files)
- **Total:** 14 files

### Current State

| App | Component | Status | Frontend Filters |
|-----|-----------|--------|------------------|
| Admin | ContactsPage | ✅ Complete | None |
| Admin | BookingsPage | ⚠️ 85% | useMemo status + search |
| Admin | BannersPage | ❌ 0% | filter() type + active |
| Admin | GalleryItemsTab | ❌ 0% | useMemo category + search |
| Client | ServicesPage | ❌ 0% | Hardcoded data + useMemo |
| Client | GalleryPage | ❌ 0% | useMemo category |

---

## Implementation Phases

### Phase 1: Admin Complete (3-4h)
**File:** `phase-01-admin-complete-migration.md`

- BookingsPage: Remove `useMemo` filtering
- BannersPage: Remove `filter()` logic
- GalleryItemsTab: Map slug→ID, backend filtering
- Update services + hooks for all 3 components

### Phase 2: Client Services (2-3h)
**File:** `phase-02-client-services-migration.md`

- Update service layer with query params
- Update hooks to accept filters
- Remove hardcoded `servicesData`
- Migrate page to backend filtering

### Phase 3: Client Gallery (2-3h)
**File:** `phase-03-client-gallery-migration.md`

- Update service layer with query params
- Map category slug → categoryId
- Update hooks to accept filters
- Migrate page to backend filtering

### Phase 4: Quality & Docs (3h)
- Type safety verification
- Comprehensive testing
- Performance validation
- Documentation updates

---

## File Structure

```
plans/260117-1555-complete-fe-to-be-filter-migration/
├── 00-START-HERE.md (navigation)
├── README.md (this file)
├── FINAL-SCOPE.md (14 files total)
├── plan.md (original full plan)
├── phase-01-admin-complete-migration.md (UPDATED - 7 files)
├── phase-02-client-services-migration.md
├── phase-03-client-gallery-migration.md
├── testing-checklist.md
├── ACTION-ITEMS.md
├── EXECUTIVE-SUMMARY.md
└── COMPREHENSIVE-SCOPE-UPDATE.md (analysis)
```

---

## Key Decisions

### Backend Already Ready ✅
- QueryServicesDto exists
- QueryGalleryDto exists
- QueryBookingsDto exists
- Services implement filtering

### Frontend Pattern to Follow

**Reference:** `apps/admin/src/pages/ContactsPage.tsx:32-40`

```typescript
// CORRECT PATTERN
const { data: response, isFetching } = useContacts({
  search: debouncedSearch,
  sortBy: sortField,
  sortOrder: sortDirection,
  limit: 100
});

const contacts = useMemo(() => response?.data || [], [response?.data]);
// NO frontend filtering!
```

### Gallery Challenge: Slug → ID Mapping

**Problem:** Frontend uses category `slug`, backend uses `categoryId` (ObjectId)

**Solution:** Map in `useGalleryPage` hook:
```typescript
const categoryId = useMemo(() => {
  if (selectedCategory === 'all') return undefined;
  const category = categories.find(c => c.slug === selectedCategory);
  return category?._id;
}, [selectedCategory, categories]);

const { data: items = [] } = useGalleryItems({ categoryId });
```

---

## Success Criteria

- ✅ Zero `useMemo` filters in pages
- ✅ All filtering via backend APIs
- ✅ Type-check passes
- ✅ Build passes
- ✅ Loading states work
- ✅ No duplicate API calls

---

## Timeline

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: Admin | 3-4h | HIGH |
| Phase 2: Client Services | 2-3h | HIGH |
| Phase 3: Client Gallery | 2-3h | HIGH |
| Phase 4: Testing + Docs | 3h | MEDIUM |
| **Total** | **9-11h** | - |

**Target:** 2-3 working days (2026-01-19 or 2026-01-20)

---

## Dependencies

**Required:**
- ✅ Backend DTOs (done)
- ✅ Backend services (done)
- ✅ Bookings/contacts indexes (done)

**Optional:**
- ⚠️ Services/gallery indexes (can add later if needed)

---

## Related Plans

- Previous migration: `plans/260114-2134-be-search-filter-migration/`
- API docs: `docs/api-endpoints.md`
- Shared types: `docs/shared-types.md`

---

## Quick Commands

```bash
# Type check
npm run type-check

# Build
npm run build

# Test backend APIs
curl http://localhost:3000/api/services?category=manicure
curl http://localhost:3000/api/gallery?categoryId=xxx
curl http://localhost:3000/api/bookings?status=pending&search=john
```

---

## Files to Change

### Admin (7 files)
- `apps/admin/src/pages/BookingsPage.tsx`
- `apps/admin/src/pages/BannersPage.tsx`
- `apps/admin/src/components/gallery/gallery-items-tab.tsx`
- `apps/admin/src/services/banners.service.ts`
- `apps/admin/src/services/gallery.service.ts`
- `apps/admin/src/hooks/api/useBanners.ts`
- `apps/admin/src/hooks/api/useGallery.ts`

### Client (7 files)
- `apps/client/src/hooks/useServicesPage.ts`
- `apps/client/src/hooks/useGalleryPage.ts`
- `apps/client/src/services/services.service.ts`
- `apps/client/src/services/gallery.service.ts`
- `apps/client/src/hooks/api/useServices.ts`
- `apps/client/src/hooks/api/useGallery.ts`
- `apps/client/src/data/services.ts` (DELETE)

**Total:** 14 files

---

**Created By:** Planning Skill (Orchestrator)
**Last Updated:** 2026-01-17 16:30 (Comprehensive scope update)
