# 🔄 Comprehensive Scope Update

**Date:** 2026-01-17 16:20
**Status:** COMPLETE ANALYSIS DONE

---

## Full Migration Scope

### Admin App: 7 Files

#### Pages/Components (3 files)
1. **`apps/admin/src/pages/BookingsPage.tsx`**
   - Lines 66-87: useMemo filtering (status + search)
   - Backend: ✅ QueryBookingsDto ready

2. **`apps/admin/src/pages/BannersPage.tsx`**
   - Lines 114-130: filter() by heroDisplayMode (type) + active
   - Backend: ✅ QueryBannersDto has `type` + `active`

3. **`apps/admin/src/components/gallery/gallery-items-tab.tsx`**
   - Lines 78-98: useMemo filtering (category + search)
   - Lines 101-110: useMemo category counts
   - Backend: ✅ QueryGalleryDto has `categoryId` (slug→ID mapping needed)
   - Backend: ❌ NO search param (keep in FE or add to backend)

#### Services (2 files - add query params)
4. **`apps/admin/src/services/banners.service.ts`**
   - Update `getAll()` to accept query params
   - Build query string for type + active filters

5. **`apps/admin/src/services/gallery.service.ts`**
   - Update `getAll()` to accept query params
   - Build query string for categoryId + search filters

#### Hooks (2 files - add param support)
6. **`apps/admin/src/hooks/api/useBanners.ts`**
   - Update `useBanners()` to accept filter params
   - Pass params to service

7. **`apps/admin/src/hooks/api/useGallery.ts`**
   - Update `useGalleryItems()` to accept filter params
   - Pass params to service

---

### Client App: 7 Files

#### Pages/Hooks (2 files)
1. **`apps/client/src/hooks/useServicesPage.ts`**
   - Remove hardcoded `servicesData` import
   - Remove useMemo filtering
   - Use `useServices({ category })` with backend filters

2. **`apps/client/src/hooks/useGalleryPage.ts`**
   - Remove useMemo filtering
   - Map category slug → categoryId
   - Use `useGalleryItems({ categoryId })` with backend filters

#### Services (2 files - add query params)
3. **`apps/client/src/services/services.service.ts`**
   - Add `ServicesQueryParams` interface
   - Update `getAll()` to accept params
   - Build query string for category + featured + isActive

4. **`apps/client/src/services/gallery.service.ts`**
   - Add `GalleryQueryParams` interface
   - Update `getAll()` to accept params
   - Build query string for categoryId + featured + isActive
   - Update `getFeatured()` to use backend filter

#### Hooks (2 files - add param support)
5. **`apps/client/src/hooks/api/useServices.ts`**
   - Update `useServices()` to accept filter params
   - Remove `useServicesByCategory()` (redundant)

6. **`apps/client/src/hooks/api/useGallery.ts`**
   - Update `useGalleryItems()` to accept filter params
   - Ensure `useFeaturedGalleryItems()` uses backend filter

#### Data Files (1 file - DELETE)
7. **`apps/client/src/data/services.ts`**
   - DELETE entire file (hardcoded data)

---

## Updated Timeline

| Phase | Work | Files | Effort |
|-------|------|-------|--------|
| **Phase 1: Admin** | Banners, Bookings, Gallery | 7 files | **3-4h** |
| **Phase 2: Client** | Services, Gallery | 7 files | **3-4h** |
| **Phase 3: Testing** | All apps, all filters | - | **2h** |
| **Phase 4: Docs** | Update docs | - | **1h** |
| **TOTAL** | | **14 files** | **9-11h** |

---

## Detailed Breakdown

### Phase 1: Admin Migration (3-4h)

**Step 1: Services Layer (1h)**
- Update `banners.service.ts` - Add query params (20 min)
- Update `gallery.service.ts` - Add query params (20 min)
- Test service layer (20 min)

**Step 2: Hooks Layer (45 min)**
- Update `useBanners()` hook - Add param support (20 min)
- Update `useGalleryItems()` hook - Add param support (20 min)
- Verify query keys updated (5 min)

**Step 3: Pages/Components (1.5-2h)**
- **BookingsPage** (30 min)
  - Remove useMemo filters
  - Pass status + search to useBookings()
  - Test

- **BannersPage** (30 min)
  - Remove filter() logic
  - Pass type + active to useBanners()
  - Test

- **GalleryItemsTab** (45 min)
  - Map category slug → categoryId
  - Remove useMemo filters
  - Pass categoryId to useGalleryItems()
  - DECISION: Keep search in FE or add to backend?
  - Test

### Phase 2: Client Migration (3-4h)

**Step 1: Services Layer (1.5h)**
- Update `services.service.ts` - Add query params (40 min)
- Update `gallery.service.ts` - Add query params (40 min)
- Test service layer (10 min)

**Step 2: Hooks Layer (45 min)**
- Update `useServices()` hook - Add param support (20 min)
- Update `useGalleryItems()` hook - Add param support (20 min)
- Verify query keys (5 min)

