# Phase 3: Client Gallery Migration

**Estimated Effort:** 2-3 hours
**Status:** Not Started
**Priority:** HIGH

---

## Overview

Migrate client GalleryPage from frontend filtering to backend filtering.

**Current:** Frontend category filtering with `useMemo`
**Target:** Backend API filtering via categoryId parameter

---

## Current State

### Files Affected
- `apps/client/src/pages/GalleryPage.tsx`
- `apps/client/src/hooks/useGalleryPage.ts`
- `apps/client/src/services/gallery.service.ts`
- `apps/client/src/hooks/api/useGallery.ts`
- `apps/client/src/components/home/FeaturedGallery.tsx`

### Current Flow
```typescript
// Fetches ALL gallery items
const { data: galleryItems = [] } = useGalleryItems();

// Filters in FRONTEND
const filteredGallery = useMemo(() => {
  if (selectedCategory === 'all') return galleryItems;
  return galleryItems.filter(item => item.category === selectedCategory);
}, [galleryItems, selectedCategory]);

// getFeatured() also filters in frontend
async getFeatured(): Promise<GalleryItem[]> {
  const items = await this.getAll();
  return items.filter((item) => item.featured);
}
```

**Challenge:** Categories use `slug` (string) in frontend, `categoryId` (ObjectId) in backend.

---

## Implementation Steps

### Step 1: Backend Validation (15 min)

**Test Commands:**
```bash
# All gallery items
curl http://localhost:3000/api/gallery

# Filter by categoryId
curl http://localhost:3000/api/gallery?categoryId=67890abcdef

# Featured items
curl http://localhost:3000/api/gallery?featured=true

# Active items only
curl http://localhost:3000/api/gallery?isActive=true
```

**Get Category IDs:**
```bash
# Fetch categories to map slug -> _id
curl http://localhost:3000/api/gallery-category
```

### Step 2: Update Service Layer (45 min)

**File:** `apps/client/src/services/gallery.service.ts`

```typescript
import type { GalleryItem } from '@repo/types/gallery';
import type { PaginationResponse } from '@repo/types/pagination';
import { apiClient } from '@/lib/apiClient';

export interface GalleryQueryParams {
  categoryId?: string;
  featured?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export class GalleryService {
  async getAll(params?: GalleryQueryParams): Promise<GalleryItem[]> {
    const queryString = this.buildQueryString(params);
    const response = await apiClient.get<PaginationResponse<GalleryItem>>(
      `/gallery${queryString}`
    );
    return response.data;
  }

  async getById(id: string): Promise<GalleryItem> {
    return apiClient.get<GalleryItem>(`/gallery/${id}`);
  }

  async getFeatured(): Promise<GalleryItem[]> {
    // Use backend filtering instead of frontend
    return this.getAll({ featured: true, isActive: true });
  }

  private buildQueryString(params?: GalleryQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
    if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}

export const galleryService = new GalleryService();
```

### Step 3: Update Hook Layer (30 min)

**File:** `apps/client/src/hooks/api/useGallery.ts`

```typescript
import type { GalleryQueryParams } from '@/services/gallery.service';

import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { galleryService } from '@/services/gallery.service';

/**
 * Query: Get all gallery items with optional filters
 */
export function useGalleryItems(params?: GalleryQueryParams) {
  return useQuery({
    queryFn: () => galleryService.getAll(params),
    queryKey: queryKeys.gallery.list(params),
    staleTime: 30_000,
  });
}

/**
 * Query: Get gallery item by ID
 */
export function useGalleryItem(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => galleryService.getById(id!),
    queryKey: queryKeys.gallery.detail(id!),
  });
}

/**
 * Query: Get featured gallery items
 */
export function useFeaturedGalleryItems() {
  return useQuery({
    queryFn: () => galleryService.getFeatured(),
    queryKey: queryKeys.gallery.list({ featured: true }),
    staleTime: 30_000,
  });
}
```

### Step 4: Update Page Hook (1 hour)

