# Phase 3: Admin React Query Hooks

## 🎯 Goal
Create React Query hooks for gallery categories following the `useBanners.ts` pattern with optimistic updates.

## 📦 Tasks

### 3.1 Update Query Keys

**File**: `packages/utils/src/api/queryKeys.ts`

Add namespace in `queryKeys` object:
```typescript
galleryCategories: {
  all: ['gallery-categories'] as const,
  lists: () => [...queryKeys.galleryCategories.all, 'list'] as const,
  details: () => [...queryKeys.galleryCategories.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.galleryCategories.details(), id] as const,
}
```

**Pattern**: Hierarchical query keys for targeted invalidation

### 3.2 Create React Query Hooks

**File**: `apps/admin/src/hooks/api/useGalleryCategory.ts`

Implement hooks:
1. ✅ `useGalleryCategories()` - Query all categories
2. ✅ `useCreateGalleryCategory()` - Create mutation
3. ✅ `useUpdateGalleryCategory()` - Update mutation
4. ✅ `useDeleteGalleryCategory()` - Delete mutation
5. ✅ `useToggleCategoryActive()` - Toggle with optimistic update

**Complete code in plan.md**

## 🔑 Key Features

### Query Hook
- Auth-aware (checks for `auth_token`)
- Returns paginated response
- Type-safe with `PaginationResponse<GalleryCategoryItem>`

### Mutation Hooks
- **Toast notifications** on success/error (using `sonner`)
- **Query invalidation** for cache updates
- **Optimistic updates** for toggle active (instant UI feedback)
- **Error rollback** if mutation fails
- **Specific error messages** for delete protection

### Optimistic Update Pattern (Toggle Active)
```typescript
onMutate: async ({ id, isActive }) => {
  // Cancel ongoing queries
  await queryClient.cancelQueries({ queryKey: queryKeys.galleryCategories.all });

  // Snapshot previous data
  const previousData = queryClient.getQueryData(...);

  // Optimistically update cache
  queryClient.setQueryData(..., {
    ...previousData,
    data: previousData.data.map((cat) =>
      cat._id === id ? { ...cat, isActive } : cat
    ),
  });

  return { previousCategories: previousData };
},

onError: (err, variables, context) => {
  // Rollback on error
  if (context?.previousCategories) {
    queryClient.setQueryData(..., context.previousCategories);
  }
},
```

## ✅ Verification

Type-check:
```bash
cd apps/admin
npm run type-check
```

Expected: No errors

## 📁 Files Modified

- `packages/utils/src/api/queryKeys.ts` (UPDATED)
- `apps/admin/src/hooks/api/useGalleryCategory.ts` (NEW)

## ⏭️ Next Phase

Phase 4: Admin UI Components
