# Task 4b: Integrate ContactsPage

**Phase**: 3 - Table Integration
**Complexity**: Medium
**File**: 1 page component
**Dependencies**: Task 1, Task 2

---

## Objective

Add infinite scroll to ContactsPage (DataTable layout, similar to bookings).

---

## Implementation

**File**: `apps/admin/src/pages/ContactsPage.tsx`

### Change 1: Replace Hook (line 34-40)

```typescript
// BEFORE
const { data, isFetching } = useContacts({
  limit: 100,
  search: debouncedSearch || undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  status: statusFilter === "all" ? undefined : statusFilter,
});

// AFTER
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading: isFetching,
} = useInfiniteContacts({
  search: debouncedSearch || undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  status: statusFilter === "all" ? undefined : statusFilter,
});
```

### Change 2: Flatten Data (line 42)

```typescript
// BEFORE
const allContacts: Contact[] = (data as Contact[]) || [];

// AFTER
const allContacts: Contact[] = useMemo(
  () => data?.pages.flatMap((page) => page.data) ?? [],
  [data],
);
```

### Change 3: Add Infinite Scroll Trigger (after DataTable, line 149)

```typescript
          <DataTable
            columns={columns}
            data={allContacts}
            onRowClick={(contact) => setSelectedContact(contact)}
          />

          {/* Infinite Scroll Trigger */}
          <InfiniteScrollTrigger
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={fetchNextPage}
            className="mt-4"
          />
        </CardContent>
```

### Change 4: Add Imports

```typescript
import { useMemo, useState } from "react";
import { InfiniteScrollTrigger } from "@/components/layout/shared/infinite-scroll-trigger";
import { useContacts, useInfiniteContacts } from "@/hooks/api/useContacts";
```

---

## Testing

- [ ] Initial load: 20 contacts
- [ ] Scroll: Next 20 load
- [ ] Search: Reset to page 1
- [ ] Filter status: Reset to page 1
- [ ] Click row: Modal opens
- [ ] Update status: Works
- [ ] Admin notes: Works

---

## Success Criteria

✅ Infinite scroll functional
✅ All filters/search work
✅ Modal interactions preserved
✅ No regressions
