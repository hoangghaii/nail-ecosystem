# Phase 06a — Client: Services & Hooks Layer

**Parent:** [phase-06-client-dynamic-filters.md](./phase-06-client-dynamic-filters.md)
**Date:** 2026-02-19

---

## 1. queryKeys Update

`packages/utils/src/api/queryKeys.ts`

```typescript
gallery: {
  // ...
  list: (filters?: {
    categoryId?: string;
    nailShape?: string;   // ADD
    nailStyle?: string;   // ADD
    isActive?: boolean;
    featured?: boolean;
  }) => [...queryKeys.gallery.lists(), filters] as const,
}
```

---

## 2. useNailOptions Hook

`apps/client/src/hooks/api/useNailOptions.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";
import type { PaginationResponse } from "@repo/types/pagination";

export function useNailShapes() {
  return useQuery({
    queryKey: ['nail-shapes'],
    queryFn: () =>
      apiClient.get<PaginationResponse<NailShapeItem>>('/nail-shapes?isActive=true'),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data.sort((a, b) => a.sortIndex - b.sortIndex),
  });
}

export function useNailStyles() {
  return useQuery({
    queryKey: ['nail-styles'],
    queryFn: () =>
      apiClient.get<PaginationResponse<NailStyleItem>>('/nail-styles?isActive=true'),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data.sort((a, b) => a.sortIndex - b.sortIndex),
  });
}
```

---

## 3. GalleryService Update

`apps/client/src/services/gallery.service.ts`

Add to `GalleryQueryParams`:
```typescript
nailShape?: string;
nailStyle?: string;
```

Add to `buildQueryString()`:
```typescript
if (params.nailShape) searchParams.set('nailShape', params.nailShape);
if (params.nailStyle) searchParams.set('nailStyle', params.nailStyle);
```

---

## 4. useGalleryPage Hook Update

`apps/client/src/hooks/useGalleryPage.ts`

Add shape/style state:
```typescript
const [selectedShape, setSelectedShape] = useState<string | undefined>();
const [selectedStyle, setSelectedStyle] = useState<string | undefined>();
```

Pass to `useInfiniteGalleryItems`:
```typescript
useInfiniteGalleryItems({
  nailShape: selectedShape,
  nailStyle: selectedStyle,
  isActive: true,
  // remove categoryId — no longer used
});
```

Return from hook:
```typescript
return {
  // ...existing
  selectedShape, setSelectedShape,
  selectedStyle, setSelectedStyle,
};
```

Remove `categories`, `selectedCategory`, `setSelectedCategory`, `categoryId` from hook entirely.

---

## Todo List

- [ ] Update `queryKeys.ts` — add `nailShape`/`nailStyle` to gallery.list filter
- [ ] Create `useNailOptions.ts`
- [ ] Update `gallery.service.ts` — add params + buildQueryString
- [ ] Update `useGalleryPage.ts` — add state, update query, remove category logic
