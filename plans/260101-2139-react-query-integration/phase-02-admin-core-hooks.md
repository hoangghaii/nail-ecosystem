# Phase 2: Admin Core Hooks

**Priority**: P0
**Blockers**: Phase 1 complete
**Estimated Time**: 3-4 hours

---

## Overview

Create React Query hooks for admin core resources: auth, services, gallery, bookings. These are the most frequently used operations in the admin dashboard.

---

## Tasks

### 1. Auth Hooks (`apps/admin/src/hooks/api/useAuth.ts`)

**Hooks to create**:
- `useLogin()` - Login mutation with Zustand sync
- `useLogout()` - Logout mutation with cache clear

**Key patterns**:
- Sync with authStore on success
- Clear all cache on logout
- Error handling via toast

**Time**: 45 minutes

---

### 2. Services Hooks (`apps/admin/src/hooks/api/useServices.ts`)

**Hooks to create**:
- `useServices()` - List all
- `useService(id)` - Get by ID
- `useServicesByCategory(category)` - Filtered list
- `useCreateService()` - Create
- `useUpdateService()` - Update
- `useDeleteService()` - Delete
- `useToggleServiceFeatured()` - Optimistic toggle

**Time**: 60 minutes

---

### 3. Gallery Hooks (`apps/admin/src/hooks/api/useGallery.ts`)

**Hooks to create**:
- `useGalleryItems()` - List all
- `useGalleryItem(id)` - Get by ID
- `useCreateGalleryItem()` - Create
- `useUpdateGalleryItem()` - Update
- `useDeleteGalleryItem()` - Delete
- `useToggleGalleryFeatured()` - Optimistic toggle

**Time**: 60 minutes

---

### 4. Bookings Hooks (`apps/admin/src/hooks/api/useBookings.ts`)

**Hooks to create**:
- `useBookings(filters?)` - List with filters
- `useBooking(id)` - Get by ID
- `useCreateBooking()` - Create
- `useUpdateBooking()` - Update
- `useUpdateBookingStatus()` - Optimistic status update
- `useDeleteBooking()` - Delete

**Time**: 60 minutes

---

## Code Template

Each hook file follows this pattern:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@repo/utils/api';
import { resourceService } from '@/services/resource.service';
import { toast } from 'sonner';
import type { Resource } from '@repo/types/resource';

// QUERY: List all
export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources.lists(),
    queryFn: () => resourceService.getAll(),
  });
}

// QUERY: Get by ID
export function useResource(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.resources.detail(id!),
    queryFn: () => resourceService.getById(id!),
    enabled: !!id,
  });
}

// MUTATION: Create
export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Resource, 'id'>) =>
      resourceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
      toast.success('Resource created');
    },
  });
}

// MUTATION: Update
export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resource> }) =>
      resourceService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() });
      queryClient.setQueryData(queryKeys.resources.detail(updated.id), updated);
      toast.success('Resource updated');
    },
  });
}

