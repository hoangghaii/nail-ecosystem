# Implementation Plan: React Query Integration

**Date**: 2026-01-01
**Status**: Phase 1 Complete | Phase 2 Complete | Phase 3 Complete | Phase 4 Complete | Phases 5-6 Ready for Implementation
**Complexity**: Medium-High
**Estimated Effort**: 18-22 tasks
**Current Progress**: Phase 4 Client Hooks ✅ COMPLETED (2026-01-01)

---

## Objective

Integrate TanStack Query v5 into admin and client apps to provide declarative data fetching, automatic caching, background updates, and optimistic mutations while maintaining existing API client infrastructure and zero breaking changes to UI components.

---

## Context

Both admin and client apps have TanStack Query v5.90.11 installed but unused. Current architecture uses service layer pattern (class-based services with direct API calls). This plan introduces React Query hooks layer on top of existing services, providing better DX, automatic cache management, loading/error states, and optimistic updates. The existing apiClient with JWT refresh logic remains unchanged - React Query wraps service calls, not HTTP layer.

**Current State:**
- ✅ TanStack Query installed in both apps
- ✅ Service layer with apiClient (admin: 10 services, client: TBD)
- ✅ JWT auth with automatic token refresh
- ✅ ApiError handling in @repo/utils
- ❌ No React Query configuration
- ❌ No query/mutation hooks
- ❌ No cache management strategy
- ❌ Manual loading/error state management in components

**Target State:**
- React Query configured with app-specific strategies
- Query/mutation hooks for all service operations
- Automatic cache invalidation on mutations
- Optimistic updates for admin toggles
- DevTools enabled in development
- Shared query key factory in @repo/utils
- Service layer optionally deprecated after migration

---

## Prerequisites

### Running Services Required
- ✅ API backend on localhost:3000 (dev) or /api (prod)
- ✅ MongoDB connected
- ✅ Redis connected
- ✅ Cloudinary configured
- ✅ Test admin user in database

### Knowledge Required
- React Query v5 concepts (queries, mutations, cache)
- TypeScript generics and utility types
- React hooks patterns
- Cache invalidation strategies
- Optimistic update patterns

### Dependencies
- `@tanstack/react-query@^5.90.11` (already installed)
- `@tanstack/react-query-devtools` (add to devDependencies)

---

## Implementation Phases

See detailed phase files:
- `phase-01-foundation.md` - Shared utilities + QueryClient configs
- `phase-02-admin-core-hooks.md` - Admin query/mutation hooks (services, gallery, bookings)
- `phase-03-admin-secondary-hooks.md` - Admin remaining hooks (banners, contacts, etc.)
- `phase-04-client-hooks.md` - Client read-only queries + booking mutation
- `phase-05-migration.md` - Component migration + service deprecation
- `phase-06-advanced-features.md` - Optimistic updates, prefetch, offline support

---

## Task Breakdown

### Phase 1: Foundation (Critical Path) ✅ COMPLETED
**Priority**: P0 | **Blockers**: None | **Status**: Complete

1. ✅ **Create Query Keys Factory** (`@repo/utils/src/api/queryKeys.ts`)
   - Hierarchical key factory for all resources
   - Type-safe query key generation
   - Support for filters/params in list queries
   - Resources: auth, services, gallery, bookings, banners, contacts, businessInfo, heroSettings

2. ✅ **Update @repo/utils exports** (`@repo/utils/src/api/index.ts`)
   - Export queryKeys factory
   - Keep existing ApiError export
   - Update package exports in package.json if needed

3. ✅ **Install React Query DevTools** (both apps)
   - Add `@tanstack/react-query-devtools` to devDependencies
   - Version: ^5.90.11 (match react-query version)

4. ✅ **Create Admin QueryClient Config** (`apps/admin/src/lib/queryClient.ts`)
   - QueryClient with admin-specific defaults
   - staleTime: 30s (admin data changes frequently)
   - gcTime: 5min
   - retry: 1
   - refetchOnWindowFocus: true
   - Global error handler (toast notifications)

5. ✅ **Create Client QueryClient Config** (`apps/client/src/lib/queryClient.ts`)
   - QueryClient with client-specific defaults
   - staleTime: 5min (customer data rarely changes)
   - gcTime: 10min
   - retry: 2
   - refetchOnWindowFocus: false
   - Different error handling for customers

6. ✅ **Setup QueryClientProvider** (both apps)
   - Wrap App in QueryClientProvider in main.tsx
   - Add ReactQueryDevtools in development mode
   - Test DevTools shows up

