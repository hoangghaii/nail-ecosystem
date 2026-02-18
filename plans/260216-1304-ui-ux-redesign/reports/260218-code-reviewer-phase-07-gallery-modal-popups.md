# Code Review Report: Phase 07 Gallery Modal Popups

**Date**: 2026-02-18
**Reviewer**: Code Reviewer Agent
**Scope**: Phase 7 Gallery Modal Popups — `GalleryDetailModal`, `gallery-modal-image-panel`, `gallery-modal-details-panel`, `GalleryPage` changes
**Status**: APPROVED WITH REQUIRED FIX

---

## Code Review Summary

### Scope
- Files reviewed: 5
  - `apps/client/src/components/gallery/GalleryDetailModal.tsx` (110 lines)
  - `apps/client/src/components/gallery/gallery-modal-image-panel.tsx` (65 lines)
  - `apps/client/src/components/gallery/gallery-modal-details-panel.tsx` (87 lines)
  - `apps/client/src/pages/GalleryPage.tsx` (194 lines)
  - `apps/client/src/hooks/useGalleryPage.ts` (75 lines — context read)
- Lines of code analyzed: ~531
- Review focus: Phase 7 new files + GalleryPage diff
- Updated plans: `phase-07-gallery-modal-popups.md`

### Overall Assessment

Solid implementation. The `forceMount + AnimatePresence` pattern with Radix `DialogPrimitive` is correctly applied. Type safety is clean (TypeScript strict mode passes). The booking integration pattern is correct. One lint error (import ordering) must be fixed before merge. One logic bug in `hasNext`/`hasPrevious` props silently navigates out-of-bounds relative to client-side filtered gallery. One medium concern: duplicate `useServices` API call (same pattern from Phase 6, React Query deduplicates, acceptable). The old `ImageLightbox.tsx` is still present but no longer referenced — dead file, should be deleted.

---

## Critical Issues

### NONE

---

## High Priority Findings

### HIGH #1: Lint Error — `perfectionist/sort-imports` violation (BLOCKS MERGE)

**File**: `apps/client/src/components/gallery/GalleryDetailModal.tsx:6`

**Lint output**:
```
error  Expected "@repo/types/service" (type-import) to come before "sonner" (value-external)  perfectionist/sort-imports
```

**Root cause**: `import type { Service }` (monorepo type) is placed after `import { toast } from "sonner"` (external). The project's ESLint config (perfectionist) requires `@repo/*` type imports to be sorted before value imports from external packages.

**Fix** — reorder imports in `GalleryDetailModal.tsx`:
```typescript
// CORRECT ORDER:
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { Service } from "@repo/types/service";   // ← move before @/types

import type { GalleryItem } from "@/types";

import { useServices } from "@/hooks/api/useServices";

import { GalleryModalDetailsPanel } from "./gallery-modal-details-panel";
import { GalleryModalImagePanel } from "./gallery-modal-image-panel";
```

**Impact**: CI lint gate failure. Must fix before commit.

---

### HIGH #2: `hasNext`/`hasPrevious` Logic Bug — Silent Out-of-Bounds Navigation

**File**: `apps/client/src/pages/GalleryPage.tsx:175-176`

**Current code**:
```typescript
hasNext={filteredGallery.length > 1}
hasPrevious={filteredGallery.length > 1}
```

**Problem**: `useGalleryPage` maintains `currentIndex` and navigates via `galleryItems` (backend-filtered by category only). `GalleryPage` adds a second client-side filter (`selectedShape`, `selectedStyle`) producing `filteredGallery`. The two arrays are out of sync: `currentIndex` indexes into `galleryItems` (unfiltered by shape/style), but `hasNext`/`hasPrevious` reflect `filteredGallery.length`. If client-side filters are active, clicking Next/Previous navigates to items that are not visible in the current filtered view.

Additionally, the boundary check `length > 1` is wrong — it shows navigation arrows even when the currently selected item is the first or last item in the list. Should be position-aware (e.g., `currentIndex < filteredGallery.length - 1`).

**Impact**: User sees nav arrows when logically there is no next/prev; clicking navigates to a hidden item. Confusing UX, not a crash.

**Correct approach**: Either (a) propagate `currentIndex` from `useGalleryPage` to `GalleryPage` and compute relative to `filteredGallery`, or (b) lift all filtering into the hook so navigation stays consistent with displayed items.

`useGalleryPage` already exports `currentIndex`, it is just not consumed in `GalleryPage`:
```typescript
const { ..., currentIndex } = useGalleryPage();

// Then:
hasNext={currentIndex < filteredGallery.length - 1}
hasPrevious={currentIndex > 0}
```

