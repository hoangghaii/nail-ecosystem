# Phase 8: Cleanup & Documentation

**Objective**: Remove deprecated endpoints, update all documentation
**Estimated Time**: 2-3 hours
**Dependencies**: Phases 1-7 complete, monitoring period finished
**WARNING**: Only execute after confirming zero usage of deprecated endpoints

---

## Pre-Cleanup Verification

**Before removing anything, confirm**:
- [ ] Admin dashboard fully migrated
- [ ] All manual testing passed
- [ ] Monitoring shows zero deprecated endpoint usage (7+ days)
- [ ] No production errors reported
- [ ] User feedback positive

---

## Task 8.1: Remove Deprecated Endpoints

### Banners Controller

**File**: `apps/api/src/modules/banners/banners.controller.ts`

**Remove these methods entirely**:
```typescript
// DELETE THIS
@Post('upload/image')
@ApiDeprecated('...')
async uploadImage(...) { ... }

// DELETE THIS
@Post('upload/video')
@ApiDeprecated('...')
async uploadVideo(...) { ... }
```

**Keep**:
```typescript
@Post()
async create(...) { ... }  // The unified endpoint
```

### Gallery Controller

**File**: `apps/api/src/modules/gallery/gallery.controller.ts`

**Remove**:
```typescript
// DELETE THIS
@Post('upload')
@ApiDeprecated('...')
async upload(...) { ... }
```

**Keep**:
```typescript
@Post()
async create(...) { ... }  // The unified endpoint
```

### Services Controller

**File**: `apps/api/src/modules/services/services.controller.ts`

**Remove**:
```typescript
// DELETE THIS
@Post('upload')
@ApiDeprecated('...')
async upload(...) { ... }
```

**Keep**:
```typescript
@Post()
async create(...) { ... }  // The unified endpoint
```

---

## Task 8.2: Update API Documentation

**File**: `docs/api-endpoints.md`

### Banners Section

**Update to**:
```markdown
### Banners

#### Create Banner
- **Endpoint**: `POST /banners`
- **Auth**: Required (JWT Bearer token)
- **Content-Type**: `multipart/form-data`
- **Description**: Create a new banner with image (required) and optional video

**Request Body (multipart/form-data)**:
- `image` (file, required) - Banner image (max 10MB, jpg/jpeg/png/webp)
- `video` (file, optional) - Banner video (max 100MB, mp4/webm)
- `title` (string, required) - Banner title
- `type` (string, required) - 'image' or 'video'
- `isPrimary` (boolean, optional) - Primary banner flag
- `active` (boolean, optional) - Active status
- `sortIndex` (number, optional) - Display order

**Response**: `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Welcome Banner",
  "imageUrl": "https://storage.../banners/image.jpg",
  "videoUrl": "https://storage.../banners/video.mp4",
  "type": "video",
  "isPrimary": false,
  "active": true,
  "sortIndex": 1,
  "createdAt": "2026-01-03T12:00:00Z",
  "updatedAt": "2026-01-03T12:00:00Z"
}
```

**Example**:
```bash
curl -X POST https://api.example.com/banners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@banner-image.jpg" \
  -F "video=@banner-video.mp4" \
  -F "title=Welcome to Our Salon" \
  -F "type=video" \
  -F "active=true"
```

**Error Responses**:
- `400 Bad Request` - Missing image, invalid file type, or file too large
- `401 Unauthorized` - Missing or invalid auth token
- `413 Payload Too Large` - Image >10MB or video >100MB
```

### Gallery Section

**Update to**:
```markdown
### Gallery

#### Create Gallery Item
- **Endpoint**: `POST /gallery`
- **Auth**: Required (JWT Bearer token)
- **Content-Type**: `multipart/form-data`
- **Description**: Create a new gallery item with image upload

**Request Body (multipart/form-data)**:
- `image` (file, required) - Gallery image (max 10MB, jpg/jpeg/png/webp)
- `title` (string, required) - Item title
- `description` (string, optional) - Item description
- `categoryId` (string, optional) - Category ID
- `price` (string, optional) - Price display (e.g., "$45")
- `duration` (string, optional) - Duration (e.g., "60 minutes")
- `featured` (boolean, optional) - Featured flag
- `isActive` (boolean, optional) - Active status
- `sortIndex` (number, optional) - Display order

**Example**:
```bash
curl -X POST https://api.example.com/gallery \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@nail-design.jpg" \
  -F "title=Summer Floral Design" \
  -F "price=$45" \
  -F "duration=60 minutes"
```
```

### Services Section

