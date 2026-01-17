# Phase 1: Admin Complete Migration

**Estimated Effort:** 3-4 hours (NOT 30 min!)
**Status:** Comprehensive Scope
**Priority:** HIGH

---

## Overview

Complete migration of ALL admin filtering to backend: Bookings, Banners, and Gallery.

**Files:** 7 (3 pages/components + 2 services + 2 hooks)
**Backend:** All DTOs ready

---

## Part A: Services Layer (1 hour)

### Step 1: Update Banners Service (20 min)

**File:** `apps/admin/src/services/banners.service.ts`

**Add Query Params Interface:**
```typescript
export interface BannersQueryParams {
  type?: 'image' | 'video';
  isPrimary?: boolean;
  active?: boolean;
  page?: number;
  limit?: number;
}

export class BannersService {
  async getAll(params?: BannersQueryParams): Promise<PaginationResponse<Banner>> {
    const queryString = this.buildQueryString(params);
    return apiClient.get<PaginationResponse<Banner>>(`/banners${queryString}`);
  }

  private buildQueryString(params?: BannersQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set('type', params.type);
    if (params.isPrimary !== undefined) searchParams.set('isPrimary', String(params.isPrimary));
    if (params.active !== undefined) searchParams.set('active', String(params.active));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  // ... rest of methods unchanged
}
```

### Step 2: Update Gallery Service (20 min)

**File:** `apps/admin/src/services/gallery.service.ts`

**Add Query Params Interface:**
```typescript
export interface GalleryQueryParams {
  categoryId?: string;
  search?: string; // For future backend support
  featured?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export class GalleryService {
  async getAll(params?: GalleryQueryParams): Promise<PaginationResponse<GalleryItem>> {
    const queryString = this.buildQueryString(params);
    return apiClient.get<PaginationResponse<GalleryItem>>(`/gallery${queryString}`);
  }

  private buildQueryString(params?: GalleryQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    // Note: search not yet supported by backend - will filter in component
    if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
    if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  // ... rest unchanged
}
```

### Step 3: Test Services (20 min)

```bash
# Type check
npm run type-check

# Build
npm run build

# Test API calls (optional)
# curl http://localhost:3000/api/banners?type=image&active=true
# curl http://localhost:3000/api/gallery?categoryId=xxx
```

---

## Part B: Hooks Layer (45 min)

### Step 4: Update useBanners Hook (20 min)

**File:** `apps/admin/src/hooks/api/useBanners.ts`

**Update Hook:**
```typescript
import type { BannersQueryParams } from '@/services/banners.service';

export function useBanners(
  params?: BannersQueryParams & Omit<UseQueryOptions<PaginationResponse<Banner>, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const { type, isPrimary, active, page, limit, ...queryOptions } = params || {};

  const filters: BannersQueryParams | undefined =
    type || isPrimary !== undefined || active !== undefined || page || limit
      ? { type, isPrimary, active, page, limit }
      : undefined;

  return useQuery({
    enabled: queryOptions?.enabled !== false && !!storage.get('auth_token', ''),
    queryFn: () => bannersService.getAll(filters),
    queryKey: queryKeys.banners.list(filters),
    staleTime: 30_000,
    ...queryOptions,
  });
}
```

### Step 5: Update useGalleryItems Hook (20 min)

**File:** `apps/admin/src/hooks/api/useGallery.ts`

**Update Hook:**
```typescript
import type { GalleryQueryParams } from '@/services/gallery.service';

export function useGalleryItems(params?: GalleryQueryParams) {
  return useQuery({
    enabled: !!storage.get('auth_token', ''),
    queryFn: () => galleryService.getAll(params),
    queryKey: queryKeys.gallery.list(params),
    staleTime: 30_000,
  });
}
```

### Step 6: Verify Query Keys (5 min)

Ensure `queryKeys` in `@repo/utils/api` supports params:
```typescript
// Should look like:
queryKeys.banners.list({ type, active })
queryKeys.gallery.list({ categoryId })
```