This is still approximate (index mismatch when client filters active), but better than current. Full fix requires lifting client-side filters into the hook.

---

## Medium Priority Improvements

### MEDIUM #1: Dead File — `ImageLightbox.tsx` Not Deleted

**File**: `apps/client/src/components/gallery/ImageLightbox.tsx`

GalleryPage now imports `GalleryDetailModal` and `ImageLightbox` is no longer imported anywhere. The file is dead code. It also implements custom ESC/keyboard handling (`useEffect` + `document.addEventListener`) which is now redundant.

**Action**: Delete `apps/client/src/components/gallery/ImageLightbox.tsx`.

---

### MEDIUM #2: `useServices` Called in Both `GalleryCard` and `GalleryDetailModal`

Identical call in both components:
```typescript
const { data: services = [] } = useServices({ isActive: true });
```

React Query deduplicates the network request (same query key). No N+1 issue. However, `GalleryDetailModal` now holds a second instance of the same hook that `GalleryCard` also holds, and `GalleryCard` already performs the booking navigation independently. This means the modal's booking logic duplicates `GalleryCard.handleBookNow` exactly.

**Impact**: Low — React Query cache handles dedup. Acceptable for now. Future: lift services to `GalleryPage` level, pass as prop.

---

### MEDIUM #3: No Keyboard Arrow Navigation in `GalleryDetailModal`

`ImageLightbox` (replaced) had `ArrowLeft`/`ArrowRight` keyboard navigation via `useEffect`. `GalleryDetailModal` does not. Users who opened the modal and pressed arrow keys previously could navigate; now they cannot.

**Phase 7 plan requirement** (step 8): "ESC to close: handled by Radix Dialog automatically" — but arrow key navigation was an existing feature that is now regressed.

**Impact**: Regression in keyboard UX. Medium severity — not blocking production but should be addressed.

---

### MEDIUM #4: `style={{ maxHeight: "90vh" }}` Inline Style Should Be a Class

**File**: `GalleryDetailModal.tsx:85`

```tsx
style={{ maxHeight: "90vh" }}
```

Tailwind has `max-h-[90vh]`. Using inline style mixes styling approaches. Minor inconsistency, but violates the project's Tailwind-first standard.

**Fix**: Replace with `className="... max-h-[90vh]"`.

---

## Low Priority Suggestions

### LOW #1: `aria-labelledby` Not Wired on `DialogPrimitive.Content`

**File**: `GalleryDetailModal.tsx:77`, `gallery-modal-details-panel.tsx:41`

The plan specifies `aria-labelledby="gallery-modal-title"`. `DialogPrimitive.Title` is rendered with `id="gallery-modal-title"` in the details panel. However, `DialogPrimitive.Content` does not receive `aria-labelledby="gallery-modal-title"` explicitly. Radix Dialog does associate the title automatically via its internal `aria-labelledby` when using `DialogPrimitive.Title`, so this is handled by Radix internally. Confirmed correct — no action needed, just a note.

---

### LOW #2: `onClick={(e) => e.stopPropagation()}` on Modal Content — Redundant

**File**: `GalleryDetailModal.tsx:86`

Radix `DialogPrimitive.Content` already blocks pointer events from propagating to the overlay. The `stopPropagation` call is harmless but redundant.

---

### LOW #3: Image Panel Has No `aria-label` or `role` on Container

**File**: `gallery-modal-image-panel.tsx:22`

The image panel `<div>` has no semantic role. Screen readers will skip it. The `<img>` has an `alt` prop (`alt={item.title}`) which is correct, but a brief `aria-label` on the image region could improve screen reader narration (e.g., `"Image: {alt}"`). Low impact given the `alt` is present.

---

### LOW #4: `min-h` Set Both via Class and `style` on Image

**File**: `gallery-modal-image-panel.tsx:23-28`

```tsx
<div className="relative h-64 md:h-full">
  <img
    src={imageUrl}
    alt={alt}
    className="h-full w-full object-cover"
    style={{ minHeight: "16rem" }}   // ← redundant with parent h-64 (=16rem)
  />
```

Parent div already sets `h-64` (= `16rem`). The inline `minHeight: "16rem"` on the `<img>` is redundant. Remove inline style, use `min-h-64` if needed.

---

## Positive Observations

