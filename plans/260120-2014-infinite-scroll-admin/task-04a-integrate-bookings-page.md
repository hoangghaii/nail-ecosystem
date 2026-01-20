# Task 4a: Integrate BookingsPage

**Phase**: 3 - Table Integration
**Complexity**: Medium
**File**: 1 page component
**Dependencies**: Task 1, Task 2

---

## Objective

Add infinite scroll to BookingsPage (DataTable layout, high data volume).

---

## Implementation

**File**: `apps/admin/src/pages/BookingsPage.tsx`

### Change 1: Replace Hook (line 44-50)

```typescript
// BEFORE
const { data: response, isFetching } = useBookings({
  limit: 100,
  search: debouncedSearch || undefined,
  sortBy: "date",
  sortOrder: "desc",
  status: activeStatus !== "all" ? activeStatus : undefined,
});

// AFTER
const {
  data: response,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading: isFetching,
} = useInfiniteBookings({
  search: debouncedSearch || undefined,
  sortBy: "date",
  sortOrder: "desc",
  status: activeStatus !== "all" ? activeStatus : undefined,
});
```

### Change 2: Flatten Data (line 53-55)

```typescript
// BEFORE
const bookings = useMemo(() => {
  return response?.data || [];
}, [response?.data]);

// AFTER
const bookings = useMemo(() => {
  return response?.pages.flatMap((page) => page.data) ?? [];
}, [response]);
```

### Change 3: Add Infinite Scroll Trigger (after DataTable, line 252)

```typescript
            <DataTable
              columns={columns}
              data={bookings}
              onRowClick={handleRowClick}
              onRowHover={handleRowHover}
            />

            {/* Infinite Scroll Trigger */}
            <InfiniteScrollTrigger
              hasMore={!!hasNextPage}
              isLoading={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              className="mt-4"
            />
          )}
```

### Change 4: Add Imports

```typescript
import { InfiniteScrollTrigger } from "@/components/layout/shared/infinite-scroll-trigger";
import { useBookings, useInfiniteBookings } from "@/hooks/api/useBookings";
```

---

## Testing

- [ ] Initial load: 20 bookings
- [ ] Scroll: Next 20 load
- [ ] Search customer: Reset to page 1
- [ ] Filter status: Reset to page 1
- [ ] Sort by date: Works
- [ ] Hover row: Prefetch detail
- [ ] Open modal: Detail loaded instantly
- [ ] Update status: Works

---

## Success Criteria

✅ Infinite scroll functional
✅ All filters/search work
✅ Prefetch on hover preserved
✅ No regressions
