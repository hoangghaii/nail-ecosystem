# Phase 06b — Client: UI Component Updates

**Parent:** [phase-06-client-dynamic-filters.md](./phase-06-client-dynamic-filters.md)
**Date:** 2026-02-19

---

## GalleryPage.tsx Changes

`apps/client/src/pages/GalleryPage.tsx`

### Remove

```typescript
import { NAIL_SHAPES, NAIL_STYLES } from "@/data/filter-config";

// These local states move into useGalleryPage:
const [selectedShape, setSelectedShape] = useState("all");
const [selectedStyle, setSelectedStyle] = useState("all");

// Remove client-side filter — server does it now:
const filteredGallery = useMemo(() => {
  return galleryItems.filter((item: GalleryItem) => { ... });
}, [galleryItems, selectedShape, selectedStyle]);
```

Also remove: category filter buttons section (the `categories.map(...)` block) — no longer relevant.

### Add

```typescript
import { useNailShapes, useNailStyles } from "@/hooks/api/useNailOptions";

const { data: nailShapes = [] } = useNailShapes();
const { data: nailStyles = [] } = useNailStyles();

// Destructure new state from hook:
const { ..., selectedShape, setSelectedShape, selectedStyle, setSelectedStyle } = useGalleryPage();
```

### Update FilterPills

Build filter arrays dynamically — prepend "All" option:

```tsx
const shapeFilters = [
  { slug: 'all', label: 'Tất Cả' },
  ...nailShapes.map(s => ({ slug: s.value, label: s.labelVi })),
];
const styleFilters = [
  { slug: 'all', label: 'Tất Cả' },
  ...nailStyles.map(s => ({ slug: s.value, label: s.labelVi })),
];

<FilterPills
  filters={shapeFilters}
  selected={selectedShape ?? 'all'}
  onSelect={v => setSelectedShape(v === 'all' ? undefined : v)}
/>
<FilterPills
  filters={styleFilters}
  selected={selectedStyle ?? 'all'}
  onSelect={v => setSelectedStyle(v === 'all' ? undefined : v)}
/>
```

### Update galleryItems usage

Use `galleryItems` directly from hook (server-filtered) — no local `filteredGallery`:

```tsx
// BEFORE: filteredGallery.map(...)
// AFTER:  galleryItems.map(...)
```

Update reset button condition:
```tsx
{(selectedShape || selectedStyle) && (
  <button onClick={() => { setSelectedShape(undefined); setSelectedStyle(undefined); }}>
    Xóa Bộ Lọc
  </button>
)}
```

---

## Delete filter-config.ts

Delete `apps/client/src/data/filter-config.ts` after confirming no other imports remain.

Check for remaining imports:
```bash
grep -r "filter-config" apps/client/src
```

---

## Todo List

- [ ] Remove hardcoded imports and local filter state from `GalleryPage.tsx`
- [ ] Remove client-side `filteredGallery` useMemo
- [ ] Remove category filter buttons from `GalleryPage.tsx`
- [ ] Add `useNailShapes`/`useNailStyles` calls
- [ ] Build `shapeFilters`/`styleFilters` arrays dynamically
- [ ] Update `FilterPills` to use dynamic arrays
- [ ] Update `galleryItems` usage (remove `filteredGallery`)
- [ ] Update reset button to use `undefined` not `"all"`
- [ ] Delete `apps/client/src/data/filter-config.ts`
- [ ] Grep for any remaining `filter-config` imports

---

## Success Criteria

- Filter pills render from API data
- Shape/style selection re-fetches from server with filter params
- Reset button clears both filters and re-fetches all
- `filter-config.ts` deleted, no broken imports