---

## Part C: Pages/Components (1.5-2 hours)

### Step 7: Update BookingsPage (30 min)

**File:** `apps/admin/src/pages/BookingsPage.tsx`

**Changes:**

1. Update useBookings call (lines ~32):
```typescript
// BEFORE
const { data: response, isLoading } = useBookings();

// AFTER
const { data: response, isLoading, isFetching } = useBookings({
  status: activeStatus !== 'all' ? activeStatus : undefined,
  search: debouncedSearch,
  limit: 100,
});
```

2. Keep bookings extraction (already correct):
```typescript
const bookings = useMemo(() => response?.data || [], [response?.data]);
```

3. **DELETE** useMemo filtering (lines 66-87):
```typescript
// DELETE THIS ENTIRE BLOCK:
const filteredBookings = useMemo(() => {
  let items = bookings;
  if (activeStatus !== 'all') { /* ... */ }
  if (debouncedSearch) { /* ... */ }
  return items;
}, [bookings, activeStatus, debouncedSearch]);
```

4. **REPLACE** with:
```typescript
// Data already filtered by backend
const filteredBookings = bookings;
```

5. **OPTIONAL:** Simplify status counts or remove
```typescript
// Option A: Remove counts entirely
// Option B: Show current filter count
const statusCounts = useMemo(() => ({
  all: response?.pagination.total || 0,
  pending: activeStatus === 'pending' ? bookings.length : 0,
  confirmed: activeStatus === 'confirmed' ? bookings.length : 0,
  completed: activeStatus === 'completed' ? bookings.length : 0,
  cancelled: activeStatus === 'cancelled' ? bookings.length : 0,
}), [response, activeStatus, bookings]);
```

### Step 8: Update BannersPage (30 min)

**File:** `apps/admin/src/pages/BannersPage.tsx`

**Changes:**

1. Update useBanners call (line ~54):
```typescript
// BEFORE
const { data, isLoading } = useBanners();

// AFTER
const { data, isLoading, isFetching } = useBanners({
  type: heroDisplayMode === 'video' ? 'video' : 'image',
  active: bannerFilter === 'active' ? true : undefined,
});
```

2. Update banners extraction (line ~55):
```typescript
// Already filtered by backend
const banners = useMemo(() => data?.data ?? [], [data]);
```

3. **DELETE** filter logic (lines 114-130):
```typescript
// DELETE THIS ENTIRE BLOCK:
const filteredBanners = banners.filter((banner) => {
  let heroModeMatch = false;
  if (heroDisplayMode === 'image' || heroDisplayMode === 'carousel') {
    heroModeMatch = banner.type === 'image';
  } else if (heroDisplayMode === 'video') {
    heroModeMatch = banner.type === 'video';
  }
  const userFilterMatch = bannerFilter === 'all' ? true : banner.active;
  return heroModeMatch && userFilterMatch;
});
```

4. **REPLACE** with:
```typescript
// Data already filtered by backend
const filteredBanners = banners;
```

5. Add loading indicator (optional):
```typescript
{isFetching && <LoadingSpinner />}
```

### Step 9: Update GalleryItemsTab (45 min)

**File:** `apps/admin/src/components/gallery/gallery-items-tab.tsx`

**Changes:**

1. Map category slug to ID (add after line ~53):
```typescript
// Map selected category slug to categoryId
const categoryId = useMemo(() => {
  if (activeCategory === 'all') return undefined;
  const category = categories.find((c) => c.slug === activeCategory);
  return category?._id;
}, [activeCategory, categories]);
```

2. Update useGalleryItems call (line ~54):
```typescript
// BEFORE
const { data, isLoading } = useGalleryItems();

// AFTER
const { data, isLoading, isFetching } = useGalleryItems({
  categoryId,
  // Note: search not in backend yet - will filter in FE below
});
```

3. Update items extraction (line ~55):
```typescript
const galleryItems = useMemo(() => data?.data ?? [], [data]);
```