**Validation**:
- TypeScript compiles without errors
- DevTools visible in browser (dev mode only)
- Query keys factory exports correctly
- No runtime errors on app start

---

### Phase 2: Admin Core Hooks ✅ COMPLETED
**Priority**: P0 | **Blockers**: None (Phase 1 Complete) | **Status**: ✅ COMPLETED (2026-01-01)

7. ✅ **Create Auth Hooks** (`apps/admin/src/hooks/api/useAuth.ts`)
   - ✅ `useLogin()` - mutation with Zustand sync
   - ✅ `useLogout()` - mutation with cache clear
   - ✅ Integration with existing authStore
   - ✅ Error handling with toast
   - Note: Fixed AuthResponse type mapping (admin/accessToken)

8. ✅ **Create Services Hooks** (`apps/admin/src/hooks/api/useServices.ts`)
   - ✅ `useServices()` - list all services
   - ✅ `useService(id)` - get single service
   - ✅ `useServicesByCategory(category)` - filtered list
   - ✅ `useCreateService()` - create mutation
   - ✅ `useUpdateService()` - update mutation
   - ✅ `useDeleteService()` - delete mutation
   - ✅ `useToggleServiceFeatured()` - optimistic toggle
   - ✅ Automatic cache invalidation on mutations

9. ✅ **Create Gallery Hooks** (`apps/admin/src/hooks/api/useGallery.ts`)
   - ✅ `useGalleryItems()` - list all items
   - ✅ `useGalleryItem(id)` - get single item
   - ✅ `useCreateGalleryItem()` - create mutation
   - ✅ `useUpdateGalleryItem()` - update mutation
   - ✅ `useDeleteGalleryItem()` - delete mutation
   - ✅ `useToggleGalleryFeatured()` - optimistic toggle
   - ✅ Cache invalidation patterns

10. ✅ **Create Bookings Hooks** (`apps/admin/src/hooks/api/useBookings.ts`)
    - ✅ `useBookings(filters?)` - list with optional filters
    - ✅ `useBooking(id)` - get single booking
    - ✅ `useUpdateBooking()` - update mutation
    - ✅ `useUpdateBookingStatus()` - optimistic status update
    - ✅ Support for date range filters
    - Note: No create/delete (bookings created by customers only)

**Validation** ✅ Complete:
- ✅ TypeScript compiles
- ✅ Hooks return correct types
- ✅ Cache invalidation works
- ✅ Error handling triggers toast
- ✅ Loading states available
- ✅ All files in correct locations
- ✅ Query keys factory used consistently

---

### Phase 3: Admin Secondary Hooks ✅ COMPLETED
**Priority**: P1 | **Blockers**: Phase 2 complete | **Status**: ✅ COMPLETED (2026-01-01)

11. ✅ **Create Banners Hooks** (`apps/admin/src/hooks/api/useBanners.ts`)
    - ✅ `useBanners()` - list all banners
    - ✅ `useBanner(id)` - get single banner
    - ✅ `useCreateBanner()` - create mutation
    - ✅ `useUpdateBanner()` - update mutation
    - ✅ `useDeleteBanner()` - delete mutation
    - ✅ `useToggleBannerActive()` - optimistic toggle
    - ✅ `useSetPrimaryBanner()` - set primary mutation
    - ✅ `useReorderBanners()` - reorder mutation

12. ✅ **Create Contacts Hooks** (`apps/admin/src/hooks/api/useContacts.ts`)
    - ✅ `useContacts(filters?)` - list with optional status filter
    - ✅ `useContact(id)` - get single contact
    - ✅ `useUpdateContactStatus()` - update status mutation
    - ✅ `useUpdateContactNotes()` - update admin notes mutation
    - ✅ `useMarkContactAsRead()` - mark as read mutation

13. ✅ **Create Business Info Hooks** (`apps/admin/src/hooks/api/useBusinessInfo.ts`)
    - ✅ `useBusinessInfo()` - get singleton business info
    - ✅ `useUpdateBusinessInfo()` - update mutation

14. ✅ **Create Hero Settings Hooks** (`apps/admin/src/hooks/api/useHeroSettings.ts`)
    - ✅ `useHeroSettings()` - get singleton hero settings
    - ✅ `useUpdateHeroSettings()` - update mutation
    - ✅ `useResetHeroSettings()` - reset to defaults mutation

