# Task 3: Integrate Gallery Page

**Phase**: 2 - Gallery Integration
**Complexity**: Medium
**Files**: 1 component
**Dependencies**: Task 1, Task 2

---

## Objectives

Replace gallery grid pagination with infinite scroll (highest priority - image-heavy grid layout).

---

## Implementation

**File**: `apps/admin/src/components/gallery/gallery-items-tab.tsx`

### Changes Required

#### 1. Replace Hook
```typescript
// BEFORE (line 62-66)
const { data, isLoading } = useGalleryItems({
  categoryId: activeCategory,
  limit: 100,
  search: debouncedSearch || undefined,
});

// AFTER
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteGalleryItems({
  categoryId: activeCategory,
  search: debouncedSearch || undefined,
});
```

#### 2. Flatten Data
```typescript
// BEFORE (line 68)
const galleryItems = useMemo(() => data?.data ?? [], [data]);

// AFTER
const galleryItems = useMemo(
  () => data?.pages.flatMap((page) => page.data) ?? [],
  [data],
);
```

#### 3. Add Import
```typescript
import { InfiniteScrollTrigger } from "@/components/layout/shared/infinite-scroll-trigger";
import {
  useGalleryItems,
  useInfiniteGalleryItems, // ADD
  useToggleGalleryFeatured,
} from "@/hooks/api/useGallery";
```

#### 4. Update Grid Section (line 176-260)
```typescript
// Replace closing </div> before </CardContent> with:
            </div>

            {/* Infinite Scroll Trigger */}
            <InfiniteScrollTrigger
              hasMore={!!hasNextPage}
              isLoading={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              className="mt-4"
            />
          )}
        </CardContent>
```

---

## Testing Checklist

- [ ] Initial load shows 20 items
- [ ] Scroll to bottom loads next 20
- [ ] Search resets to page 1
- [ ] Category filter resets to page 1
- [ ] Loading spinner appears during fetch
- [ ] "Load More" button works
- [ ] No more items hides trigger
- [ ] Prefetch on hover still works
- [ ] Empty state preserved
- [ ] Featured toggle works

---

## Performance Notes

- Initial: 20 images vs 100 (faster TTI)
- Progressive: Load 20 at a time
- May need larger page size (30-40) for better grid UX

---

## Success Criteria

✅ Infinite scroll functional
✅ All existing features work
✅ No performance regression
✅ Smooth scroll (no jank)
