# Phase 8: Type-Check & Verification

## 🎯 Goal
Verify all changes compile correctly, test end-to-end functionality, and ensure production readiness.

## 📦 Tasks

### 8.1 Type-Check All Apps

Run type-check across entire monorepo:

```bash
# From project root
npm run type-check
```

**Expected output**: ✅ No type errors in any app

**If errors occur**:
- Check shared type imports (`@repo/types/gallery-category`)
- Verify query keys namespace in `@repo/utils`
- Ensure all component props updated correctly

### 8.2 Build All Apps

Test production build:

```bash
# From project root
npm run build
```

**Expected**:
- ✅ All apps build successfully
- ✅ Turbo cache hits on unchanged packages
- ✅ No build warnings related to gallery categories

### 8.3 Manual Testing - Admin App

**Test CRUD Operations**:

1. **Create Category**:
   - [ ] Navigate to Gallery → Categories tab
   - [ ] Click "Add Category"
   - [ ] Fill form: name, description, active toggle
   - [ ] Verify slug preview updates
   - [ ] Submit and verify success toast
   - [ ] Category appears in list

2. **Edit Category**:
   - [ ] Click Edit on a category
   - [ ] Modify name/description
   - [ ] Submit and verify update

3. **Delete Category**:
   - [ ] Click Delete on category without items
   - [ ] Confirm deletion
   - [ ] Verify success toast and removal

4. **Delete Protection**:
   - [ ] Assign gallery item to category
   - [ ] Try to delete category
   - [ ] Verify protection error message

5. **Category Filter**:
   - [ ] Gallery Items tab shows dynamic categories
   - [ ] Click category filter
   - [ ] Verify items filtered correctly
   - [ ] Check category counts are accurate

6. **Gallery Form**:
   - [ ] Create/Edit gallery item
   - [ ] Category dropdown shows active categories
   - [ ] Select category and save

### 8.4 Manual Testing - Client App

**Test Dynamic Categories**:

1. **Category Display**:
   - [ ] Navigate to client gallery page
   - [ ] Verify Vietnamese labels display
   - [ ] Check "Tất Cả" shows all items

2. **Category Filtering**:
   - [ ] Click each category
   - [ ] Verify correct items filter
   - [ ] Check URLs update (if applicable)

3. **New Categories**:
   - [ ] Create new category in admin
   - [ ] Refresh client page
   - [ ] Verify new category appears (after cache expires)

### 8.5 API Integration Test

**Verify API Calls**:

Use browser DevTools Network tab:

1. **GET /gallery-categories**:
   - [ ] Called on page load
   - [ ] Returns active categories
   - [ ] Response matches `GalleryCategoryItem[]` type

2. **POST /gallery-categories**:
   - [ ] Create category request
   - [ ] Verify request body matches DTO
   - [ ] Success response 201

3. **PATCH /gallery-categories/:id**:
   - [ ] Update category request
   - [ ] Partial updates work

4. **DELETE /gallery-categories/:id**:
   - [ ] Delete request successful
   - [ ] Protection error returns 400

### 8.6 Code Quality Checks

**Remove Dead Code**:

Search for hardcoded `GalleryCategory` enum usage:

```bash
# Search in client
grep -r "GalleryCategory\." apps/client/src/

# Search in admin
grep -r "GalleryCategory\." apps/admin/src/

# Expected: No results (except imports from @repo/types)
```

**Verify Imports**:

Check no direct enum usage:
```bash
# Should only be in shared types
grep -r "import.*GalleryCategory.*from.*gallery" apps/
```

### 8.7 Performance Verification

**Check Query Optimization**:

1. **Admin**:
   - [ ] Categories fetched once per page load
   - [ ] Mutations invalidate queries correctly
   - [ ] Optimistic updates for toggle active

2. **Client**:
   - [ ] Categories cached for 5 minutes
   - [ ] No unnecessary refetches

### 8.8 Docker Compose Test

**Full Integration Test**:

```bash
# Start all services
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Verify all apps running:
# - Client: http://localhost:5173
# - Admin: http://localhost:5174
# - API: http://localhost:3000
```

**Test Flow**:
1. Create category in admin
2. Assign gallery item to category
3. View on client with Vietnamese label
4. Filter by category
5. Try to delete category (should fail)
6. Reassign item, then delete

## ✅ Acceptance Criteria

All items must pass:

- [ ] Type-check passes for all apps
- [ ] Build succeeds without errors
- [ ] Admin can create/edit/delete categories
- [ ] Slug auto-generates correctly
- [ ] Delete protection works
- [ ] CategoryFilter shows dynamic categories
- [ ] GalleryFormModal dropdown is dynamic
- [ ] Client shows Vietnamese labels
- [ ] "All" category filters correctly
- [ ] No hardcoded enum usage (except `@repo/types`)
- [ ] API calls work end-to-end
- [ ] Docker Compose integration works

## 🐛 Common Issues & Fixes

### Type Errors

**Issue**: Import errors for `GalleryCategoryItem`
**Fix**: Verify `packages/types/src/index.ts` exports `gallery-category`

**Issue**: QueryKeys type errors
**Fix**: Check `@repo/utils/src/api/queryKeys.ts` namespace

### Runtime Errors

**Issue**: Categories not loading
**Fix**: Check auth token in storage, verify API endpoint

**Issue**: Slug not auto-generating
**Fix**: Backend handles this, don't send slug in create

### UI Issues

**Issue**: Vietnamese labels not showing
**Fix**: Check `VIETNAMESE_LABELS` mapping in client hook

**Issue**: Category counts incorrect
**Fix**: Verify `categoryCounts` useMemo logic

## 📊 Final Checklist

- [ ] All 8 phases completed
- [ ] All acceptance criteria met
- [ ] No console errors in browser
- [ ] No type errors in IDE
- [ ] Documentation updated (if needed)
- [ ] Plan files created in `/plans/260105-gallery-categories-crud/`

## 🎉 Completion

Once all verification passes:
1. Mark all todos as complete
2. Create completion summary report
3. Ready for production deployment

## 📁 Files Summary

**New Files (6)**:
- `packages/types/src/gallery-category.ts`
- `apps/admin/src/services/galleryCategory.service.ts`
- `apps/admin/src/hooks/api/useGalleryCategory.ts`
- `apps/admin/src/components/gallery/CategoryFormModal.tsx`
- `apps/admin/src/components/gallery/DeleteCategoryDialog.tsx`
- `apps/client/src/hooks/useGalleryCategories.ts`

**Modified Files (8)**:
- `packages/types/src/index.ts`
- `packages/utils/src/api/queryKeys.ts`
- `apps/admin/src/pages/GalleryPage.tsx`
- `apps/admin/src/components/gallery/CategoryFilter.tsx`
- `apps/admin/src/components/gallery/GalleryFormModal.tsx`
- `apps/admin/src/components/gallery/index.ts`
- `apps/client/src/hooks/useGalleryPage.ts`
- `apps/client/src/pages/GalleryPage.tsx`

**Removed Files (1)**:
- `apps/client/src/data/gallery.ts`

**Total**: 15 files changed, +2000 LOC
