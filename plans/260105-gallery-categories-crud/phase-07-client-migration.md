# Phase 7: Client App Migration

## 🎯 Goal
Migrate client app from hardcoded categories to API-driven categories with Vietnamese labels.

## 📦 Tasks

### 7.1 Create Client Gallery Categories Hook

**File**: `apps/client/src/hooks/useGalleryCategories.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import type { GalleryCategoryItem } from "@repo/types/gallery-category";
import type { PaginationResponse } from "@repo/types/pagination";
import { apiClient } from "@/lib/apiClient";

// Vietnamese label mapping (client-side only)
const VIETNAMESE_LABELS: Record<string, string> = {
  "all": "Tất Cả",
  "manicure": "Làm Móng Tay",
  "pedicure": "Làm Móng Chân",
  "nail-art": "Nghệ Thuật Nail",
  "extensions": "Nối Móng",
  "seasonal": "Theo Mùa",
};

export type CategoryWithLabel = GalleryCategoryItem & {
  label: string; // Vietnamese label
};

async function fetchCategories(): Promise<
  PaginationResponse<GalleryCategoryItem>
> {
  return apiClient.get<PaginationResponse<GalleryCategoryItem>>(
    "/gallery-categories"
  );
}

export function useGalleryCategories() {
  const query = useQuery({
    queryFn: fetchCategories,
    queryKey: ["gallery-categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform categories with Vietnamese labels
  const categoriesWithLabels: CategoryWithLabel[] = (query.data?.data ?? [])
    .filter((c) => c.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({
      ...category,
      label: VIETNAMESE_LABELS[category.slug] || category.name,
    }));

  // Add "All" category
  const allCategories: CategoryWithLabel[] = [
    {
      _id: "all",
      name: "All",
      slug: "all",
      description: "",
      sortIndex: 0,
      isActive: true,
      label: "Tất Cả",
    },
    ...categoriesWithLabels,
  ];

  return {
    ...query,
    categories: allCategories,
  };
}
```

**Key Features**:
- Hardcoded Vietnamese mapping (extensible as dictionary grows)
- Filters inactive categories
- Adds "All" category for filtering
- Sorts alphabetically
- 5-minute cache (stale time)
- Fallback to English name if no Vietnamese label

### 7.2 Update Client useGalleryPage Hook

**File**: `apps/client/src/hooks/useGalleryPage.ts`

```typescript
import { useMemo, useState } from "react";
import { useGalleryItems } from "./useGalleryItems";
import { useGalleryCategories } from "./useGalleryCategories"; // NEW

export function useGalleryPage() {
  const { data: items, isLoading: isLoadingItems } = useGalleryItems();
  const { categories, isLoading: isLoadingCategories } =
    useGalleryCategories(); // NEW

  const [activeCategory, setActiveCategory] = useState("all");

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return {
    activeCategory,
    categories, // Now dynamic from API
    filteredItems,
    isLoading: isLoadingItems || isLoadingCategories,
    setActiveCategory,
  };
}
```

**Changes**:
- Remove hardcoded categories array
- Import and use `useGalleryCategories()` hook
- Categories now fetched from API with Vietnamese labels
- Combined loading state

### 7.3 Clean Up Old Data

**Remove**: `apps/client/src/data/gallery.ts`

This file contains hardcoded mock data with enum categories. No longer needed after API migration.

**Note**: If this file is still imported elsewhere, update imports before deletion.

### 7.4 Verify Client GalleryPage

**File**: `apps/client/src/pages/GalleryPage.tsx`

**Expected**: No changes needed (uses hook interface)

Verify that:
- Categories from `useGalleryPage()` are `CategoryWithLabel[]`
- Component maps over `categories` correctly
- Displays `category.label` for Vietnamese text
- Filters work with `category.slug`

## 🔑 Key Features

- **Vietnamese Labels**: Client-side mapping for localization
- **Fallback Logic**: Uses English name if no Vietnamese label
- **Type Safety**: `CategoryWithLabel` extends `GalleryCategoryItem`
- **Client-Only "All"**: Added at hook level, not from API
- **Performance**: 5-minute cache reduces API calls

## ✅ Verification

1. Type-check:
```bash
cd apps/client
npm run type-check
```

2. Visual verification:
- Client gallery page loads categories
- Vietnamese labels display correctly
- Category filtering works
- "All" category shows all items
- No hardcoded category dependencies remain

## 📁 Files Modified

- `apps/client/src/hooks/useGalleryCategories.ts` (NEW)
- `apps/client/src/hooks/useGalleryPage.ts` (UPDATED)
- `apps/client/src/data/gallery.ts` (REMOVED)

## ⏭️ Next Phase

Phase 8: Type-Check & Verification