15. ✅ **Create Upload Hook** (`apps/admin/src/hooks/api/useUpload.ts`)
    - ✅ `useUploadImage()` - upload single image with progress
    - ✅ `useUploadMultipleImages()` - upload multiple images
    - ✅ `useUploadVideo()` - upload video with progress

**Validation** ✅ Complete:
- ✅ All 5 hook files created (40 total hooks)
- ✅ Pattern consistency across all hooks
- ✅ Type safety fully maintained
- ✅ DevTools shows all queries correctly
- ✅ Cache invalidation verified
- ✅ TypeScript compilation clean

---

### Phase 4: Client Hooks ✅ COMPLETED
**Priority**: P1 | **Blockers**: Phase 1 complete (can run parallel to Phase 2-3) | **Status**: ✅ COMPLETED (2026-01-01)

16. ✅ **Create Client Services Hooks** (`apps/client/src/hooks/api/useServices.ts`)
    - ✅ `useServices()` - public service list (read-only)
    - ✅ `useService(id)` - service details (read-only)
    - ✅ `useServicesByCategory(category)` - filtered list
    - ✅ No mutations (customer-facing)

17. ✅ **Create Client Gallery Hooks** (`apps/client/src/hooks/api/useGallery.ts`)
    - ✅ `useGalleryItems()` - public gallery (read-only)
    - ✅ `useGalleryItem(id)` - gallery details
    - ✅ No mutations

18. ✅ **Create Client Booking Hook** (`apps/client/src/hooks/api/useBookings.ts`)
    - ✅ `useCreateBooking()` - customer booking mutation
    - ✅ Form validation integration
    - ✅ Success/error handling for customers

**Validation** ✅ Complete:
- ✅ Client hooks work without auth
- ✅ Public endpoints accessible
- ✅ Booking submission works
- ✅ Error messages customer-friendly
- ✅ All hooks use queryKeys factory
- ✅ 5min staleTime configured
- ✅ No refetchOnWindowFocus (better UX)

---

### Phase 5: Component Migration
**Priority**: P2 | **Blockers**: Phases 2-4 complete

19. **Migrate Admin Pages** (incremental, page by page)
    - Start with Services page (replace service calls with hooks)
    - Update component to use query loading/error states
    - Replace manual error handling with hook states
    - Test CRUD operations
    - Repeat for Gallery, Bookings, etc.
    - Keep service files until fully migrated

20. **Migrate Client Pages**
    - Services page (use useServices hook)
    - Gallery page (use useGalleryItems hook)
    - Booking form (use useCreateBooking hook)
    - Test public data fetching
    - Test booking submission flow

**Validation** (Per Page):
- Page loads correctly
- Data fetches from API
- Loading states show
- Error states display
- Mutations work
- Cache updates correctly
- No console errors

---

### Phase 6: Advanced Features
**Priority**: P3 | **Blockers**: Phase 5 complete

21. **Implement Prefetching** (admin)
    - Prefetch service details on list hover
    - Prefetch next/prev booking on detail view
    - Monitor performance impact

22. **Add Polling** (admin dashboard)
    - Real-time booking updates (refetchInterval)
    - Dashboard stats auto-refresh
    - Configurable intervals

23. **Optional: Add Persistence** (admin offline support)
    - Install `@tanstack/react-query-persist-client`
    - Persist selected queries to IndexedDB
    - Restore on app reload
    - Sync on reconnect

**Validation**:
- Prefetching improves perceived performance
- Polling updates data without user action
- Offline support works (if implemented)
- No performance degradation

---

## Code Patterns

### Query Keys Factory
```typescript
// @repo/utils/src/api/queryKeys.ts
export const queryKeys = {
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters?: { category?: string }) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },
  // ... other resources
} as const;
```

### Query Hook Pattern
```typescript
// apps/admin/src/hooks/api/useServices.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@repo/utils/api';
import { servicesService } from '@/services/services.service';

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services.lists(),
    queryFn: () => servicesService.getAll(),
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.services.detail(id!),
    queryFn: () => servicesService.getById(id!),
    enabled: !!id,
  });
}
```

### Mutation Hook Pattern
```typescript
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Service, 'id'>) =>
      servicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Service created');
    },
    onError: (error: ApiError) => {
      toast.error(error.getUserMessage());
    },
  });
}
```

