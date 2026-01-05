# Unified Upload Endpoints - Overview

**Created**: 2026-01-03
**Status**: In Progress (API Complete, Admin Components In Progress)
**Objective**: Consolidate API upload endpoints from 7 to 3 (57% reduction)
**Progress**: Phases 1-4 Complete | Phases 5-7 In Progress

---

## Current State vs Target State

### Current (7 endpoints)
**Banners** - 3 endpoints:
- `POST /banners/upload/image` - image only
- `POST /banners/upload/video` - video only
- `POST /banners` - with URLs

**Gallery** - 2 endpoints:
- `POST /gallery/upload` - image file
- `POST /gallery` - with URL

**Services** - 2 endpoints:
- `POST /services/upload` - image file
- `POST /services` - with URL

### Target (3 endpoints)
**Banners** - 1 endpoint:
- `POST /banners` - image (required) + video (optional), multipart/form-data

**Gallery** - 1 endpoint:
- `POST /gallery` - image (required), multipart/form-data only

**Services** - 1 endpoint:
- `POST /services` - image (required), multipart/form-data only

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
- **Rationale**: Supports both image-only and video banners in single endpoint

### Gallery (Image Only)
- **Endpoint**: `POST /gallery`
- **Accepts**: `multipart/form-data` only (no URL-based creation)
- **Files**: `image` (required, max 10MB, jpg/jpeg/png/webp)
- **Interceptor**: `FileInterceptor('image')`
- **Change**: Remove URL-based `POST /gallery` endpoint
- **Rationale**: Gallery items are always uploaded images, no need for URL support

### Services (Image Only)
- **Endpoint**: `POST /services`
- **Accepts**: `multipart/form-data` only (no URL-based creation)
- **Files**: `image` (required, max 10MB, jpg/jpeg/png/webp)
- **Interceptor**: `FileInterceptor('image')`
- **Change**: Remove URL-based `POST /services` endpoint
- **Rationale**: Service thumbnails are always uploaded images, no need for URL support

---

## File Changes Summary

### API - New Files
```
apps/api/src/common/pipes/media-upload.pipe.ts         (Custom validation)
apps/api/src/common/validators/file-validators.ts      (Reusable validators)
```

### API - Modified Files
```
apps/api/src/modules/banners/banners.controller.ts
apps/api/src/modules/banners/dto/upload-banner.dto.ts
apps/api/src/modules/gallery/gallery.controller.ts
apps/api/src/modules/gallery/dto/upload-gallery.dto.ts
apps/api/src/modules/services/services.controller.ts
apps/api/src/modules/services/dto/upload-service.dto.ts
docs/api-endpoints.md
```

### Admin - Modified Files
```
apps/admin/src/components/banners/BannerFormModal.tsx
apps/admin/src/components/gallery/GalleryFormModal.tsx
apps/admin/src/services/banners.service.ts
apps/admin/src/services/gallery.service.ts
apps/admin/src/services/services.service.ts
apps/admin/src/hooks/api/useBanners.ts
apps/admin/src/hooks/api/useGallery.ts
apps/admin/src/hooks/api/useServices.ts
```

**Total Files**: ~20 files

---

## Implementation Phases

**Phase 1**: API - Shared Utilities (validation pipes, file validators)
**Phase 2**: API - Banners Module (pilot - consolidate 3 → 1 endpoint)
**Phase 3**: API - Gallery Module (consolidate 2 → 1 endpoint)
**Phase 4**: API - Services Module (consolidate 2 → 1 endpoint)
**Phase 5**: Admin - Banners Component (update to use new endpoint)
**Phase 6**: Admin - Gallery Component (update to use new endpoint)
**Phase 7**: Admin - Services Component (update to use new endpoint)
**Phase 8**: Cleanup & Documentation (remove deprecated endpoints)

**Details**: See `api-implementation.md` and `admin-implementation.md`

---

## Migration Strategy

**Approach**: Blue-Green Deployment

1. **Week 1**: API work - Add new endpoints, deprecate old ones
2. **Week 2**: Admin work - Migrate frontend to new endpoints
3. **Week 3**: Monitoring - Watch for errors, ensure old endpoints unused
4. **Week 4**: Cleanup - Remove deprecated endpoints

**Backward Compatibility**: Old endpoints kept functional during migration

**Rollback Plan**: Revert admin changes if issues (old endpoints still available)

---

## Risk Assessment

### Low Risk ✅
- Schema changes (no breaking changes)
- Adding new validators (isolated)
- Swagger docs updates

### Medium Risk ⚠️
- FormData handling complexity (different file types/sizes)
- Admin form refactoring (multiple components)
- Test coverage gaps

### High Risk ❌
- None identified

### Mitigation
- Extensive testing before removing old endpoints
- Keep backward compat during migration
- Monitor error logs closely
- Gradual rollout (1 module at a time)

---

## Success Metrics

**Quantitative:**
- Endpoint count: 7 → 3 (57% reduction)
- Test coverage maintained/improved
- Build time unchanged (Turbo cache works)
- Zero production errors post-deployment

**Qualitative:**
- Cleaner API surface
- Better developer experience
- Simplified frontend code
- Easier to understand/maintain

---

## Estimated Effort

- **API work**: 8-12 hours
- **Admin work**: 6-8 hours
- **Testing**: 4-6 hours
- **Total**: 18-26 hours (2-3 days)

**Priority**: Medium (improves DX, no critical bugs)

---

## Related Documents

- **API Implementation**: `api-implementation.md` (Phases 1-4)
- **Admin Implementation**: `admin-implementation.md` (Phases 5-7)
- **Testing & Migration**: `testing-migration.md` (Phase 8, testing strategy)
