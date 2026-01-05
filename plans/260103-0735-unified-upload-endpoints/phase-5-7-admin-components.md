# Phase 5-7: Admin Components (Frontend)

**Objective**: Update all admin components to use new unified endpoints
**Estimated Time**: 6-8 hours
**Dependencies**: API Phases 1-4 complete

---

## Phase 5: Banners Component

### Files to Modify
```
apps/admin/src/components/banners/BannerFormModal.tsx
apps/admin/src/services/banners.service.ts
apps/admin/src/hooks/api/useBanners.ts
```

### Task 5.1: Update banners.service.ts

**Before** (3 methods):
```typescript
createBanner: (data: CreateBannerDto) => ...
createBannerWithImage: (formData: FormData) => ...
createBannerWithVideo: (formData: FormData) => ...
```

**After** (1 method):
```typescript
export const bannersService = {
  createBanner: (formData: FormData) =>
    apiClient.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // ... other methods unchanged
};
```

### Task 5.2: Update BannerFormModal.tsx

**Key Changes**:
1. Remove conditional endpoint logic
2. Build single FormData for all banner types
3. Image always required, video optional

**Implementation**:
```typescript
const handleSubmit = async (data: BannerFormData) => {
  // Validate image required
  if (!imageFile) {
    toast.error('Image is required');
    return;
  }

  // Build FormData
  const formData = new FormData();
  formData.append('image', imageFile);

  // Video only for video banners
  if (data.type === 'video' && videoFile) {
    formData.append('video', videoFile);
  }

  // Metadata
  formData.append('title', data.title);
  formData.append('type', data.type);
  formData.append('isPrimary', String(data.isPrimary || false));
  formData.append('active', String(data.active ?? true));
  formData.append('sortIndex', String(data.sortIndex || 0));

  // Single API call
  await createBanner(formData);
};
```

### Task 5.3: Update useBanners.ts

**Before** (multiple mutations):
```typescript
const createImageMutation = useMutation(...);
const createVideoMutation = useMutation(...);
```

**After** (single mutation):
```typescript
export function useBanners() {
  const createMutation = useMutation({
    mutationFn: bannersService.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create banner');
    },
  });

  return {
    createBanner: createMutation.mutate,
    isCreating: createMutation.isPending,
    // ...
  };
}
```

### Manual Testing
- [ ] Create image banner
- [ ] Create video banner (image + video)
- [ ] File size error handling
- [ ] Loading states
- [ ] List refresh after create

---

## Phase 6: Gallery Component

### Files to Modify
```
apps/admin/src/components/gallery/GalleryFormModal.tsx
apps/admin/src/services/gallery.service.ts
apps/admin/src/hooks/api/useGallery.ts
```

### Changes

**gallery.service.ts**:
```typescript
// Change from /gallery/upload to /gallery
createGallery: (formData: FormData) =>
  apiClient.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
```

**GalleryFormModal.tsx**:
```typescript
const handleSubmit = async (data: GalleryFormData) => {
  if (!imageFile) {
    toast.error('Image is required');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('title', data.title);
  // ... other fields

  await createGallery(formData);
};
```

**useGallery.ts**:
```typescript
const createMutation = useMutation({
  mutationFn: galleryService.createGallery,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['gallery'] });
    toast.success('Gallery item created');
  },
});
```

### Manual Testing
- [ ] Create gallery item
- [ ] File size error handling
- [ ] Loading states
- [ ] List refresh

---

## Phase 7: Services Component

### Files to Modify
```
apps/admin/src/services/services.service.ts
apps/admin/src/hooks/api/useServices.ts
(Service form component if exists)
```

### Changes

**services.service.ts**:
```typescript
// Change from /services/upload to /services
createService: (formData: FormData) =>
  apiClient.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
```

**useServices.ts**:
```typescript
const createMutation = useMutation({
  mutationFn: servicesService.createService,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['services'] });
    toast.success('Service created');
  },
});
```

### Manual Testing
- [ ] Create service
- [ ] File size error handling
- [ ] Loading states
- [ ] List refresh

---

## Combined Admin Checklist

**Implementation**:
- [ ] All services updated (single endpoint)
- [ ] All components updated (single FormData)
- [ ] All hooks updated (single mutation)
- [ ] Error handling consistent
- [ ] Loading states working

**Testing**:
- [ ] Banners: Create image banner
- [ ] Banners: Create video banner
- [ ] Gallery: Create gallery item
- [ ] Services: Create service
- [ ] All forms: File size errors
- [ ] All forms: File type errors
- [ ] All forms: Loading states
- [ ] All forms: Success/error toasts
- [ ] All lists: Refresh after create

**Code Quality**:
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Type-check passes
- [ ] Build passes
- [ ] No unused code

---

## Next Steps

After Phase 5-7 complete → Proceed to Phase 8 (Cleanup & Docs)
