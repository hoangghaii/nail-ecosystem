# Phase 5: Frontend Hooks

**Duration**: 2 hours
**Risk**: Medium
**Dependencies**: Phase 4 (Service API changes)

---

## Objectives

Refactor React Query hooks to:
- Accept filter params from components
- Pass params to service layer
- Configure cache strategy (staleTime, keepPreviousData)
- Remove client-side filtering logic
- Maintain type safety

---

## File Changes

### 1. Refactor useBookings Hook

**File**: `apps/admin/src/hooks/api/useBookings.ts`

**Before** (lines 17-74):
```typescript
type BookingFilters = {
  dateFrom?: string;
  dateTo?: string;
  status?: BookingStatus;
};

export function useBookings(options?: UseBookingsOptions) {
  const { dateFrom, dateTo, status, ...queryOptions } = options || {};

  return useQuery({
    queryFn: async () => {
      if (status) {
        const items = await bookingsService.getByStatus(status);
        return { data: items, pagination: {...} }; // Client-side filter
      }
      // ... more client-side filtering
      return bookingsService.getAll();
    },
    queryKey: queryKeys.bookings.list(filters),
    ...queryOptions,
  });
}
```

**After**:
```typescript
import type { Booking, BookingStatus } from "@repo/types/booking";
import type { PaginationResponse } from "@repo/types/pagination";
import type { ApiError } from "@repo/utils/api";

import { queryKeys } from "@repo/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { bookingsService, type BookingsQueryParams } from "@/services/bookings.service";
import { storage } from "@/services/storage.service";

type UseBookingsOptions = BookingsQueryParams &
  Omit<
    UseQueryOptions<PaginationResponse<Booking>, ApiError>,
    "queryKey" | "queryFn"
  >;

/**
 * Query: Get all bookings with backend filtering
 */
export function useBookings(options?: UseBookingsOptions) {
  const {
    status,
    serviceId,
    date,
    search,
    sortBy,
    sortOrder,
    page,
    limit,
    ...queryOptions
  } = options || {};

  // Build filter object for queryKey and service call
  const filters: BookingsQueryParams | undefined =
    status || serviceId || date || search || sortBy || sortOrder || page || limit
      ? { status, serviceId, date, search, sortBy, sortOrder, page, limit }
      : undefined;

  return useQuery({
    enabled: queryOptions.enabled !== false && !!storage.get("auth_token", ""),
    queryFn: () => bookingsService.getAll(filters),
    queryKey: queryKeys.bookings.list(filters),

    // Cache configuration
    staleTime: 30_000, // Consider data fresh for 30s
    keepPreviousData: true, // Show old data while fetching new (smooth UX)

    ...queryOptions,
  });
}

// useBooking, useUpdateBooking, useUpdateBookingStatus remain unchanged
```

**Key Changes**:
1. Removed `BookingFilters` type (use `BookingsQueryParams` from service)
2. Destructure all filter params from options
3. Pass filters directly to `bookingsService.getAll(filters)`
4. Remove all client-side filtering logic
5. Add `staleTime: 30_000` (30s cache)
6. Add `keepPreviousData: true` (smooth pagination/filtering)
7. Query key includes all filter params (cache per filter combo)

---

### 2. Refactor useContacts Hook

**File**: `apps/admin/src/hooks/api/useContacts.ts`

**Before** (lines 10-25):
```typescript
export function useContacts(filters?: { status?: ContactStatus }) {
  return useQuery({
    enabled: !!storage.get("auth_token", ""),
    queryFn: async () => {
      if (filters?.status) {
        return contactsService.getByStatus(filters.status); // Client-side filter
      }
      return contactsService.getAll();
    },
    queryKey: queryKeys.contacts.list(filters),
  });
}
```

**After**:
```typescript
import { queryKeys } from "@repo/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ContactStatus } from "@/types/contact.types";

import { contactsService, type ContactsQueryParams } from "@/services/contacts.service";
import { storage } from "@/services/storage.service";

/**
 * Query: Get all contacts with backend filtering
 */
export function useContacts(filters?: ContactsQueryParams) {
  return useQuery({
    enabled: !!storage.get("auth_token", ""),
    queryFn: () => contactsService.getAll(filters),
    queryKey: queryKeys.contacts.list(filters),

    // Cache configuration
    staleTime: 30_000, // Consider data fresh for 30s
    keepPreviousData: true, // Show old data while fetching new (smooth UX)
  });
}

// useContact, useUpdateContactStatus, useUpdateContactNotes, useMarkContactAsRead remain unchanged
```

