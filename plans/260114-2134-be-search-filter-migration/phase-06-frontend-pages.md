# Phase 6: Frontend Pages

**Duration**: 1.5 hours
**Risk**: Low
**Dependencies**: Phase 5 (Hooks API changes)

---

## Objectives

Update page components to:
- Remove `useMemo` client-side filtering
- Pass filter params directly to hooks
- Add loading states for filter changes (`isFetching`)
- Maintain existing debounce behavior
- Verify UX during filter changes

---

## File Changes

### 1. Update BookingsPage

**File**: `apps/admin/src/pages/BookingsPage.tsx`

**Remove** (lines 36-87):
```typescript
// Extract bookings array from pagination response
const bookings = useMemo(() => {
  return response?.data || [];
}, [response?.data]);

// Filter and search logic (REMOVE - backend handles this now)
const filteredBookings = useMemo(() => {
  let items = bookings;
  if (activeStatus !== "all") {
    items = items.filter((booking) => booking.status === activeStatus);
  }
  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase();
    items = items.filter((booking) =>
      booking.customerInfo.firstName.toLowerCase().includes(query) || ...
    );
  }
  return items;
}, [bookings, activeStatus, debouncedSearch]);
```

**Replace with**:
```typescript
const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
const [activeStatus, setActiveStatus] = useState<BookingStatusType | "all">("all");
const [searchQuery, setSearchQuery] = useState("");

const debouncedSearch = useDebounce(searchQuery, 300);

// Backend filtering via hook params
const { data: response, isLoading, isFetching } = useBookings({
  status: activeStatus === "all" ? undefined : activeStatus,
  search: debouncedSearch || undefined,
  sortBy: 'date',
  sortOrder: 'desc',
  limit: 1000, // Fetch all for now (no pagination UI yet)
});

// Extract bookings from response
const bookings = useMemo(() => response?.data || [], [response?.data]);

// Calculate status counts (still needed for StatusFilter badges)
const statusCounts = useMemo(() => {
  const counts: Record<BookingStatusType | "all", number> = {
    all: response?.pagination?.total || 0,
    cancelled: 0,
    completed: 0,
    confirmed: 0,
    pending: 0,
  };

  bookings.forEach((booking) => {
    if (booking.status in counts) {
      counts[booking.status as BookingStatusType]++;
    }
  });

  return counts;
}, [bookings, response?.pagination?.total]);
```

**Add Loading Indicator** (lines 214-233):
```typescript
<CardHeader>
  <div className="flex items-center justify-between">
    <div>
      <CardTitle className="flex items-center gap-2">
        Bookings
        {isFetching && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </CardTitle>
      <CardDescription>
        {bookings.length} of {response?.pagination?.total || 0} bookings
      </CardDescription>
    </div>
    {/* Search input unchanged */}
  </div>
</CardHeader>
```

**Key Changes**:
1. Remove `filteredBookings` useMemo (backend filters)
2. Pass `status` and `search` to `useBookings()` hook
3. Add `limit: 1000` (fetch-all strategy)
4. Extract `isFetching` from hook (shows background refetch)
5. Add spinner next to title when `isFetching`
6. Update count display to use pagination.total
7. Keep `statusCounts` useMemo (needed for badges)
8. Use `bookings` (not `filteredBookings`) in DataTable

---

### 2. Update ContactsPage

**File**: `apps/admin/src/pages/ContactsPage.tsx`

**Remove** (lines 34-58):
```typescript
// Filter and search contacts (REMOVE - backend handles this now)
const filteredContacts = useMemo(() => {
  let result = allContacts;
  if (statusFilter !== "all") {
    result = result.filter((contact) => contact.status === statusFilter);
  }
  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase();
    result = result.filter((contact) =>
      contact.firstName.toLowerCase().includes(query) || ...
    );
  }
  return result;
}, [allContacts, statusFilter, debouncedSearch]);
```

