# Phase 1: Admin BookingsPage Completion

**Estimated Effort:** 30 minutes
**Status:** 85% Complete (Hook ready, page needs update)
**Priority:** HIGH (blocking other work)

---

## Current State

**File:** `apps/admin/src/pages/BookingsPage.tsx`

### Problems

1. **Lines 66-87:** Frontend filtering with `useMemo`
   - Filters by `activeStatus`
   - Filters by `debouncedSearch` (name, email, phone)

2. **Lines 90-106:** Frontend status counting with `useMemo`
   - Counts bookings per status (pending, confirmed, completed, cancelled)

3. **Hook is ready** but page doesn't use backend filters
   - `useBookings()` hook already supports: `{ status, search, sortBy, sortOrder, limit }`

### Current Code Flow

```typescript
// Fetches ALL bookings from backend
const { data: response, isLoading } = useBookings();
const bookings = useMemo(() => response?.data || [], [response?.data]);

// Filters in FRONTEND (bad)
const filteredBookings = useMemo(() => {
  let items = bookings;

  // Filter by status
  if (activeStatus !== 'all') {
    items = items.filter((booking) => booking.status === activeStatus);
  }

  // Filter by search query
  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase();
    items = items.filter(
      (booking) =>
        booking.customerInfo.firstName.toLowerCase().includes(query) ||
        booking.customerInfo.lastName.toLowerCase().includes(query) ||
        booking.customerInfo.email.toLowerCase().includes(query) ||
        booking.customerInfo.phone.toLowerCase().includes(query),
    );
  }

  return items;
}, [bookings, activeStatus, debouncedSearch]);

// Counts in FRONTEND (bad)
const statusCounts = useMemo(() => {
  const counts = { all: bookings.length, /* ... */ };
  bookings.forEach((booking) => {
    if (booking.status in counts) {
      counts[booking.status]++;
    }
  });
  return counts;
}, [bookings]);
```

---

## Target State

### Target Code Flow

```typescript
// Pass filters to BACKEND
const { data: response, isFetching } = useBookings({
  status: activeStatus !== 'all' ? activeStatus : undefined,
  search: debouncedSearch,
  limit: 100, // Fetch more items per page
});

// Extract filtered data (already filtered by backend)
const bookings = useMemo(() => response?.data || [], [response?.data]);

// NO frontend filtering - data is already filtered!

// Status counts: Calculate from response or fetch separately
// Option A: Use response.pagination.total (if status filter applied)
// Option B: Fetch all statuses separately (multiple queries)
// Option C: Add count endpoint to API (future enhancement)
// RECOMMENDED: Option A (simple, YAGNI)
```

---

## Implementation Steps

### Step 1: Update useBookings Call (5 min)

**Location:** `apps/admin/src/pages/BookingsPage.tsx:32-38`

**Change:**
```typescript
// BEFORE
const { data: response, isLoading } = useBookings();

// AFTER
const { data: response, isLoading, isFetching } = useBookings({
  status: activeStatus !== 'all' ? activeStatus : undefined,
  search: debouncedSearch,
  limit: 100, // Increase limit for admin
});
```

### Step 2: Update Bookings Extraction (2 min)

**Location:** `apps/admin/src/pages/BookingsPage.tsx:36-38`

**Keep as-is** (already correct):
```typescript
const bookings = useMemo(() => {
  return response?.data || [];
}, [response?.data]);
```

### Step 3: Remove Frontend Filtering (5 min)

**Location:** `apps/admin/src/pages/BookingsPage.tsx:66-87`

**DELETE entire `useMemo` block:**
```typescript
// DELETE THIS:
const filteredBookings = useMemo(() => {
  let items = bookings;
  if (activeStatus !== 'all') {
    items = items.filter((booking) => booking.status === activeStatus);
  }
  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase();
    items = items.filter(/* ... */);
  }
  return items;
}, [bookings, activeStatus, debouncedSearch]);
```

**REPLACE with:**
```typescript
// Data is already filtered by backend - no frontend filtering needed
const filteredBookings = bookings;
```

### Step 4: Handle Status Counts (10 min)

**Location:** `apps/admin/src/pages/BookingsPage.tsx:90-106`

**Option A: Remove counts entirely (YAGNI)**
- Status filter tabs don't need counts
- Simplest solution

**Option B: Calculate from current response**
```typescript
const statusCounts = useMemo(() => {
  // If filtering by specific status, we can't know other counts
  // Show current filter count only
  return {
    all: response?.pagination.total || 0,
    pending: activeStatus === 'pending' ? bookings.length : 0,
    confirmed: activeStatus === 'confirmed' ? bookings.length : 0,
    completed: activeStatus === 'completed' ? bookings.length : 0,
    cancelled: activeStatus === 'cancelled' ? bookings.length : 0,
  };
}, [response, activeStatus, bookings]);
```

**Option C: Fetch counts separately (over-engineering)**
- Multiple API calls for each status
- Not recommended (violates YAGNI)

**RECOMMENDED:** Option A (remove counts) or Option B (show current count only)

### Step 5: Update JSX References (5 min)

**Location:** Multiple places in render

**Change:**
```typescript
// BEFORE
{filteredBookings.length} of {bookings.length} bookings

// AFTER
{bookings.length} bookings
// Or if keeping pagination:
{response?.pagination.total || 0} total bookings
```

**Loading Indicator:**
```typescript
// Add isFetching indicator if desired
{isFetching && <LoadingSpinner />}
```

### Step 6: Verify and Test (3 min)

**Type Check:**
```bash
npm run type-check
```

**Build:**
```bash
npm run build
```

**Manual Test:**
1. Start dev server: `npm run dev`
2. Navigate to `/admin/bookings`
3. Test status filter (all, pending, confirmed, completed, cancelled)
4. Test search (name, email, phone)
5. Test combined filter (status + search)
6. Verify correct data displayed
7. Verify loading states

---

## Success Criteria

- [ ] Zero `useMemo` filtering logic in BookingsPage
- [ ] `useBookings()` hook receives status + search params
- [ ] Search works correctly (backend filtering)
- [ ] Status filter works correctly (backend filtering)
- [ ] Combined filters work correctly
- [ ] No TypeScript errors
- [ ] Build passes
- [ ] Loading states display correctly
- [ ] Empty results show correct message

---

## Reference Implementation

**See:** `apps/admin/src/pages/ContactsPage.tsx`

**Correct Pattern (lines 32-40):**
```typescript
const { data: response, isFetching } = useContacts({
  search: debouncedSearch,
  sortBy: sortField,
  sortOrder: sortDirection,
  limit: 100,
});

const contacts = useMemo(() => response?.data || [], [response?.data]);
// NO frontend filtering!
```

---

## Rollback Plan

If issues occur:

```bash
# Revert to previous commit
git checkout HEAD~1 -- apps/admin/src/pages/BookingsPage.tsx

# Or manually restore useMemo filtering
```

---

## Notes

- This phase completes the previous migration's unfinished work
- Backend already supports all required filters
- Hook already supports all required params
- Only page component needs update
- Simplest phase of entire migration

---

**Phase Owner:** Backend Developer / Frontend Developer
**Dependencies:** None (backend ready)
**Blocks:** Nothing (independent)
