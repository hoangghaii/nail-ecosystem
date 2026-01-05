# Unified Upload Endpoints Implementation Plan

**Created**: 2026-01-03
**Status**: In Progress (Phases 1-4 Complete, Admin Components Pending)
**Objective**: Consolidate API upload endpoints from multiple endpoints to single endpoint per resource

---

## Overview

**Current State:**
- Banners: 3 endpoints (`/upload/image`, `/upload/video`, `POST /`)
- Gallery: 2 endpoints (`/upload`, `POST /`)
- Services: 2 endpoints (`/upload`, `POST /`)
- **Total**: 7 endpoints

**Target State:**
- Banners: 1 endpoint (`POST /banners` - image required, video optional)
- Gallery: 1 endpoint (`POST /gallery` - image required, file upload only)
- Services: 1 endpoint (`POST /services` - image required, file upload only)
- **Total**: 3 endpoints

**Impact:**
- API: 3 modules (banners, gallery, services)
- Admin: 3 components (BannerFormModal, GalleryFormModal, ServiceFormModal)
- Reduction: 57% fewer endpoints (7 → 3)

---

## Design Decisions

### Banners
- **Endpoint**: `POST /banners`
- **Accepts**: `multipart/form-data`
- **Files**:
  - `image` (required, max 10MB, jpg/jpeg/png/webp)
  - `video` (optional, max 100MB, mp4/webm)
- **Interceptor**: `FileFieldsInterceptor([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }])`
- **Validation**: Custom pipe for different file size limits

### Gallery
- **Endpoint**: `POST /gallery`
- **Accepts**: `multipart/form-data` only
- **Files**: `image` (required, max 10MB, jpg/jpeg/png/webp)
- **Interceptor**: `FileInterceptor('image')`
- **Change**: Remove URL-based `POST /gallery` endpoint

### Services
- **Endpoint**: `POST /services`
- **Accepts**: `multipart/form-data` only
- **Files**: `image` (required, max 10MB, jpg/jpeg/png/webp)
- **Interceptor**: `FileInterceptor('image')`
- **Change**: Remove URL-based `POST /services` endpoint

---

## Implementation Phases

### Phase 1: API - Shared Utilities (Foundation)
**Objective**: Create reusable validation utilities

**Files to Create:**
- `apps/api/src/common/pipes/media-upload.pipe.ts` - Custom validation pipe
- `apps/api/src/common/validators/file-validators.ts` - File type/size validators

**Tasks:**
1. Create `MediaUploadPipe` for multi-file validation
   - Image validation (required, 10MB, image types)
   - Video validation (optional, 100MB, video types)
2. Create reusable file validators
   - `validateImageFile(file, maxSize)`
   - `validateVideoFile(file, maxSize)`
3. Write unit tests for validators

**Acceptance Criteria:**
- [x] Pipe validates image required, video optional
- [x] Correct error messages for file size/type violations
- [x] Unit tests pass with 100% coverage (27 tests pass)

---

### Phase 2: API - Banners Module (Pilot)
**Objective**: Consolidate 3 banner endpoints into 1

**Files to Modify:**
- `apps/api/src/modules/banners/banners.controller.ts`
- `apps/api/src/modules/banners/dto/upload-banner.dto.ts`

**Files to Remove:**
- None (keep old endpoints for backward compat during migration)

**Tasks:**
1. Update `POST /banners` endpoint:
   - Change from `@Body()` to `@UseInterceptors(FileFieldsInterceptor(...))`
   - Add `@UploadedFiles()` parameter
   - Validate files using `MediaUploadPipe`
   - Upload image to storage
   - Upload video to storage (if present)
   - Create banner with both URLs
2. Update `UploadBannerDto`:
   - Remove `imageUrl`, `videoUrl` fields (come from upload)
   - Keep metadata fields (title, type, isPrimary, active, sortIndex)
3. Add Swagger documentation:
   - `@ApiConsumes('multipart/form-data')`
   - Define schema with image (binary, required) and video (binary, optional)
4. Deprecate old endpoints (add `@ApiDeprecated()` decorator):
   - `POST /banners/upload/image` → deprecated
   - `POST /banners/upload/video` → deprecated
5. Update integration tests