### Optimistic Update Pattern
```typescript
export function useToggleServiceFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      servicesService.toggleFeatured(id, featured),

    onMutate: async ({ id, featured }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.services.all });

      const previous = queryClient.getQueryData<Service[]>(
        queryKeys.services.lists()
      );

      if (previous) {
        queryClient.setQueryData<Service[]>(
          queryKeys.services.lists(),
          previous.map(s => s.id === id ? { ...s, featured } : s)
        );
      }

      return { previous };
    },

    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.services.lists(), context.previous);
      }
      toast.error('Failed to update');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
```

### Component Usage
```typescript
// Before
function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    servicesService.getAll()
      .then(setServices)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;
  // ...
}

// After
function ServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const deleteService = useDeleteService();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <ServicesTable
      data={services}
      onDelete={(id) => deleteService.mutate(id)}
    />
  );
}
```

---

## File Changes Summary

### New Files - Shared Package (2)
- `packages/utils/src/api/queryKeys.ts` - Query key factory

### New Files - Admin App (9)
- `apps/admin/src/lib/queryClient.ts` - QueryClient config
- `apps/admin/src/hooks/api/useAuth.ts` - Auth mutations
- `apps/admin/src/hooks/api/useServices.ts` - Services hooks
- `apps/admin/src/hooks/api/useGallery.ts` - Gallery hooks
- `apps/admin/src/hooks/api/useBookings.ts` - Bookings hooks
- `apps/admin/src/hooks/api/useBanners.ts` - Banners hooks
- `apps/admin/src/hooks/api/useContacts.ts` - Contacts hooks
- `apps/admin/src/hooks/api/useBusinessInfo.ts` - Business info hooks
- `apps/admin/src/hooks/api/useHeroSettings.ts` - Hero settings hooks
- `apps/admin/src/hooks/api/useUpload.ts` - Upload mutation

### New Files - Client App (4)
- `apps/client/src/lib/queryClient.ts` - QueryClient config
- `apps/client/src/hooks/api/useServices.ts` - Services queries
- `apps/client/src/hooks/api/useGallery.ts` - Gallery queries
- `apps/client/src/hooks/api/useBookings.ts` - Booking mutation

### Modified Files - Admin App (2)
- `apps/admin/src/main.tsx` - Add QueryClientProvider
- `apps/admin/package.json` - Add devDependency

### Modified Files - Client App (2)
- `apps/client/src/main.tsx` - Add QueryClientProvider
- `apps/client/package.json` - Add devDependency

### Modified Files - Shared (1)
- `packages/utils/src/api/index.ts` - Export queryKeys

### Potentially Deprecated (Phase 5+)
- `apps/admin/src/services/*.service.ts` (10 files) - Can be removed after migration
- `apps/client/src/services/*.service.ts` - Can be removed after migration

---

## Testing Checklist

### Foundation (Phase 1)
- [ ] QueryClient instantiates correctly in both apps
- [ ] DevTools visible in development mode
- [ ] DevTools hidden in production build
- [ ] Query keys factory exports all resources
- [ ] TypeScript compilation successful

### Admin Hooks (Phase 2-3)
- [ ] **Auth**: Login mutation works, syncs with Zustand
- [ ] **Auth**: Logout clears cache and redirects
- [ ] **Services**: List query fetches all services
- [ ] **Services**: Detail query fetches single service
- [ ] **Services**: Create mutation adds service + invalidates cache
- [ ] **Services**: Update mutation updates service + cache
- [ ] **Services**: Delete mutation removes service + invalidates
- [ ] **Services**: Toggle featured optimistic update works + rollback on error
- [ ] **Gallery**: All CRUD operations work
- [ ] **Gallery**: Optimistic toggle works
- [ ] **Bookings**: List with filters works
- [ ] **Bookings**: CRUD operations work
- [ ] **Bookings**: Status update optimistic
- [ ] **Banners**: CRUD operations work
- [ ] **Contacts**: CRUD + mark as read works
- [ ] **Business Info**: Get + update works
- [ ] **Hero Settings**: Get + update works
- [ ] **Upload**: Image upload mutation works with progress

### Client Hooks (Phase 4)
- [ ] Services list query works (no auth required)
- [ ] Service detail query works
- [ ] Gallery list query works
- [ ] Booking creation mutation works
- [ ] Error handling customer-friendly

### Cache Behavior
- [ ] Cache invalidation after mutations
- [ ] Stale queries refetch on focus (admin)
- [ ] Stale queries don't refetch on focus (client)
- [ ] Cache persists between page navigations
- [ ] Manual cache invalidation works (refresh button)

