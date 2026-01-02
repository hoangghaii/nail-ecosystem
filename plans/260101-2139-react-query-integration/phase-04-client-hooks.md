# Phase 4: Client Hooks

**Priority**: P1
**Blockers**: Phase 1 complete (can run parallel to Phase 2-3)
**Estimated Time**: 2-3 hours

---

## Overview

Create React Query hooks for client app (customer-facing). Mostly read-only queries with one mutation (booking submission).

---

## Tasks

### 1. Services Hooks (`apps/client/src/hooks/api/useServices.ts`)

**Hooks to create**:
- `useServices()` - Public service list (read-only)
- `useService(id)` - Service details (read-only)
- `useServicesByCategory(category)` - Filtered list (read-only)

**No mutations** - customers can't create/edit services

**Time**: 30 minutes

---

### 2. Gallery Hooks (`apps/client/src/hooks/api/useGallery.ts`)

**Hooks to create**:
- `useGalleryItems()` - Public gallery (read-only)
- `useGalleryItem(id)` - Gallery details (read-only)

**No mutations** - customers can't create/edit gallery

**Time**: 20 minutes

---

### 3. Booking Hook (`apps/client/src/hooks/api/useBookings.ts`)

**Hooks to create**:
- `useCreateBooking()` - Customer booking mutation

**Customer-specific considerations**:
- Error messages customer-friendly
- Success message with confirmation
- Form validation integration
- No cache invalidation needed (customer doesn't see booking list)

**Time**: 30 minutes

---

## Pattern Differences

**Client queries** (no auth required):
```typescript
export function useServices() {
  return useQuery({
    queryKey: queryKeys.services.lists(),
    queryFn: () => servicesService.getAll(),
    // No auth check - public endpoint
  });
}
```

**Client mutation** (customer-friendly):
```typescript
export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: CreateBookingDto) =>
      bookingService.create(data),
    onSuccess: () => {
      // Customer-friendly message
      toast.success('Booking submitted! We will contact you shortly.');
    },
    onError: (error: ApiError) => {
      // Customer-friendly error
      const message = error.statusCode === 409
        ? 'Time slot unavailable. Please choose another.'
        : 'Unable to submit booking. Please try again.';
      toast.error(message);
    },
  });
}
```

---

## Testing Checklist

### Services
- [x] `useServices()` fetches all services (no auth)
- [x] `useService(id)` fetches single service
- [x] `useServicesByCategory()` filters correctly
- [x] Data displays in UI correctly

### Gallery
- [x] `useGalleryItems()` fetches all gallery items
- [x] `useGalleryItem(id)` fetches single item
- [x] Images load correctly

### Booking
- [x] `useCreateBooking()` submits booking
- [x] Success message shows
- [x] Error handling customer-appropriate
- [x] Form clears on success
- [x] Loading state during submission

### DevTools
- [x] All queries visible
- [x] Cache behaves correctly (5min stale time)
- [x] No refetch on window focus (better UX)

---

## Success Criteria

- [x] Services hooks created (3 read queries)
- [x] Gallery hooks created (2 read queries)
- [x] Booking hook created (1 mutation)
- [x] All hooks tested manually
- [x] Customer-friendly error messages
- [x] Ready for component migration