**Key Changes**:
1. Accept `ContactsQueryParams` instead of inline type
2. Pass filters directly to `contactsService.getAll(filters)`
3. Remove client-side filtering logic
4. Add `staleTime: 30_000`
5. Add `keepPreviousData: true`

---

## Cache Strategy

### staleTime: 30_000 (30 seconds)

**Behavior**:
- Data considered "fresh" for 30s after fetch
- Subsequent hook calls within 30s use cached data (no network)
- After 30s, data marked "stale" but still served
- Background refetch triggered on next mount/focus

**Why 30s**:
- Balance: Fresh enough for admin UX, reduces API calls
- User types → debounce 300ms → API call → cache 30s
- Next filter change within 30s reuses cache (instant)

### keepPreviousData: true

**Behavior**:
- When filters change, show previous results while fetching
- New data seamlessly replaces old when ready
- No loading spinner flicker between filter changes

**UX Impact**:
```
User changes status filter:
1. Previous filtered data still visible
2. isFetching = true (show subtle loading indicator)
3. New data arrives → smooth transition
4. isFetching = false
```

---

## Query Key Strategy

### Include All Filters in queryKey

```typescript
queryKey: queryKeys.bookings.list(filters)
// Result: ['bookings', 'list', { status: 'pending', search: 'john' }]
```

**Why**:
- Each filter combo = separate cache entry
- Changing status from "pending" to "confirmed" triggers new fetch
- Going back to "pending" uses cached data (if still fresh)

**Cache Entries Example**:
```typescript
['bookings', 'list', { status: 'pending' }] → cached data A
['bookings', 'list', { status: 'confirmed' }] → cached data B
['bookings', 'list', { status: 'pending', search: 'john' }] → cached data C
```

---

## Migration Notes

### Removed Client-Side Filtering

**Before**:
```typescript
queryFn: async () => {
  if (status) {
    const items = await bookingsService.getByStatus(status);
    return { data: items, pagination: {...} };
  }
  return bookingsService.getAll();
}
```

**After**:
```typescript
queryFn: () => bookingsService.getAll(filters)
```

**Impact**:
- Simpler code (~40 lines removed)
- Backend handles filtering (consistent logic)
- No "fake" pagination response construction

### Updated Type Imports

**Before**:
```typescript
type BookingFilters = { dateFrom?: string; dateTo?: string; status?: BookingStatus };
```

**After**:
```typescript
import type { BookingsQueryParams } from "@/services/bookings.service";
```

**Why**: Single source of truth for filter types

---

## Testing Checklist

### Hook Behavior
- [ ] `useBookings()` without params fetches all
- [ ] `useBookings({ status: 'pending' })` filters
- [ ] `useBookings({ search: 'john' })` searches
- [ ] `useBookings({ status: 'pending', search: 'john' })` combines filters
- [ ] Changing filters triggers refetch
- [ ] Query key includes all filter params

### Cache Behavior
- [ ] Initial fetch → network call
- [ ] Second call within 30s → cached (no network)
- [ ] After 30s → background refetch
- [ ] Filter change → new cache entry
- [ ] `keepPreviousData` shows old data while fetching

### Loading States
- [ ] `isLoading` true on initial fetch
- [ ] `isFetching` true on background refetch
- [ ] `isPreviousData` true when showing stale data

### Error Handling
- [ ] Network error handled gracefully
- [ ] Invalid filter params rejected by backend (400)
- [ ] Auth error (401) handled by apiClient

---

## React Query DevTools

### Verify Cache Entries

**Enable DevTools** (already configured):
```typescript
// In App.tsx or root
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

**Check**:
- Cache entries per filter combo
- Stale/fresh status
- Refetch triggers
- Query invalidation on mutations

---

## Next Steps

After completing this phase:
1. Verify hooks compile (TypeScript errors resolved)
2. Test in React Query DevTools (cache behavior)
3. Manual testing with network throttling (verify UX)
4. Proceed to Phase 6 (Update page components)

---

**Estimated Time**: 2 hours
**Actual Time**: ___ hours