**Acceptance Criteria:**
- [x] `POST /banners` accepts image + optional video
- [x] Image validation: max 10MB, jpg/jpeg/png/webp
- [x] Video validation: max 100MB, mp4/webm
- [x] Both files uploaded to storage correctly
- [x] Banner created with imageUrl + videoUrl
- [x] Old endpoints still work (deprecated)
- [x] Swagger docs accurate
- [x] Tests pass (7 controller tests)

**Testing Commands:**
```bash
# Test with image only
curl -X POST http://localhost:3000/banners \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@test-image.jpg" \
  -F "title=Test Banner" \
  -F "type=image"

# Test with image + video
curl -X POST http://localhost:3000/banners \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@test-image.jpg" \
  -F "video=@test-video.mp4" \
  -F "title=Test Banner" \
  -F "type=video"
```

---

### Phase 3: API - Gallery Module
**Objective**: Consolidate 2 gallery endpoints into 1

**Files to Modify:**
- `apps/api/src/modules/gallery/gallery.controller.ts`
- `apps/api/src/modules/gallery/dto/upload-gallery.dto.ts`

**Files to Remove:**
- Keep `POST /gallery/upload` temporarily for migration
- Will remove after frontend updated

**Tasks:**
1. Update `POST /gallery` endpoint:
   - Change from `@Body()` to `@UseInterceptors(FileInterceptor('image'))`
   - Add `@UploadedFile()` parameter with validation
   - Upload image to storage
   - Create gallery item with imageUrl
2. Update `UploadGalleryDto`:
   - Remove `imageUrl` field
   - Keep metadata (title, description, categoryId, price, duration, featured, isActive, sortIndex)
3. Add Swagger docs (`@ApiConsumes`, schema with image binary)
4. Deprecate `POST /gallery/upload`
5. Update tests

**Acceptance Criteria:**
- [x] `POST /gallery` accepts image file
- [x] Image validation: max 10MB, jpg/jpeg/png/webp
- [x] Image uploaded to storage correctly
- [x] Gallery item created with imageUrl
- [x] Old `/upload` endpoint deprecated but functional
- [x] Swagger docs accurate
- [x] Tests pass (6 controller tests)

---

### Phase 4: API - Services Module
**Objective**: Consolidate 2 services endpoints into 1

**Files to Modify:**
- `apps/api/src/modules/services/services.controller.ts`
- `apps/api/src/modules/services/dto/upload-service.dto.ts`

**Files to Remove:**
- Keep `POST /services/upload` temporarily for migration

**Tasks:**
1. Update `POST /services` endpoint:
   - Change from `@Body()` to `@UseInterceptors(FileInterceptor('image'))`
   - Add `@UploadedFile()` parameter with validation
   - Upload image to storage
   - Create service with imageUrl
2. Update `UploadServiceDto`:
   - Remove `imageUrl` field
   - Keep metadata (name, description, price, duration, category, featured, isActive, sortIndex)
3. Add Swagger docs
4. Deprecate `POST /services/upload`
5. Update tests

**Acceptance Criteria:**
- [x] `POST /services` accepts image file
- [x] Image validation: max 10MB, jpg/jpeg/png/webp
- [x] Image uploaded to storage correctly
- [x] Service created with imageUrl
- [x] Old `/upload` endpoint deprecated but functional
- [x] Swagger docs accurate
- [x] Tests pass (6 controller tests)

---

### Phase 5: Admin - Banners Component
**Objective**: Update frontend to use new banner endpoint

**Files to Modify:**
- `apps/admin/src/components/banners/BannerFormModal.tsx`
- `apps/admin/src/services/banners.service.ts`
- `apps/admin/src/hooks/api/useBanners.ts`

**Tasks:**
1. Update `banners.service.ts`:
   - Remove `createBannerWithImage()` and `createBannerWithVideo()`
   - Update `createBanner()` to accept FormData with image + optional video
   - Single API call to `POST /banners`
2. Update `BannerFormModal.tsx`:
   - Simplify upload logic (no conditional endpoint selection)
   - Build single FormData with image + video (if type='video')
   - Handle both files in one submission
3. Update `useBanners.ts`:
   - Use unified mutation for all banner creates
   - Remove separate image/video mutations
4. Test manually in admin dashboard

**Acceptance Criteria:**
- [ ] Create image banner works
- [ ] Create video banner works (image + video)
- [ ] Loading states correct
- [ ] Error handling works
- [ ] Form validation intact
- [ ] No console errors