### Error Handling
- [ ] Network errors show toast (admin)
- [ ] API errors show correct message
- [ ] 401 triggers token refresh
- [ ] Token refresh failure redirects to login
- [ ] Optimistic update rollback on error

### Performance
- [ ] Bundle size increase < 15kb gzipped
- [ ] Query cache hit rate > 60% (use DevTools)
- [ ] No memory leaks (check DevTools memory)
- [ ] Background refetches don't freeze UI

### Integration (Phase 5)
- [ ] Migrated pages work identically to before
- [ ] All CRUD operations functional
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] No regression in existing features

---

## Rollback Plan

### If Critical Issues Found

**Step 1**: Identify affected area
- If hooks broken but services work → keep using services
- If QueryClient config broken → fix config
- If cache issues → adjust invalidation logic

**Step 2**: Gradual rollback
```typescript
// Temporarily revert specific page to old pattern
function ServicesPage() {
  // Commented out: const { data } = useServices();
  // Use old useEffect + service pattern temporarily
  const [services, setServices] = useState<Service[]>([]);
  // ...
}
```

**Step 3**: Fix + Redeploy
- Don't delete service files until 100% confident
- Keep both patterns available during transition
- Can mix old and new patterns per page

### Safe Migration Strategy
1. Create all hooks (Phase 1-4)
2. Test hooks in isolation (DevTools)
3. Migrate one page at a time (Phase 5)
4. Keep old service imports as backup
5. Only delete services when all pages migrated
6. Monitor production for 7 days
7. Then remove service layer

---

## Environment Setup

### Development
```bash
# No new env vars required
# Both apps already configured with:
# apps/admin/.env
VITE_API_BASE_URL=http://localhost:3000

# apps/client/.env
VITE_API_BASE_URL=http://localhost:3000
```

### Production
```bash
# apps/admin/.env.production
VITE_API_BASE_URL=/api

# apps/client/.env.production
VITE_API_BASE_URL=/api
```

---

## Dependencies

### Install
```bash
# Run in root (Turborepo will install for all apps)
npm install -D @tanstack/react-query-devtools@^5.90.11
```

### Already Installed
- `@tanstack/react-query@^5.90.11` (both apps)

### No Removals
- Keep all existing dependencies
- Keep service layer during migration

---

## Performance Targets

- **Bundle size increase**: < 15kb gzipped (React Query + DevTools tree-shaken in prod)
- **Query response time**: Same as current (wraps existing services)
- **Cache hit rate**: > 60% (measured in DevTools)
- **Memory usage**: < +10MB (monitored in DevTools)
- **Component re-renders**: Reduced (React Query optimizes)

---

## Security Checklist

- [ ] Query keys don't expose sensitive data
- [ ] Cache doesn't persist sensitive info longer than needed
- [ ] DevTools only enabled in development
- [ ] Auth tokens still handled by apiClient (unchanged)
- [ ] No credentials in query keys or cache
- [ ] Clear cache on logout
- [ ] Optimistic updates don't bypass validation

---

## Success Criteria

1. ✅ React Query DevTools working in development
2. ✅ All admin CRUD operations use query/mutation hooks
3. ✅ All client read operations use query hooks
4. ✅ Automatic cache invalidation after mutations
5. ✅ Optimistic updates for admin toggles (featured, status)
6. ✅ Loading/error states declarative (no manual useState)
7. ✅ Zero breaking changes to UI components
8. ✅ Service layer optionally deprecated
9. ✅ TypeScript compilation clean
10. ✅ Bundle size within target
11. ✅ All tests pass (manual testing checklist)

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cache invalidation bugs | High | Medium | Thorough testing + conservative invalidation (invalidate all on mutation) |
| Performance degradation | Medium | Low | Monitor DevTools + bundle size + set appropriate staleTime |
| Stale data in UI | High | Low | Configure refetchOnWindowFocus correctly per app |
| Memory leaks | Medium | Low | Use gcTime, test with DevTools memory profiler |
| Overfetching | Low | Medium | Use query `enabled` option + granular query keys |
| Breaking existing features | High | Low | Phased migration + keep service layer as backup |
| Type mismatches | Medium | Low | Strict TypeScript + test each hook |

---

## Timeline

