# Phase 05 — Admin: Update Gallery Form

**Date:** 2026-02-19
**Status:** pending — depends on Phase 03

---

## Objective

Update admin gallery form to replace the category dropdown with dynamic `nailShape` and `nailStyle` dropdowns fetched from API. Remove all category references from gallery admin components.

---

## Files to Modify

| File | Change |
|---|---|
| `apps/admin/src/components/gallery/GalleryFormModal.tsx` | Replace category dropdown with nailShape + nailStyle dropdowns |
| `apps/admin/src/components/gallery/gallery-items-tab.tsx` | Remove category filter and category count logic |
| `apps/admin/src/pages/GalleryPage.tsx` | Remove categories prop/state passed to GalleryItemsTab/GalleryFormModal |

---

## GalleryFormModal Changes

Current schema has `category: z.string().min(1)` — replace with:
```typescript
const gallerySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  price: z.string().max(20).optional(),
  duration: z.string().max(20).optional(),
  featured: z.boolean(),
  nailShape: z.string().optional(),
  nailStyle: z.string().optional(),
});
```

Props change — remove `categories: GalleryCategoryItem[]`, add:
```typescript
type GalleryFormModalProps = {
  galleryItem?: GalleryItem;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
  // categories REMOVED
};
```

Inside form, fetch nail options internally:
```typescript
const { data: shapesData } = useNailShapes();
const { data: stylesData } = useNailStyles();
const shapes = shapesData?.data?.filter(s => s.isActive) ?? [];
const styles = stylesData?.data?.filter(s => s.isActive) ?? [];
```

Replace category `<Select>` with two optional `<Select>` fields:
- "Nail Shape (Optional)" — options from `shapes`, value = `shape.value`
- "Nail Style (Optional)" — options from `styles`, value = `style.value`

Update `useEffect` for edit mode — populate `nailShape`/`nailStyle` from `galleryItem`.

Update `onSubmit`:
- Edit mode: send `{ nailShape, nailStyle, title, description, ... }`
- Create mode: append `nailShape`/`nailStyle` to `FormData` (only if set)
- Remove `category` from both paths

---

## GalleryItemsTab Changes

Current tab uses `categories` prop for the `<CategoryFilter>` component and for counting items per category. After this phase, categories are removed from gallery items.

Remove:
- `categories: GalleryCategoryItem[]` from props
- `<CategoryFilter>` card entirely
- `activeCategory` state + `categoryId` filter param
- `categoryCounts` useMemo

The tab becomes simpler — just search + grid. The `useInfiniteGalleryItems` call loses the `categoryId` param.

Updated props:
```typescript
type GalleryItemsTabProps = {
  onCreateItem: () => void;
  onDeleteItem: (item: GalleryItem) => void;
  onEditItem: (item: GalleryItem) => void;
  // categories REMOVED
};
```

Optionally add nailShape/nailStyle filter dropdowns to the tab header for admin filtering (nice-to-have, not required for MVP).

---

## GalleryPage Changes

`apps/admin/src/pages/GalleryPage.tsx`

- Remove `useGalleryCategories()` import and usage
- Remove `categories` state
- Remove categories prop from `<GalleryItemsTab>` and `<GalleryFormModal>`
- Gallery page still has "Categories" tab (managed separately via GalleryCategoriesTab) — keep that tab for backward compat but note it's decoupled from gallery items

---

## Todo List

- [ ] Update `GalleryFormModal.tsx` — remove category, add nailShape/nailStyle selects
- [ ] Update `gallery-items-tab.tsx` — remove category filter, remove categories prop
- [ ] Update `GalleryPage.tsx` — remove categories fetch, update component props
- [ ] Verify no TypeScript errors after changes
- [ ] Verify create/edit flow works end-to-end

---

## Success Criteria

- Gallery form shows "Nail Shape" and "Nail Style" optional dropdowns
- Dropdowns are populated from API (dynamic, not hardcoded)
- Creating/editing gallery item saves nailShape/nailStyle correctly
- Admin gallery items tab loads without category filter (search still works)
- No TypeScript errors