**Replace with**:
```typescript
const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 300);

// Backend filtering via hook params
const { data: allContacts = [], isLoading, isFetching } = useContacts({
  status: statusFilter === "all" ? undefined : statusFilter,
  search: debouncedSearch || undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  limit: 1000, // Fetch all for now
});

// Note: No more filteredContacts useMemo, use allContacts directly
```

**Update DataTable** (line 160):
```typescript
<DataTable
  columns={columns}
  data={allContacts}  // Changed from filteredContacts
  onRowClick={(contact) => setSelectedContact(contact)}
/>
```

**Add Loading Indicator** (lines 152-157):
```typescript
{/* Results Count */}
<div className="text-muted-foreground text-sm flex items-center gap-2">
  Showing {allContacts.length} messages
  {isFetching && (
    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  )}
</div>
```

**Key Changes**:
1. Remove `filteredContacts` useMemo
2. Pass `status` and `search` to `useContacts()` hook
3. Add `limit: 1000`
4. Extract `isFetching` from hook
5. Add spinner next to count when `isFetching`
6. Use `allContacts` directly in DataTable (not `filteredContacts`)

---

## Debounce Behavior (Unchanged)

Both pages already use `useDebounce(searchQuery, 300)`:

```typescript
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 300);

// Hook uses debounced value
useBookings({ search: debouncedSearch });
```

**Why Keep**:
- Prevents API call on every keystroke
- 300ms delay = balance between responsiveness and API load
- User types "john" → 1 API call (not 4)

---

## Loading States

### isLoading vs isFetching

**isLoading**: Initial fetch (no data yet)
```typescript
{isLoading ? (
  <div>Loading bookings...</div>
) : (
  <DataTable data={bookings} />
)}
```

**isFetching**: Background refetch (data exists)
```typescript
{isFetching && <Spinner />}  // Subtle indicator
<DataTable data={bookings} /> // Still shows data
```

**UX**:
- Initial load → full loading skeleton
- Filter change → small spinner, data still visible (keepPreviousData)

---

## Status Counts (Bookings Only)

**Keep `statusCounts` useMemo**:
```typescript
const statusCounts = useMemo(() => {
  const counts = { all: response?.pagination?.total || 0, ... };
  bookings.forEach((booking) => {
    counts[booking.status as BookingStatusType]++;
  });
  return counts;
}, [bookings, response?.pagination?.total]);
```

**Why Keep**:
- StatusFilter component shows badge counts
- Backend returns total count, not per-status counts
- Client-side calculation from fetched data (acceptable, small dataset)

**Future Optimization**:
- Add `/bookings/counts` endpoint for per-status counts
- Remove useMemo calculation

---

## Testing Checklist

### Filter Changes
- [ ] Status filter change → API call → data updates
- [ ] Search input → debounce 300ms → API call
- [ ] Clear search → API call → all data returns
- [ ] Combined filters work (status + search)

### Loading States
- [ ] Initial load shows `isLoading` skeleton
- [ ] Filter change shows `isFetching` spinner
- [ ] Data visible during `isFetching` (keepPreviousData)
- [ ] Spinner disappears when data loaded

### Debounce
- [ ] Type "john" → single API call after 300ms
- [ ] Type fast → debounce works (no excessive calls)
- [ ] Delete chars → debounce still applies

### Empty States
- [ ] No results after search → "No bookings found matching your filters"
- [ ] No data initially → "No bookings found"

### Status Counts (Bookings)
- [ ] Badge counts accurate after filtering
- [ ] "All" count shows total from pagination
- [ ] Individual status counts calculated correctly

---

## Network Throttling Test

### Verify UX with Slow Network

**Chrome DevTools**:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Test filter changes

**Expected Behavior**:
- Previous data visible immediately
- Spinner shows loading
- New data replaces old smoothly (no flicker)
- Debounce prevents rapid API calls

---

## Next Steps

After completing this phase:
1. Manual testing in browser (all filter combos)
2. Network throttling test (verify smooth UX)
3. Check React Query DevTools (cache entries)
4. Proceed to Phase 7 (Comprehensive testing)

---

**Estimated Time**: 1.5 hours
**Actual Time**: ___ hours