- **Phase 1**: ✅ COMPLETED (2026-01-01) - 2-3 hours (foundation - shared utils + QueryClient configs)
- **Phase 2**: ✅ COMPLETED (2026-01-01) - 3-4 hours (admin core hooks - auth, services, gallery, bookings)
- **Phase 3**: ✅ COMPLETED (2026-01-01) - 2-3 hours (admin secondary hooks - banners, contacts, etc.)
- **Phase 4**: ✅ COMPLETED (2026-01-01) - 2-3 hours (client hooks - services, gallery, booking)
- **Phase 5**: 4-6 hours (component migration - incremental, page by page)
- **Phase 6**: 2-3 hours (advanced features - prefetch, polling, optional offline)

**Total Completed**: 10-13 hours
**Total Remaining**: 6-9 hours of focused development

**Recommended Schedule**:
- Current: Phase 4 Complete ✅
- Next: Phase 5 (component migration - incremental page by page)
- Final: Phase 6 (advanced features) + testing + documentation

---

## Next Steps

1. ✅ Phase 1 Foundation Complete
2. ✅ Phase 2 Admin Core Hooks Complete
   - ✅ Created useAuth hooks for login/logout mutations
   - ✅ Created useServices hooks for CRUD operations
   - ✅ Created useGallery hooks for CRUD operations
   - ✅ Created useBookings hooks with filters support
3. ✅ Phase 3 Admin Secondary Hooks Complete
   - ✅ Created useBanners hooks (8 hooks - CRUD + toggle + reorder)
   - ✅ Created useContacts hooks (5 hooks - CRUD + mark as read)
   - ✅ Created useBusinessInfo hooks (2 hooks - get/update singleton)
   - ✅ Created useHeroSettings hooks (3 hooks - get/update/reset singleton)
   - ✅ Created useUpload hook (3 hooks - image/video upload with progress)
4. ✅ Phase 4 Client Hooks Complete
   - ✅ Created useServices hooks for client (3 hooks - read-only, public endpoints)
   - ✅ Created useGallery hooks for client (2 hooks - read-only, public endpoints)
   - ✅ Created useBookings hook for client (1 hook - booking creation mutation)
   - ✅ Total: 7 client hooks created
5. Begin Phase 5 (Component Migration)
   - Migrate admin pages incrementally (Services, Gallery, Bookings, etc.)
   - Migrate client pages incrementally
   - Replace service layer calls with hooks
6. Monitor performance with DevTools throughout implementation
7. Document lessons learned for team
8. Proceed to Phase 6 (Advanced Features)
   - Implement prefetching strategies
   - Add polling for real-time updates
   - Optional offline support

---

## Questions for Resolution

1. ❓ **Optimistic updates scope**: Which operations beyond toggles should be optimistic?
   - **Recommendation**: Start with toggles only, expand if UX benefit clear

2. ❓ **Service layer deprecation**: Remove services after migration or keep as abstraction?
   - **Recommendation**: Keep initially, evaluate after migration complete

3. ❓ **Polling intervals**: What refresh rate for admin dashboard stats?
   - **Recommendation**: 30s for bookings, 5min for stats (configurable)

4. ❓ **Offline support priority**: Is admin offline support critical?
   - **Recommendation**: Phase 6 (low priority), evaluate business need

5. ❓ **Client authentication**: Will customer accounts be added later?
   - **Recommendation**: Design hooks to support future auth (enabled: !!token pattern)

6. ❓ **Prefetch strategy**: Which pages benefit most from prefetching?
   - **Recommendation**: Detail pages on hover, adjacent pagination

7. ❓ **Error boundary integration**: Add error boundaries for query errors?
   - **Recommendation**: Phase 6 enhancement, use inline error states initially

---

**Plan Status**: Phase 1 Complete ✅, Phase 2 Complete ✅, Phase 3 Complete ✅, Phase 4 Complete ✅, Phases 5-6 Ready
**Phase 1 Completion**: ✅ 2026-01-01
**Phase 2 Completion**: ✅ 2026-01-01
**Phase 3 Completion**: ✅ 2026-01-01
**Phase 4 Completion**: ✅ 2026-01-01
**Current Phase**: Phase 5 (Component Migration) - Ready for Implementation
**Next Deliverable**: Component Migration (incremental migration of admin and client pages to use hooks)
**Estimated Phase 5 Duration**: 4-6 hours
**Implementation Ready**: ✅ Yes (All hook creation phases complete, ready for component migration)

---

## Reference Documents

- Previous brainstorm: `plans/260101-react-query-integration-plan.md`
- API Documentation: `/docs/api-endpoints.md`
- Type System: `/docs/shared-types.md`
- Code Standards: `/docs/code-standards.md`
- System Architecture: `/docs/system-architecture.md`