---

### Phase 6: Admin - Gallery Component
**Objective**: Update frontend to use new gallery endpoint

**Files to Modify:**
- `apps/admin/src/components/gallery/GalleryFormModal.tsx`
- `apps/admin/src/services/gallery.service.ts`
- `apps/admin/src/hooks/api/useGallery.ts`

**Tasks:**
1. Update `gallery.service.ts`:
   - Change `createGallery()` to use `POST /gallery` (not `/gallery/upload`)
   - Accept FormData with image file
2. Update `GalleryFormModal.tsx`:
   - Use updated service method
   - No logic changes (already uploads files)
3. Update `useGallery.ts`:
   - Point mutation to new endpoint
4. Test manually

**Acceptance Criteria:**
- [ ] Create gallery item works
- [ ] Image upload successful
- [ ] Error handling works
- [ ] No console errors

---

### Phase 7: Admin - Services Component
**Objective**: Update frontend to use new services endpoint

**Files to Modify:**
- `apps/admin/src/components/services/ServiceFormModal.tsx` (if exists)
- `apps/admin/src/services/services.service.ts`
- `apps/admin/src/hooks/api/useServices.ts`

**Tasks:**
1. Update `services.service.ts`:
   - Change `createService()` to use `POST /services` (not `/services/upload`)
   - Accept FormData with image file
2. Update service form component (if exists)
3. Update `useServices.ts`
4. Test manually

**Acceptance Criteria:**
- [ ] Create service works
- [ ] Image upload successful
- [ ] Error handling works
- [ ] No console errors

---

### Phase 8: Cleanup & Documentation
**Objective**: Remove deprecated endpoints and update docs

**Files to Modify:**
- `apps/api/src/modules/banners/banners.controller.ts` - Remove old endpoints
- `apps/api/src/modules/gallery/gallery.controller.ts` - Remove old endpoints
- `apps/api/src/modules/services/services.controller.ts` - Remove old endpoints
- `docs/api-endpoints.md` - Update API docs

**Files to Remove:**
- None (DTOs kept for backward compat if needed)

**Tasks:**
1. Remove deprecated banner endpoints:
   - `POST /banners/upload/image`
   - `POST /banners/upload/video`
2. Remove deprecated gallery endpoint:
   - `POST /gallery/upload`
3. Remove deprecated services endpoint:
   - `POST /services/upload`
4. Update API documentation:
   - New endpoint signatures
   - FormData examples
   - cURL examples
5. Run full test suite
6. Type-check all apps

**Acceptance Criteria:**
- [ ] Old endpoints removed from codebase
- [ ] All tests pass (`npm run test`)
- [ ] Type-check passes (`npm run type-check`)
- [ ] Build passes (`npm run build`)
- [ ] API docs updated
- [ ] No breaking changes for client app (uses public GET endpoints)

---

## File Changes Summary

### API Changes
**Create:**
- `apps/api/src/common/pipes/media-upload.pipe.ts`
- `apps/api/src/common/validators/file-validators.ts`

**Modify:**
- `apps/api/src/modules/banners/banners.controller.ts`
- `apps/api/src/modules/banners/dto/upload-banner.dto.ts`
- `apps/api/src/modules/gallery/gallery.controller.ts`
- `apps/api/src/modules/gallery/dto/upload-gallery.dto.ts`
- `apps/api/src/modules/services/services.controller.ts`
- `apps/api/src/modules/services/dto/upload-service.dto.ts`
- `docs/api-endpoints.md`

**Remove (Phase 8):**
- Old controller methods (not files)

### Admin Changes
**Modify:**
- `apps/admin/src/components/banners/BannerFormModal.tsx`
- `apps/admin/src/components/gallery/GalleryFormModal.tsx`
- `apps/admin/src/services/banners.service.ts`
- `apps/admin/src/services/gallery.service.ts`
- `apps/admin/src/services/services.service.ts`
- `apps/admin/src/hooks/api/useBanners.ts`
- `apps/admin/src/hooks/api/useGallery.ts`
- `apps/admin/src/hooks/api/useServices.ts`

**Total Files**: ~20 files

---

## Testing Strategy

### Unit Tests
- [x] `MediaUploadPipe` validates correctly (27 tests pass)
- [x] File validators work with valid/invalid files (100% coverage)
- [x] Service methods handle file uploads