**File:** `apps/client/src/hooks/useGalleryPage.ts`

**Critical:** Map category `slug` to `categoryId` for backend filtering.

```typescript
import { useMemo, useState } from 'react';
import type { GalleryItem } from '@/types';
import { useGalleryItems } from './api/useGallery';
import { useGalleryCategories } from './useGalleryCategories';

export function useGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch categories from API
  const { categories, isLoading: isLoadingCategories } = useGalleryCategories();

  // Map slug to categoryId for backend filtering
  const categoryId = useMemo(() => {
    if (selectedCategory === 'all') return undefined;

    // Find category by slug
    const category = categories.find(c => c.slug === selectedCategory);
    return category?._id;
  }, [selectedCategory, categories]);

  // Backend filtering by categoryId
  const { data: galleryItems = [], isLoading: isLoadingItems } = useGalleryItems({
    categoryId,
    isActive: true, // Only show active items to customers
  });

  // Lightbox navigation handlers
  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryItems[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryItems[prevIndex]);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return {
    categories,
    closeLightbox,
    currentIndex,
    filteredGallery: galleryItems, // Already filtered by backend
    handleImageClick,
    handleNext,
    handlePrevious,
    isLoading: isLoadingItems || isLoadingCategories,
    lightboxOpen,
    selectedCategory,
    selectedImage,
    setSelectedCategory,
  };
}
```

**DELETE:**
- Remove `useMemo` frontend filtering
- Keep lightbox navigation logic (not filter-related)

### Step 5: Update Page Component (30 min)

**File:** `apps/client/src/pages/GalleryPage.tsx`

**Verify loading state already exists** (lines 56-62). Update if needed:

```typescript
{/* Gallery Grid */}
{isLoading ? (
  <div className="py-12 text-center">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    <p className="mt-4 font-sans text-lg text-muted-foreground">
      Đang tải thư viện...
    </p>
  </div>
) : (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {filteredGallery.map((item: GalleryItem, index: number) => (
      <GalleryCard
        key={item._id}
        index={index}
        item={item}
        onImageClick={() => handleImageClick(item, index)}
      />
    ))}
  </div>
)}
```

No changes needed if already correct.

### Step 6: Update FeaturedGallery (15 min)

**File:** `apps/client/src/components/home/FeaturedGallery.tsx`

Verify it uses backend filtering:

```typescript
const { data: galleryItems = [] } = useFeaturedGalleryItems();
```

If fetching all then filtering, update to use `useFeaturedGalleryItems()`.

### Step 7: Testing (30 min)

**Type Check:**
```bash
npm run type-check
```

**Build:**
```bash
npm run build
```

**Manual Tests:**
1. Navigate to `/gallery`
2. Click "All" category - should show all active items
3. Click each category - should show filtered items
4. Verify loading state displays
5. Verify empty state if category has no items
6. Test lightbox navigation with filtered items
7. Check homepage featured gallery works
8. Verify category slugs map correctly to IDs

**API Monitoring:**
```bash
# DevTools Network tab - verify requests:
GET /api/gallery?isActive=true (for "all")
GET /api/gallery?categoryId=xxx&isActive=true (for category)
GET /api/gallery-category (fetch categories)
```

---

## Success Criteria

- [ ] No `useMemo` filtering in useGalleryPage
- [ ] Backend filtering by categoryId works
- [ ] Category slug → categoryId mapping works
- [ ] Loading state displays correctly
- [ ] Empty state displays correctly
- [ ] Lightbox navigation works with filtered items
- [ ] Featured gallery on homepage uses backend filter
- [ ] No TypeScript errors
- [ ] Build passes

---

## Rollback Plan

```bash
git checkout HEAD~1 -- apps/client/src/hooks/useGalleryPage.ts
git checkout HEAD~1 -- apps/client/src/services/gallery.service.ts
```

---

**Dependencies:** Backend API, GalleryCategory API
**Blocks:** Nothing