**Update to**:
```markdown
### Services

#### Create Service
- **Endpoint**: `POST /services`
- **Auth**: Required (JWT Bearer token)
- **Content-Type**: `multipart/form-data`
- **Description**: Create a new service with image upload

**Request Body (multipart/form-data)**:
- `image` (file, required) - Service image (max 10MB, jpg/jpeg/png/webp)
- `name` (string, required) - Service name
- `description` (string, required) - Service description
- `price` (number, required) - Price in dollars
- `duration` (number, required) - Duration in minutes
- `category` (string, required) - Category: extensions, manicure, nail-art, pedicure, spa
- `featured` (boolean, optional) - Featured flag
- `isActive` (boolean, optional) - Active status
- `sortIndex` (number, optional) - Display order

**Example**:
```bash
curl -X POST https://api.example.com/services \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@manicure.jpg" \
  -F "name=Classic Manicure" \
  -F "description=Professional nail care with polish" \
  -F "price=25.99" \
  -F "duration=45" \
  -F "category=manicure"
```
```

---

## Task 8.3: Run Full Test Suite

**Execute**:
```bash
# Type-check all apps
npm run type-check

# Lint all apps
npm run lint

# Build all apps (verify no build errors)
npm run build

# Run API tests
cd apps/api
npm test

# Check test coverage
npm run test:cov

# Run integration tests
npm run test:e2e
```

**Expected Results**:
- [ ] Type-check passes (no TS errors)
- [ ] Lint passes (no ESLint warnings)
- [ ] Build passes (all apps build successfully)
- [ ] Unit tests pass (100% of existing tests)
- [ ] Integration tests pass
- [ ] Test coverage ≥ 80%

---

## Task 8.4: Create Migration Summary

**File**: `plans/260103-0735-unified-upload-endpoints/MIGRATION-SUMMARY.md`

**Content**:
```markdown
# Migration Summary: Unified Upload Endpoints

**Date**: 2026-01-03
**Status**: ✅ Complete
**Impact**: API simplification (7 → 3 endpoints, 57% reduction)

## Changes Made

### API Endpoints Removed
- ❌ `POST /banners/upload/image` → Use `POST /banners`
- ❌ `POST /banners/upload/video` → Use `POST /banners`
- ❌ `POST /gallery/upload` → Use `POST /gallery`
- ❌ `POST /services/upload` → Use `POST /services`

### API Endpoints Updated
- ✅ `POST /banners` - Now accepts multipart/form-data (image + optional video)
- ✅ `POST /gallery` - Now accepts multipart/form-data (image only)
- ✅ `POST /services` - Now accepts multipart/form-data (image only)

### Frontend Changes
- Updated admin dashboard components (BannerFormModal, GalleryFormModal)
- Simplified service layer (single create method per resource)
- Unified React Query mutations

## Breaking Changes
**None for public-facing API** (client app unaffected, uses GET endpoints only)

**Admin API**: Old upload endpoints removed (admin already migrated)

## Rollback Procedure
If critical issues arise:
1. Revert git commit: `git revert <commit-hash>`
2. Redeploy API: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-api`
3. Redeploy Admin: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-admin`

## Metrics
- Endpoints: 7 → 3 (57% reduction)
- Code deleted: ~150 LOC
- Test coverage: Maintained at 80%+
- Zero production errors: 30 days post-deployment
```

---

## Task 8.5: Update CHANGELOG

**File**: `CHANGELOG.md` (create if doesn't exist)

**Add entry**:
```markdown
## [Unreleased]

### Changed
- **API**: Consolidated upload endpoints for banners, gallery, and services
  - `POST /banners` now accepts multipart/form-data with image (required) + video (optional)
  - `POST /gallery` now accepts multipart/form-data with image
  - `POST /services` now accepts multipart/form-data with image

### Removed
- **API**: Deprecated upload endpoints removed:
  - `POST /banners/upload/image` (use `POST /banners`)
  - `POST /banners/upload/video` (use `POST /banners`)
  - `POST /gallery/upload` (use `POST /gallery`)
  - `POST /services/upload` (use `POST /services`)

### Fixed
- Improved file upload validation with clear error messages
```

---

## Acceptance Criteria

**Code Cleanup**:
- [ ] All deprecated endpoints removed from codebase
- [ ] No unused imports or dead code
- [ ] Code follows project standards

**Documentation**:
- [ ] API docs updated with new endpoint signatures
- [ ] cURL examples provided
- [ ] Migration summary written
- [ ] CHANGELOG updated

**Testing**:
- [ ] All tests pass
- [ ] Type-check passes
- [ ] Build passes
- [ ] No regression in functionality

**Verification**:
- [ ] Admin dashboard works correctly
- [ ] Client app unaffected
- [ ] No console errors
- [ ] No production errors

---

## Post-Cleanup Monitoring

**Monitor for 7 days**:
- API error rates (should be normal)
- Response times (should be unchanged)
- User reports (should be zero issues)

**If issues detected**:
- Execute rollback procedure immediately
- Document issue in migration summary
- Fix and re-deploy

---

## Next Steps

**After Phase 8 Complete**:
- [ ] Close implementation tickets
- [ ] Update project roadmap
- [ ] Communicate changes to team
- [ ] Archive plan documents
- [ ] Celebrate successful migration! 🎉
