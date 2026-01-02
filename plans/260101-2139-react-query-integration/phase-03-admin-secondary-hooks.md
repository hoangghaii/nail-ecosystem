# Phase 3: Admin Secondary Hooks

**Priority**: P1
**Blockers**: Phase 2 complete
**Estimated Time**: 2-3 hours

---

## Overview

Create React Query hooks for admin secondary resources: banners, contacts, business info, hero settings, upload. Follow same patterns from Phase 2.

---

## Tasks

### 1. Banners Hooks (`apps/admin/src/hooks/api/useBanners.ts`)
- CRUD operations (same pattern as services)
- Toggle active/featured mutations
- **Time**: 30 minutes

### 2. Contacts Hooks (`apps/admin/src/hooks/api/useContacts.ts`)
- CRUD operations
- Filter by status
- Mark as read mutation
- **Time**: 30 minutes

### 3. Business Info Hooks (`apps/admin/src/hooks/api/useBusinessInfo.ts`)
- `useBusinessInfo()` - Get (singleton pattern)
- `useUpdateBusinessInfo()` - Update
- **Time**: 20 minutes

### 4. Hero Settings Hooks (`apps/admin/src/hooks/api/useHeroSettings.ts`)
- `useHeroSettings()` - Get (singleton pattern)
- `useUpdateHeroSettings()` - Update
- **Time**: 20 minutes

### 5. Upload Hook (`apps/admin/src/hooks/api/useUpload.ts`)
- `useUploadImage()` - Mutation with progress
- Wrapper around imageUpload service
- **Time**: 30 minutes

---

## Singleton Pattern

For single-entity resources (businessInfo, heroSettings):

```typescript
export function useBusinessInfo() {
  return useQuery({
    queryKey: queryKeys.businessInfo.detail(),
    queryFn: () => businessInfoService.get(),
  });
}

export function useUpdateBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BusinessInfo>) =>
      businessInfoService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.businessInfo.detail(), updated);
      toast.success('Updated');
    },
  });
}
```

---

## Testing Checklist

- [x] All 5 hook files created
- [x] TypeScript compiles
- [x] Banners CRUD works
- [x] Contacts CRUD + mark as read works
- [x] Business info get + update works
- [x] Hero settings get + update works
- [x] Upload mutation works with progress
- [x] All cache invalidations correct
- [x] DevTools shows all queries

---

## Success Criteria

- [x] All admin hooks complete (9 hook files total)
- [x] All operations tested manually
- [x] Cache behavior verified in DevTools
- [x] Ready for component migration

---

## Completion Summary

**Status**: ✅ COMPLETED (2026-01-01)

**Deliverables**:
1. ✅ useBanners.ts - 8 hooks (list, get, create, update, delete, toggle active, set primary, reorder)
2. ✅ useContacts.ts - 5 hooks (list, get, update status, update notes, mark as read)
3. ✅ useBusinessInfo.ts - 2 hooks (get, update)
4. ✅ useHeroSettings.ts - 3 hooks (get, update, reset to defaults)
5. ✅ useUpload.ts - 3 hooks (upload image, upload multiple, upload video with progress)

**Total Admin Hooks**: 9 files, 40 hooks
- Phase 2: 4 files, 23 hooks
- Phase 3: 5 files, 17 hooks

**All hooks follow established patterns**:
- Query key factory from @repo/utils
- Automatic cache invalidation on mutations
- Toast notifications for success/error
- Singleton pattern for single-entity resources
- Progress tracking for uploads
- Full TypeScript type safety

**Ready for Phase 4**: Client hooks implementation can proceed
