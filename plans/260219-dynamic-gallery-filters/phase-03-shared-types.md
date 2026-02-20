# Phase 03 — Shared Types Update

**Date:** 2026-02-19
**Status:** pending — depends on Phases 01 & 02

---

## Objective

Update `@repo/types` package: add `NailShapeItem`/`NailStyleItem` interfaces, update `GalleryItem` to remove `category` and change shape/style fields to plain strings.

---

## Files to Modify

| File | Action | Change |
|---|---|---|
| `packages/types/src/gallery.ts` | modify | Remove `category`, update `nailShape`/`style` fields, remove hardcoded enums |
| `packages/types/src/index.ts` | modify | Add export for new nail-options types |

## Files to Create

| File | Action |
|---|---|
| `packages/types/src/nail-options.ts` | create |

---

## Changes

### `packages/types/src/nail-options.ts` (NEW)

```typescript
export type NailShapeItem = {
  _id: string;
  value: string;       // slug, e.g. "almond"
  label: string;       // English, e.g. "Almond"
  labelVi: string;     // Vietnamese, e.g. "Móng Hạnh Nhân"
  isActive: boolean;
  sortIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NailStyleItem = {
  _id: string;
  value: string;       // slug, e.g. "3d"
  label: string;       // English, e.g. "3D Art"
  labelVi: string;     // Vietnamese, e.g. "Vẽ 3D"
  isActive: boolean;
  sortIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateNailOptionDto = {
  value: string;
  label: string;
  labelVi: string;
  isActive?: boolean;
  sortIndex?: number;
};

export type UpdateNailOptionDto = Partial<CreateNailOptionDto>;
```

### `packages/types/src/gallery.ts` (MODIFY)

```typescript
// BEFORE:
export type GalleryItem = {
  category: string;
  nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto';
  style?: '3d' | 'mirror' | 'gem' | 'ombre';
  // ...
};

// AFTER:
export type GalleryItem = {
  // category REMOVED
  nailShape?: string;   // matches NailShapeItem.value
  style?: string;       // kept as 'style' to match API schema field name
  // ... all other fields unchanged
};
```

Remove `GalleryCategory` const/type entirely (the client GalleryPage no longer uses it).
Remove `GalleryFilterProps` (no longer used).

### `packages/types/src/index.ts` (MODIFY)

Add:
```typescript
export * from './nail-options';
```

---

## Impact Analysis

Files that import from `@repo/types/gallery` or reference `GalleryCategory`/`GalleryFilterProps`:

**Client:**
- `apps/client/src/pages/GalleryPage.tsx` — uses `GalleryItem.nailShape`/`.style` ✓ no enum change needed
- `apps/client/src/hooks/useGalleryPage.ts` — no category import
- `apps/client/src/services/gallery.service.ts` — no enum import

**Admin:**
- `apps/admin/src/components/gallery/GalleryFormModal.tsx` — uses `galleryItem.category` — **must update in Phase 05**
- `apps/admin/src/components/gallery/gallery-items-tab.tsx` — uses `item.category` for count — **must update in Phase 05**

**API:**
- `apps/api/src/modules/gallery/dto/create-gallery.dto.ts` — has own `GalleryCategory` enum (not from @repo/types) — updated in Phase 02

---

## Todo List

- [ ] Create `packages/types/src/nail-options.ts`
- [ ] Modify `packages/types/src/gallery.ts` — remove `category`, remove enums
- [ ] Modify `packages/types/src/index.ts` — add nail-options export
- [ ] Run `npm run type-check` from root — fix any errors

---

## Success Criteria

- `npm run type-check` passes with 0 errors
- `NailShapeItem` and `NailStyleItem` importable from `@repo/types/nail-options`
- `GalleryItem.category` no longer exists in type
- `GalleryItem.nailShape` is `string | undefined` (not enum)
