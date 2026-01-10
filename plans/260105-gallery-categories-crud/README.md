# Gallery Categories CRUD Implementation

**Date**: 2026-01-05
**Status**: Ready for Implementation
**Type**: Feature Implementation

## 📋 Overview

Create full CRUD interface for gallery categories in admin dashboard with tabs-based UI, and migrate both client and admin apps from hardcoded enum to API-driven dynamic categories.

## 🎯 Objectives

- Build admin CRUD interface for gallery categories
- Add tabs UI to GalleryPage (Gallery Items | Categories)
- Migrate from hardcoded `GalleryCategory` enum to API-driven categories
- Support Vietnamese labels in client app (client-side mapping)
- Maintain backward compatibility during transition

## 🏗️ Architecture

### Backend
- ✅ **Already Complete**: `/gallery-categories` API with 6 endpoints (POST, GET, PATCH, DELETE)
- ✅ Schema: name, slug, description, sortIndex, isActive

### Frontend Changes
```
@repo/types
├── gallery-category.ts (NEW: GalleryCategoryItem, DTOs)

admin/
├── services/galleryCategory.service.ts (NEW)
├── hooks/api/useGalleryCategory.ts (NEW)
├── components/gallery/
│   ├── CategoryFormModal.tsx (NEW)
│   └── DeleteCategoryDialog.tsx (NEW)
└── pages/GalleryPage.tsx (UPDATE: Add tabs)

client/
└── hooks/useGalleryCategories.ts (NEW: Vietnamese labels)
```

## 📦 Implementation Phases

1. **Phase 1**: Shared Types Foundation (`packages/types`)
2. **Phase 2**: Admin Service Layer
3. **Phase 3**: Admin React Query Hooks
4. **Phase 4**: Admin UI Components (Modals/Dialogs)
5. **Phase 5**: Admin GalleryPage Integration (Tabs)
6. **Phase 6**: Update Existing Admin Components
7. **Phase 7**: Client App Migration
8. **Phase 8**: Type-Check & Verification

## 🔑 Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| "All" category | Client-side filter only | Not stored in DB, cleaner data model |
| Sorting | Alphabetical (no drag-drop) | Simpler implementation, user requested |
| Localization | Client-side mapping | Hardcoded Vietnamese labels in client hook |
| Schema | Use as-is | No backend changes needed |
| UI Pattern | BannersPage-style | Proven pattern, consistent with admin |
| Integration | Tabs in GalleryPage | Clean separation of concerns |

## 📊 Progress Tracking

- [ ] Phase 1: Shared Types Foundation
- [ ] Phase 2: Admin Service Layer
- [ ] Phase 3: Admin React Query Hooks
- [ ] Phase 4: Admin UI Components
- [ ] Phase 5: Admin GalleryPage Integration
- [ ] Phase 6: Update Existing Admin Components
- [ ] Phase 7: Client App Migration
- [ ] Phase 8: Type-Check & Verification

## 🎯 Success Criteria

- ✅ Admin can create/edit/delete categories
- ✅ Categories display in tabs UI
- ✅ Alphabetical sorting
- ✅ Auto-slug generation from name
- ✅ CategoryFilter uses dynamic categories from API
- ✅ GalleryFormModal dropdown is dynamic
- ✅ Client shows Vietnamese labels
- ✅ "All" category is client-side only
- ✅ Type-check passes for all apps

## 📁 Files

### New Files (6)
1. `packages/types/src/gallery-category.ts`
2. `apps/admin/src/services/galleryCategory.service.ts`
3. `apps/admin/src/hooks/api/useGalleryCategory.ts`
4. `apps/admin/src/components/gallery/CategoryFormModal.tsx`
5. `apps/admin/src/components/gallery/DeleteCategoryDialog.tsx`
6. `apps/client/src/hooks/useGalleryCategories.ts`

### Modified Files (8)
1. `packages/types/src/index.ts`
2. `packages/utils/src/api/queryKeys.ts`
3. `apps/admin/src/pages/GalleryPage.tsx`
4. `apps/admin/src/components/gallery/CategoryFilter.tsx`
5. `apps/admin/src/components/gallery/GalleryFormModal.tsx`
6. `apps/admin/src/components/gallery/index.ts`
7. `apps/client/src/hooks/useGalleryPage.ts`
8. `apps/client/src/pages/GalleryPage.tsx` (minor)

## 🚧 Constraints

- **No Backend Changes**: API already complete
- **No Drag-Drop**: Alphabetical sort only
- **No Bulk Operations**: Individual CRUD only
- **Vietnamese Labels**: Hardcoded client-side mapping
- **Schema As-Is**: Use existing API schema

## 📝 Notes

- Keep `GalleryCategory` enum in `@repo/types` for backward compatibility
- Categories sorted alphabetically by name
- Slug auto-generated from name (backend handles this)
- Protection rules prevent deleting categories in use