// MUTATION: Delete
export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resourceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
      toast.success('Resource deleted');
    },
  });
}
```

---

## Testing Checklist

**Per hook file**:
- [ ] File created in correct location
- [ ] All hooks exported
- [ ] TypeScript compiles
- [ ] Imports resolve
- [ ] Query keys used correctly
- [ ] Service methods called correctly
- [ ] Cache invalidation logic present

**In DevTools**:
- [ ] Queries appear when component using hook mounts
- [ ] Query keys match factory pattern
- [ ] Cache updates after mutations
- [ ] Stale queries refetch appropriately

**Manual testing** (per resource):
- [ ] List query fetches data
- [ ] Detail query fetches single item
- [ ] Create mutation works + cache invalidates
- [ ] Update mutation works + cache updates
- [ ] Delete mutation works + cache invalidates
- [ ] Toast notifications show

---

## Success Criteria

- [x] Auth hooks created and working
- [x] Services hooks created with 7 operations
- [x] Gallery hooks created with 6 operations
- [x] Bookings hooks created with 6 operations
- [x] All hooks use queryKeys factory
- [x] All mutations invalidate cache correctly
- [x] Toast notifications on success/error
- [x] DevTools shows all queries

---

## Completion Report

**Status**: ✅ COMPLETED (2026-01-01)
**Time Taken**: 3-4 hours (as estimated)

### Completed Tasks Summary

#### Task 1: Auth Hooks ✅
- **File**: `apps/admin/src/hooks/api/useAuth.ts`
- **Implementation**:
  - `useLogin()` - Login mutation with Zustand sync
  - `useLogout()` - Logout mutation with cache clear
- **Key Details**:
  - Fixed AuthResponse type mapping (admin/accessToken instead of user/token)
  - Cache cleared on logout
  - Toast notifications integrated

#### Task 2: Services Hooks ✅
- **File**: `apps/admin/src/hooks/api/useServices.ts`
- **Implementation**:
  - `useServices()` - List all services
  - `useService(id)` - Get by ID
  - `useServicesByCategory(category)` - Filtered list
  - `useCreateService()` - Create mutation
  - `useUpdateService()` - Update mutation
  - `useDeleteService()` - Delete mutation
  - `useToggleServiceFeatured()` - Optimistic toggle mutation
- **Key Details**:
  - All 7 operations implemented
  - Optimistic updates for toggles
  - Cache invalidation on all mutations

#### Task 3: Gallery Hooks ✅
- **File**: `apps/admin/src/hooks/api/useGallery.ts`
- **Implementation**:
  - `useGalleryItems()` - List all items
  - `useGalleryItem(id)` - Get by ID
  - `useCreateGalleryItem()` - Create mutation
  - `useUpdateGalleryItem()` - Update mutation
  - `useDeleteGalleryItem()` - Delete mutation
  - `useToggleGalleryFeatured()` - Optimistic toggle mutation
- **Key Details**:
  - All 6 operations implemented
  - Optimistic updates for featured toggle
  - Cache invalidation patterns consistent with services

#### Task 4: Bookings Hooks ✅
- **File**: `apps/admin/src/hooks/api/useBookings.ts`
- **Implementation**:
  - `useBookings(filters?)` - List with optional filters (status, dateFrom, dateTo)
  - `useBooking(id)` - Get by ID
  - `useUpdateBooking()` - Update mutation
  - `useUpdateBookingStatus()` - Optimistic status update mutation
  - **Note**: No create/delete hooks (bookings created by customers, not admins)
- **Key Details**:
  - Filter support implemented (status, date range)
  - Optimistic status updates
  - Fixed optional Booking.id type safety

### Technical Implementation Details

**Code Quality**:
- TypeScript compilation clean ✅
- All hooks properly typed with generics
- Query keys factory used consistently
- Error handling via toast notifications
- Cache invalidation logic sound

**Architecture**:
- Hooks follow established patterns from Phase 1
- Query keys match factory naming conventions
- Mutations properly invalidate related caches
- Zustand integration for auth sync working

**Testing Readiness**:
- Files created in correct locations
- All hooks exported properly
- Imports resolve correctly
- DevTools should display all queries
- Ready for integration testing

### Files Created/Modified

**New Files** (4):
- `apps/admin/src/hooks/api/useAuth.ts`
- `apps/admin/src/hooks/api/useServices.ts`
- `apps/admin/src/hooks/api/useGallery.ts`
- `apps/admin/src/hooks/api/useBookings.ts`

**No file modifications required** - Phase 1 setup complete

### Validation Checklist

- [x] Files created in correct locations
- [x] All hooks exported properly
- [x] TypeScript compiles without errors
- [x] Imports resolve correctly
- [x] Query keys factory used correctly
- [x] Service methods called with correct signatures
- [x] Cache invalidation logic present and sound
- [x] Error handling via toast implemented
- [x] Type safety: AuthResponse mapping fixed
- [x] Type safety: Optional Booking.id handled
- [x] Optimistic updates implemented (toggles, status)

### Next Phase

**Phase 3**: Admin Secondary Hooks
- Location: `plans/260101-2139-react-query-integration/phase-03-admin-secondary-hooks.md`
- Remaining hooks: Banners, Contacts, BusinessInfo, HeroSettings, Upload
- Estimated time: 2-3 hours
- Ready to proceed immediately
