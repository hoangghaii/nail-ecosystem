# ⚠️ CORRECTION: Admin Scope Expanded

**Date:** 2026-01-17 16:10
**Issue:** Initial plan missed 2 admin components with frontend filtering

---

## Corrected Admin Scope

### Original Plan (INCOMPLETE ❌)
- Admin BookingsPage only (1 file)

### Corrected Plan (COMPLETE ✅)
1. **BookingsPage** - `useMemo` status + search filtering
2. **BannersPage** (MISSED!) - `filter()` by heroDisplayMode + active
3. **GalleryItemsTab** (MISSED!) - `useMemo` category + search filtering

**Total Admin Files:** 3 (not 1!)

---

## Details

### 1. BookingsPage ✅ (Already Covered)
**File:** `apps/admin/src/pages/BookingsPage.tsx`
**Lines:** 66-87
**Filters:** Status + search (name/email/phone)
**Backend Ready:** ✅ QueryBookingsDto exists

### 2. BannersPage ❌ (MISSED)
**File:** `apps/admin/src/pages/BannersPage.tsx`
**Lines:** 114-130

**Current Code:**
```typescript
const filteredBanners = banners.filter((banner) => {
  let heroModeMatch = false;

  if (heroDisplayMode === "image" || heroDisplayMode === "carousel") {
    heroModeMatch = banner.type === "image";
  } else if (heroDisplayMode === "video") {
    heroModeMatch = banner.type === "video";
  }

  const userFilterMatch = bannerFilter === "all" ? true : banner.active;

  return heroModeMatch && userFilterMatch;
});
```

**Filters:**
- `type` (image/video based on heroDisplayMode)
- `active` (all/active only)

**Backend Ready:** ✅ QueryBannersDto has `type` + `active` params

**Migration:**
```typescript
// BEFORE
const { data } = useBanners();
const filteredBanners = banners.filter(/* ... */);

// AFTER
const { data } = useBanners({
  type: heroDisplayMode === "video" ? "video" : "image",
  active: bannerFilter === "active" ? true : undefined
});
```

### 3. GalleryItemsTab ❌ (MISSED)
**File:** `apps/admin/src/components/gallery/gallery-items-tab.tsx`
**Lines:** 78-98, 101-110

**Current Code:**
```typescript
const filteredItems = useMemo(() => {
  let items = galleryItems;

  if (activeCategory !== "all") {
    items = items.filter((item) => item.category === activeCategory);
  }

  if (debouncedSearch) {
    items = items.filter(/* search logic */);
  }

  return items;
}, [galleryItems, activeCategory, debouncedSearch]);

const categoryCounts = useMemo(() => {
  // Counts items per category
}, [galleryItems, categories]);
```

**Filters:**
- `category` (slug) - needs mapping to `categoryId`
- `search` (title/description)

**Backend Ready:** ✅ QueryGalleryDto has `categoryId` + pagination
**Problem:** Backend doesn't support search yet (needs adding)

**Migration:**
```typescript
// Map category slug to ID
const categoryId = useMemo(() => {
  if (activeCategory === 'all') return undefined;
  const cat = categories.find(c => c.slug === activeCategory);
  return cat?._id;
}, [activeCategory, categories]);

// Backend filtering
const { data } = useGalleryItems({
  categoryId,
  // search - TODO: Add to backend QueryGalleryDto
});
```

---

## Updated Timeline

### Phase 1: Admin Migration (Was: 30min → Now: 1.5-2h)

**Tasks:**
1. BookingsPage - Remove `useMemo` filters (30 min)
2. BannersPage - Remove `filter()`, pass to API (30 min)
3. GalleryItemsTab - Map slug→ID, backend filtering (45 min)
4. **Backend:** Add search to QueryGalleryDto (if needed) (15 min)

**Total Admin:** ~2 hours (not 30 min!)

---

## Backend Gap: Gallery Search

**Current:** QueryGalleryDto has `categoryId`, `featured`, `isActive` ✅
**Missing:** Search by title/description ❌

**Options:**

### Option A: Add Search to Backend (RECOMMENDED)
**Effort:** 15-30 min
**Files:**
- `apps/api/src/modules/gallery/dto/query-gallery.dto.ts` - Add `search` param
- `apps/api/src/modules/gallery/gallery.service.ts` - Add search logic

**Code:**
```typescript
// DTO
@ApiPropertyOptional({ description: 'Search by title or description' })
@IsOptional()
@IsString()
search?: string;

// Service
if (search) {
  const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  filter.$or = [
    { title: searchRegex },
    { description: searchRegex }
  ];
}
```

### Option B: Keep Search in Frontend (YAGNI)
**Justification:** Admin gallery likely has <100 items, search in FE is fine
**Effort:** 0 min
**Trade-off:** Inconsistent with other pages

**Recommendation:** Option B (YAGNI) - Keep gallery search in frontend for now

---

## Updated Phase Breakdown

### Phase 1: Admin (2h)
1. **BookingsPage** (30 min) - Remove useMemo, pass to API
2. **BannersPage** (30 min) - Remove filter(), pass type+active to API
3. **GalleryItemsTab** (1h) - Map slug→ID, optionally keep search in FE

### Phases 2-3: Client (4-6h) - NO CHANGE
- ServicesPage migration
- GalleryPage migration

**New Total Effort:** 10-12 hours (was 8-10h)

---

## Corrected Files Count

### Admin
- `apps/admin/src/pages/BookingsPage.tsx`
- `apps/admin/src/pages/BannersPage.tsx`
- `apps/admin/src/components/gallery/gallery-items-tab.tsx`

### Client
- 7 files (as before)

**Total:** 10 files (not 8!)

---

## Impact on Plan

**Original:** 8-10 hours
**Corrected:** 10-12 hours (+2 hours for admin)

**Risk:** Still LOW (backend ready)
**Complexity:** Slightly higher (3 admin components vs 1)

---

## Action Required

1. **Update Phase 1 docs** to include BannersPage + GalleryItemsTab
2. **Decide:** Add gallery search to backend OR keep in frontend?
3. **Update timeline** to reflect 2h admin work (not 30 min)
4. **Notify stakeholders** of scope expansion

---

**Discovered By:** User feedback
**Date:** 2026-01-17 16:10
**Status:** Plan correction in progress