4. **UPDATE** filter logic (lines 78-98) - KEEP search, remove category:
```typescript
// BEFORE: Filtered by category AND search
const filteredItems = useMemo(() => {
  let items = galleryItems;

  // Filter by category
  if (activeCategory !== 'all') {
    items = items.filter((item) => item.category === activeCategory);
  }

  // Filter by search
  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase();
    items = items.filter(/* ... */);
  }

  return items;
}, [galleryItems, activeCategory, debouncedSearch]);

// AFTER: Filter by search only (category handled by backend)
const filteredItems = useMemo(() => {
  let items = galleryItems;

  // Category already filtered by backend
  // Only filter by search (not yet in backend)
  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query),
    );
  }

  return items;
}, [galleryItems, debouncedSearch]);
```

5. **UPDATE** category counts (lines 101-110) - Use filtered data:
```typescript
const categoryCounts = useMemo(() => {
  // Use data from API (already filtered) for current category
  const counts: Record<string, number> = {
    all: data?.pagination.total || 0, // Total across all categories
  };

  // For specific categories, show current count if selected
  categories.forEach((cat) => {
    if (activeCategory === cat.slug) {
      counts[cat.slug] = galleryItems.length;
    } else {
      counts[cat.slug] = 0; // Unknown without fetching
    }
  });

  return counts;
}, [data, galleryItems, categories, activeCategory]);
```

**Alternative (Simpler):** Remove counts, just show current results

---

## Testing Checklist

### Type Check & Build
```bash
npm run type-check
npm run build
```

### BookingsPage
- [ ] Navigate to `/admin/bookings`
- [ ] Test "All" status shows all bookings
- [ ] Test "Pending" shows only pending
- [ ] Test "Confirmed" shows only confirmed
- [ ] Test "Completed" shows only completed
- [ ] Test "Cancelled" shows only cancelled
- [ ] Test search by name
- [ ] Test search by email
- [ ] Test search by phone
- [ ] Test combined status + search
- [ ] Verify loading state
- [ ] Verify empty state

### BannersPage
- [ ] Navigate to `/admin/banners`
- [ ] Change hero mode to "Image" - shows image banners
- [ ] Change hero mode to "Video" - shows video banners
- [ ] Change hero mode to "Carousel" - shows image banners
- [ ] Test "All Banners" filter
- [ ] Test "Active Only" filter
- [ ] Verify loading state
- [ ] Verify empty state

### GalleryItemsTab
- [ ] Navigate to `/admin/gallery`
- [ ] Test "All" category shows all items
- [ ] Test each category filter
- [ ] Test search by title
- [ ] Test search by description
- [ ] Test combined category + search
- [ ] Verify loading state
- [ ] Verify empty state

### Network Validation
- [ ] Check DevTools Network tab
- [ ] Verify correct query params in URLs
- [ ] Verify no duplicate API calls
- [ ] Verify React Query cache working

---

## Success Criteria

- [ ] Zero useMemo filtering in BookingsPage
- [ ] Zero filter() logic in BannersPage
- [ ] Category filtering in backend for GalleryItemsTab
- [ ] Search still works in GalleryItemsTab (FE for now)
- [ ] Type-check passes
- [ ] Build passes
- [ ] All manual tests pass
- [ ] Loading states display
- [ ] No duplicate API calls

---

## Rollback

```bash
# BookingsPage
git checkout HEAD~1 -- apps/admin/src/pages/BookingsPage.tsx

# BannersPage
git checkout HEAD~1 -- apps/admin/src/pages/BannersPage.tsx

# GalleryItemsTab
git checkout HEAD~1 -- apps/admin/src/components/gallery/gallery-items-tab.tsx

# Services + Hooks
git checkout HEAD~1 -- apps/admin/src/services/
git checkout HEAD~1 -- apps/admin/src/hooks/api/
```

---

**Phase Owner:** Backend/Frontend Developer
**Dependencies:** Backend DTOs (ready)
**Effort:** 3-4 hours