### Integration Tests
- [x] `POST /banners` creates banner with image only (7 controller tests)
- [x] `POST /banners` creates banner with image + video (included in 7 tests)
- [x] `POST /gallery` creates gallery item (6 controller tests)
- [x] `POST /services` creates service (6 controller tests)
- [x] File size limits enforced
- [x] File type validation works
- [x] Unauthorized requests rejected

### Manual Testing (Admin Dashboard)
- [ ] Create image banner
- [ ] Create video banner
- [ ] Create gallery item
- [ ] Create service
- [ ] Error handling (file too large, wrong type)
- [ ] Loading states
- [ ] Success messages

### Regression Testing
- [x] Type-check passes (no TypeScript errors)
- [x] Build passes
- [ ] Client app GET endpoints still work
- [ ] Existing banners/gallery/services display correctly
- [ ] No breaking changes to public API

---

## Migration Strategy

**Approach**: Blue-Green Deployment (Keep old endpoints during migration)

**Timeline:**
1. **Week 1**: API Phases 1-4 (old endpoints deprecated but functional)
2. **Week 2**: Admin Phases 5-7 (migrate frontend to new endpoints)
3. **Week 3**: Monitoring (ensure no errors in production)
4. **Week 4**: Cleanup Phase 8 (remove old endpoints)

**Rollback Plan:**
- If issues found, revert admin changes (old endpoints still available)
- Monitor API logs for deprecated endpoint usage
- Only remove old endpoints when usage drops to 0

---

## Risk Assessment

### Low Risk
- Schema changes (no breaking changes)
- Adding new validators (isolated)
- Swagger docs updates

### Medium Risk
- FormData handling complexity (different file types/sizes)
- Admin form refactoring (multiple components)
- Test coverage gaps

### High Risk
- None identified

### Mitigation
- Extensive testing before removing old endpoints
- Keep backward compat during migration
- Monitor error logs closely
- Gradual rollout (1 module at a time)

---

## Success Metrics

**Quantitative:**
- [x] Endpoint count: 7 → 3 (57% reduction) - OLD ENDPOINTS DEPRECATED
- [x] Test coverage maintained/improved (46 tests: 27 unit + 19 controller)
- [x] Build time unchanged (Turbo cache works)
- [ ] Zero production errors post-deployment (pending admin phase)

**Qualitative:**
- [x] Cleaner API surface (unified endpoints deployed)
- [x] Better developer experience (single endpoint per resource)
- [ ] Simplified frontend code (phases 5-7 pending)
- [ ] Easier to understand/maintain

---

## Dependencies

**External:**
- None

**Internal:**
- Storage service (`StorageService`) must handle multiple uploads
- No schema changes needed (all fields already exist)

---

## Open Questions

1. ✅ Gallery/Services need video support? **NO**
2. ✅ Keep URL-based endpoints? **NO (Option A)**
3. ✅ API Implementation Timeline? **COMPLETE (Jan 3, 2026)**
4. ⏳ Admin Migration Timeline? **IN PROGRESS (Phases 5-7)**
5. ⏳ When to remove deprecated endpoints? **After admin migration complete + 1 week monitoring**

---

## Next Steps

1. ✅ **Review plan** with stakeholders - COMPLETE
2. ✅ **Get approval** for implementation approach - COMPLETE
3. ✅ **Phase 1-4** (API shared utilities, banners, gallery, services) - COMPLETE
4. **Phase 5-7** (Admin components migration) - IN PROGRESS
5. **Phase 8** (Cleanup deprecated endpoints + final docs)
6. **Monitor production** (1 week after admin migration)
7. **Remove old endpoints** (Phase 8)

---

**Estimated Effort**:
- API work: ~8-12 hours (✅ COMPLETE - Jan 3, 2026)
- Admin work: ~6-8 hours (⏳ IN PROGRESS - Phases 5-7)
- Testing: ~4-6 hours (✅ PARTIAL - 46 tests pass, manual admin tests pending)
- **Total**: ~18-26 hours (2-3 days)
- **Completed**: ~10-13 hours (API + unit/integration tests)
- **Remaining**: ~6-8 hours (Admin components + manual testing)

**Priority**: Medium (improves DX, no critical bugs)
