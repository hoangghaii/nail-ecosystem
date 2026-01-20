# Task 4c: Integrate BannersPage

**Phase**: 3 - Table Integration
**Complexity**: Low
**File**: 1 page component
**Dependencies**: Task 1, Task 2

---

## Objective

Add infinite scroll to BannersPage (DataTable layout, likely small dataset).

**Note**: Dataset likely <100 banners total. May skip if confirmed small.

---

## Implementation

**File**: `apps/admin/src/pages/BannersPage.tsx`

### Change 1: Replace Hook (line 67-76)

```typescript
// BEFORE
const { data, isLoading } = useBanners({
  active: bannerFilter !== "all" ? true : undefined,
  limit: 100,
  type: heroDisplayMode === "image" || heroDisplayMode === "carousel"
    ? "image"
    : heroDisplayMode === "video"
    ? "video"
    : undefined,
});

// AFTER
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteBanners({
  active: bannerFilter !== "all" ? true : undefined,
  type: heroDisplayMode === "image" || heroDisplayMode === "carousel"
    ? "image"
    : heroDisplayMode === "video"
    ? "video"
    : undefined,
});
```

### Change 2: Flatten Data (line 78)

```typescript
// BEFORE
const banners = useMemo(() => data?.data ?? [], [data]);

// AFTER
const banners = useMemo(
  () => data?.pages.flatMap((page) => page.data) ?? [],
  [data],
);
```

### Change 3: Add Infinite Scroll Trigger (after DataTable, line 289)

```typescript
          ) : (
            <>
              <DataTable columns={columns} data={banners} />

              {/* Infinite Scroll Trigger */}
              <InfiniteScrollTrigger
                hasMore={!!hasNextPage}
                isLoading={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                className="mt-4"
              />
            </>
```

### Change 4: Add Imports

```typescript
import { InfiniteScrollTrigger } from "@/components/layout/shared/infinite-scroll-trigger";
import {
  useBanners,
  useInfiniteBanners,
  useToggleBannerActive,
  useSetPrimaryBanner,
  useReorderBanners,
} from "@/hooks/api/useBanners";
```

---

## Testing

- [ ] Initial load: All banners (likely <20)
- [ ] Scroll: Works if >20 banners
- [ ] Filter active: Works
- [ ] Filter by type: Works
- [ ] Drag reorder: Works
- [ ] Toggle active: Optimistic update works
- [ ] Set primary: Works

---

## Success Criteria

✅ Infinite scroll functional
✅ All banner operations work
✅ Drag-and-drop preserved
✅ No regressions
