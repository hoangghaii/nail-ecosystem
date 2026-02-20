# Phase 03 — Skeleton Update

**Date:** 2026-02-19
**Priority:** Low
**Status:** Pending

---

## Context

- `apps/client/src/components/shared/skeletons/GalleryItemSkeleton.tsx`

---

## Overview

The current skeleton has a fixed `h-80` height and a `border border-border` — matching the old card's border style. After Phase 02, cards have no border and variable image heights. The skeleton should reflect the new image-only style.

---

## Key Insights

Current skeleton (line 11):
```tsx
className={cn(
  "h-80 bg-muted/50 rounded-md border border-border animate-pulse",
  className,
)}
```

Problems with current:
1. `border border-border` — old card had border; new card does not → remove
2. `rounded-md` — new card uses `rounded-xl` → update to match
3. `h-80` (320px) — fixed height is fine for skeleton since masonry doesn't know image heights upfront anyway; however, variable heights look more Pinterest-like

**Variable height approach**: Pass an optional `height` prop or use a predefined set of heights. Since skeletons are rendered in a loop with index `i`, use `i % 3` to cycle through 3 heights: tall (h-72), medium (h-56), short (h-44). This mimics the organic masonry feel without real data.

---

## Requirements

- Remove `border border-border`
- Change `rounded-md` → `rounded-xl` (matches new card)
- Variable heights based on index: add optional `index` prop, use `index % 3` to pick height
- Default height fallback if no index: `h-64`
- Keep `bg-muted/50 animate-pulse` unchanged
- Keep `aria-label` and `role="status"`

---

## Related Code Files

- `apps/client/src/components/shared/skeletons/GalleryItemSkeleton.tsx` — full file (18 lines)
- `apps/client/src/pages/GalleryPage.tsx` — line 143–145, pass `index={i}` to skeleton

---

## Implementation Steps

### Step 1 — Update `GalleryItemSkeleton.tsx`

**Before (full file):**
```tsx
import { cn } from "@repo/utils/cn";

interface GalleryItemSkeletonProps {
  className?: string;
}

export function GalleryItemSkeleton({ className }: GalleryItemSkeletonProps) {
  return (
    <div
      className={cn(
        "h-80 bg-muted/50 rounded-md border border-border animate-pulse",
        className,
      )}
      aria-label="Loading gallery item"
      role="status"
    />
  );
}
```

**After:**
```tsx
import { cn } from "@repo/utils/cn";

interface GalleryItemSkeletonProps {
  className?: string;
  index?: number;
}

const SKELETON_HEIGHTS = ["h-72", "h-56", "h-44"] as const;

export function GalleryItemSkeleton({ className, index }: GalleryItemSkeletonProps) {
  const heightClass =
    index !== undefined ? SKELETON_HEIGHTS[index % 3] : "h-64";

  return (
    <div
      className={cn(
        "rounded-xl bg-muted/50 animate-pulse",
        heightClass,
        className,
      )}
      aria-label="Loading gallery item"
      role="status"
    />
  );
}
```

### Step 2 — Pass `index` prop in `GalleryPage.tsx`

**Before (line 143–145):**
```tsx
{Array.from({ length: 15 }).map((_, i) => (
  <GalleryItemSkeleton key={i} />
))}
```

**After:**
```tsx
{Array.from({ length: 15 }).map((_, i) => (
  <GalleryItemSkeleton key={i} index={i} />
))}
```

---

## Todo

- [ ] Remove `border border-border` from skeleton className
- [ ] Change `rounded-md` → `rounded-xl`
- [ ] Remove fixed `h-80`, add `index?: number` prop
- [ ] Add `SKELETON_HEIGHTS` const array
- [ ] Compute `heightClass` from `index % 3`
- [ ] Update `GalleryPage.tsx` skeleton render to pass `index={i}`

---

## Success Criteria

- Skeletons render without border
- Skeletons cycle through 3 heights (h-72, h-56, h-44) per index
- `rounded-xl` matches new card corner radius
- No TypeScript errors (new prop is optional with default fallback)

---

## Risk Assessment

- **Low**: purely visual change, no logic/data impact
- **Low**: `index` prop is optional — existing usages without index still work (fall back to `h-64`)

---

## Security Considerations

None.

---

## Next Steps

After all 3 phases: verify with `npm run type-check` then test in browser at multiple breakpoints.