1. `forceMount + AnimatePresence` pattern: correctly implemented. Overlay and content are conditionally rendered inside `AnimatePresence` with distinct `key` values, enabling exit animations while Radix maintains portal mount state.
2. Radix `DialogPrimitive` focus trap + ESC: works correctly out of box; no custom `useEffect` keyboard listeners needed (unlike the old `ImageLightbox`).
3. `DialogPrimitive.Close` inside details panel: correct Radix pattern; automatically triggers `onOpenChange(false)` which calls `onClose`.
4. `DialogPrimitive.Title` rendered with `id` for ARIA: complies with accessibility spec.
5. `asChild` on `Overlay` and `Content`: correct usage allowing Motion to own DOM element.
6. Mobile-first: `flex-col` stacking on mobile, `flex-row` on `md+` — correct.
7. `handleBookDesign` guard on `!item`: defensive, prevents null deref.
8. Image panel nav arrows conditionally render only when callbacks are provided (double guard `hasPrevious && onPrevious`): correct.
9. `e.stopPropagation()` on nav arrow buttons prevents event bubbling to image area click handler.
10. Category-to-service matching + `toast.error` fallback: correct UX pattern matching Phase 7 requirements.

---

## Recommended Actions

1. **[REQUIRED before merge]** Fix lint: reorder `@repo/types/service` import in `GalleryDetailModal.tsx` per `perfectionist/sort-imports` rule.
2. **[REQUIRED before merge]** Fix `hasNext`/`hasPrevious` logic to use `currentIndex` from hook and `filteredGallery` boundaries.
3. **[RECOMMENDED]** Delete `apps/client/src/components/gallery/ImageLightbox.tsx` (dead file).
4. **[RECOMMENDED]** Restore arrow key navigation (`ArrowLeft`/`ArrowRight`) in `GalleryDetailModal` — regression from `ImageLightbox`.
5. **[LOW]** Replace `style={{ maxHeight: "90vh" }}` with `max-h-[90vh]` Tailwind class.
6. **[LOW]** Remove redundant `style={{ minHeight: "16rem" }}` in image panel.

---

## Metrics

- Type Coverage: 100% (TypeScript strict mode, 0 errors)
- Test Coverage: N/A (manual testing)
- Linting Issues: 1 error (import ordering in `GalleryDetailModal.tsx`)
- Build: Type-check PASS, Lint FAIL (1 error)

---

## Task Completeness Verification vs Phase 07 TODO List

| Todo Item | Status |
|-----------|--------|
| Check if ImageLightbox.tsx exists or create GalleryDetailModal.tsx | DONE — created GalleryDetailModal.tsx |
| Create two-column modal layout (image + details) | DONE |
| Add DialogTitle with font-serif styling | DONE |
| Add description section | DONE |
| Add metadata section (artist, polish, duration, price) | PARTIAL — artist/polish fields not in GalleryItem type, only price/duration shown |
| Handle missing metadata gracefully (conditional rendering) | DONE |
| Add "Đặt Lịch Theo Mẫu Này" CTA button | DONE |
| Implement handleBookDesign navigation handler | DONE |
| Connect button to navigation with state | DONE |
| Add Motion animations (zoom + fade) | DONE |
| Test ESC key closes modal | PENDING MANUAL TEST |
| Test click outside closes modal | PENDING MANUAL TEST |
| Test close button closes modal | PENDING MANUAL TEST |
| Test CTA navigates to booking | PENDING MANUAL TEST |
| Verify focus trap works (can't tab outside) | PENDING MANUAL TEST |
| Test on mobile (modal scrollable, responsive) | PENDING MANUAL TEST |
| Add ARIA labels for accessibility | DONE |
| Test with screen reader (VoiceOver/NVDA) | PENDING MANUAL TEST |

Note: `artist` and `polish` fields listed in plan metadata are not in the `GalleryItem` shared type (`packages/types/src/gallery.ts`). Only `price` and `duration` are available. This is acceptable — the type is the source of truth.

---

## Unresolved Questions

1. **Navigation index mismatch (HIGH #2)**: When client-side shape/style filters are active, `handleNext`/`handlePrevious` from `useGalleryPage` navigate through `galleryItems` (unfiltered by shape/style). Should filtering be fully moved into the hook, or should the modal disable navigation when client-side filters are active?

2. **Arrow key navigation regression**: Is the removal of `ArrowLeft`/`ArrowRight` keyboard navigation (present in `ImageLightbox`) intentional for Phase 7, or should it be restored?

3. **`ImageLightbox.tsx` retention**: Should it be kept as fallback or deleted? It is unreferenced; keeping it increases dead code surface.