**Step 3: Page Hooks (1-1.5h)**
- **useServicesPage** (30 min)
  - Remove hardcoded data import
  - Remove useMemo filtering
  - Use useServices({ category, isActive: true })
  - Test

- **useGalleryPage** (45 min)
  - Remove useMemo filtering
  - Map category slug → categoryId
  - Use useGalleryItems({ categoryId, isActive: true })
  - Test

**Step 4: Cleanup (15 min)**
- Delete `data/services.ts`
- Verify no imports remain
- Test

---

## Backend Requirements

### Already Ready ✅
- QueryServicesDto (category, featured, isActive, pagination)
- QueryGalleryDto (categoryId, category[deprecated], featured, isActive, pagination)
- QueryBookingsDto (status, search, sortBy, sortOrder, pagination)
- QueryBannersDto (type, isPrimary, active, pagination)

### Optional Enhancement ⚠️
**Gallery Search:**
- Current: QueryGalleryDto has NO search param
- Options:
  - A: Add `search` to QueryGalleryDto (+30 min backend work)
  - B: Keep search in frontend (YAGNI - admin gallery <100 items)

**Recommendation:** Option B (keep FE search for admin gallery)

---

## Key Technical Decisions

### 1. Gallery Category Mapping
**Challenge:** Frontend uses slug (string), backend uses categoryId (ObjectId)

**Solution:**
```typescript
const categoryId = useMemo(() => {
  if (selectedCategory === 'all') return undefined;
  const cat = categories.find(c => c.slug === selectedCategory);
  return cat?._id;
}, [selectedCategory, categories]);

const { data } = useGalleryItems({ categoryId });
```

### 2. Banners Type Filter
**Challenge:** heroDisplayMode determines banner type to show

**Solution:**
```typescript
const bannerType = heroDisplayMode === 'video' ? 'video' : 'image';
const { data } = useBanners({
  type: bannerType,
  active: bannerFilter === 'active' ? true : undefined
});
```

### 3. Services Query Params Interface
**Pattern:** Reusable across admin + client

```typescript
export interface ServicesQueryParams {
  category?: ServiceCategory;
  featured?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
```

---

## Files Changed Summary

### Admin (7 files)
**Pages/Components:**
- `apps/admin/src/pages/BookingsPage.tsx`
- `apps/admin/src/pages/BannersPage.tsx`
- `apps/admin/src/components/gallery/gallery-items-tab.tsx`

**Services:**
- `apps/admin/src/services/banners.service.ts`
- `apps/admin/src/services/gallery.service.ts`

**Hooks:**
- `apps/admin/src/hooks/api/useBanners.ts`
- `apps/admin/src/hooks/api/useGallery.ts`

### Client (7 files)
**Hooks:**
- `apps/client/src/hooks/useServicesPage.ts`
- `apps/client/src/hooks/useGalleryPage.ts`

**Services:**
- `apps/client/src/services/services.service.ts`
- `apps/client/src/services/gallery.service.ts`

**API Hooks:**
- `apps/client/src/hooks/api/useServices.ts`
- `apps/client/src/hooks/api/useGallery.ts`

**Data:**
- `apps/client/src/data/services.ts` (DELETE)

**TOTAL: 14 files** (7 admin + 7 client)

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Category slug→ID mapping breaks | HIGH | LOW | Test thoroughly, categories API stable |
| Banner type filter breaks carousel | MEDIUM | LOW | Test all heroDisplayMode values |
| Gallery search needed in backend | LOW | LOW | Keep in FE (YAGNI), add later if needed |
| Pagination response breaks client | HIGH | LOW | Extract data array in services |
| Missing loading states | MEDIUM | LOW | Reference ContactsPage pattern |

**Overall Risk:** LOW-MEDIUM

---

## Success Criteria

### Functional
- [ ] Zero useMemo/filter() in pages/components
- [ ] All filtering via backend APIs
- [ ] Correct data for all filter combinations
- [ ] Loading/empty states display correctly

### Technical
- [ ] Type-check passes (npm run type-check)
- [ ] Build passes (npm run build)
- [ ] Zero TypeScript errors
- [ ] React Query cache configured (30s stale time)
- [ ] Query keys include filter params

### Performance
- [ ] Backend queries <100ms
- [ ] No duplicate API calls
- [ ] Cache hits reduce network traffic
- [ ] Smooth filter transitions

---

## Updated Effort Estimate

**Original Plan:** 8-10 hours
**Corrected Plan:** 9-11 hours

**Breakdown:**
- Phase 1 (Admin): 3-4h (was 30 min!)
- Phase 2 (Client): 3-4h (unchanged)
- Phase 3 (Testing): 2h (unchanged)
- Phase 4 (Docs): 1h (unchanged)

**Target:** 2-3 working days (2026-01-19 or 2026-01-20)

---

**Analysis Complete:** 2026-01-17 16:20
**Status:** Ready for implementation
**Files to Change:** 14 (not 8 or 10!)
