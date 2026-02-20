# Phase 01 — Grid Layout

**Date:** 2026-02-19
**Priority:** High
**Status:** Pending

---

## Context

- `apps/client/src/pages/GalleryPage.tsx`
- `apps/client/src/index.css`

---

## Overview

Increase masonry columns from max-3 to 5 (desktop), widen page container, tighten CSS gaps for a denser Pinterest feel.

---

## Key Insights

- Current `breakpointColumns` object keys are `px` breakpoints — react-masonry-css applies `key` as `max-width`. The `default` value fires above the largest key.
- Current max-w-6xl = 72rem (~1152px). At 5 cols with `gap-2.5` (10px), each col ≈ 218px — workable for nail photos (portrait-oriented).
- `max-w-7xl` = 80rem (~1280px) gives each col ≈ 243px with same gap.
- CSS gap currently `gap-6` (24px) — reduce to `gap-2.5` (10px) to match Pinterest density.

---

## Requirements

- Default (>1280px): 5 columns
- 1280px breakpoint: 4 columns
- 1024px breakpoint: 3 columns
- 640px breakpoint: 2 columns
- <640px: 2 columns (mobile keeps 2 per design intent)
- Container: `max-w-6xl` → `max-w-7xl`
- Gap: `gap-6` → `gap-2.5` on both `.masonry-grid` and `.masonry-column`
- Skeleton count: 12 → 15 (fills 3 rows at 5 cols)

---

## Related Code Files

- `apps/client/src/pages/GalleryPage.tsx` — lines 52–56 (breakpointColumns), line 67 (container), line 143 (skeleton count)
- `apps/client/src/index.css` — lines 239–272 (masonry CSS)

---

## Implementation Steps

### Step 1 — Update `breakpointColumns` in `GalleryPage.tsx`

**Before (lines 52–56):**
```tsx
const breakpointColumns = {
  1024: 2,
  640: 2,
  default: 3,
};
```

**After:**
```tsx
const breakpointColumns = {
  1280: 4,  // 1024–1280px → 4 cols
  1024: 3,  // 640–1024px  → 3 cols
  640: 2,   // <640px      → 2 cols
  default: 5, // >1280px  → 5 cols
};
```

### Step 2 — Widen container in `GalleryPage.tsx`

**Before (line 67):**
```tsx
<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
```

**After:**
```tsx
<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
```

### Step 3 — Increase skeleton count in `GalleryPage.tsx`

**Before (line 143):**
```tsx
{Array.from({ length: 12 }).map((_, i) => (
```

**After:**
```tsx
{Array.from({ length: 15 }).map((_, i) => (
```

### Step 4 — Update CSS gaps in `index.css`

**Before (lines 239–272):**
```css
.masonry-grid {
  @apply flex w-full gap-6;
}

.masonry-column {
  @apply flex flex-col gap-6;
  background-clip: padding-box;
}

@media (max-width: 640px) {
  .masonry-grid { @apply gap-3; }
  .masonry-column { @apply gap-3; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .masonry-grid { @apply gap-4; }
  .masonry-column { @apply gap-4; }
}
```

**After:**
```css
.masonry-grid {
  @apply flex w-full gap-2.5;
}

.masonry-column {
  @apply flex flex-col gap-2.5;
  background-clip: padding-box;
}

@media (max-width: 640px) {
  .masonry-grid { @apply gap-2; }
  .masonry-column { @apply gap-2; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .masonry-grid { @apply gap-2.5; }
  .masonry-column { @apply gap-2.5; }
}
```

---

## Todo

- [ ] Update `breakpointColumns` object (4 entries)
- [ ] Change `max-w-6xl` → `max-w-7xl` on container div
- [ ] Update skeleton count 12 → 15
- [ ] Update `.masonry-grid` gap `gap-6` → `gap-2.5`
- [ ] Update `.masonry-column` gap `gap-6` → `gap-2.5`
- [ ] Update responsive gap overrides (mobile: `gap-2`, tablet: `gap-2.5`)

---

## Success Criteria

- Desktop (>1280px): 5 columns render with ~10px gutters
- 1280px viewport: 4 columns
- 1024px viewport: 3 columns
- 640px viewport: 2 columns
- No horizontal overflow on any breakpoint
- Skeleton renders 15 items (3 rows at 5 cols)

---

## Risk Assessment

- **Low**: breakpointColumns is a simple object swap — react-masonry-css is stable
- **Low**: `max-w-7xl` is a Tailwind default class, no config change needed
- **Low**: CSS gap reduction — purely visual, no layout breakage

---

## Security Considerations

None — layout-only change.

---

## Next Steps

Phase 02 — GalleryCard redesign.
