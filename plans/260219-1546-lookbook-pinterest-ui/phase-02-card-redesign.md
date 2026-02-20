# Phase 02 — GalleryCard Pinterest Redesign

**Date:** 2026-02-19
**Priority:** High
**Status:** Pending

---

## Context

- `apps/client/src/components/gallery/GalleryCard.tsx`

---

## Overview

Strip card to image-only at rest. Move all info (title, description, price, duration, book action) into a hover overlay with dark gradient. Replace full-width "Đặt Lịch Ngay" button with a compact `CalendarCheck` icon button in a bottom-right vertical strip.

---

## Key Insights

- Current card: `border-2 border-secondary bg-card p-2 rounded-2xl` + content below image. Target: `rounded-xl overflow-hidden` with zero padding, no border.
- `isTouchDevice` guard currently hides the dusty-rose overlay entirely on mobile. New overlay is functional (shows info), so touch behavior needs a decision. For now: keep guard — touch users see image only; they can still tap the card to open modal.
- `handleSaveDesign` does nothing but `toast.info` — remove Heart button per YAGNI.
- Whole-card `onClick` → `onImageClick` (opens detail modal). Book icon uses `e.stopPropagation()` to intercept without triggering modal.
- `isTouchDevice` computed once per render via `"ontouchstart" in window` — keep as-is.
- Existing imports to remove: `Heart`, `DollarSign` (replaced by inline text). Keep: `Clock` removed too — replaced by inline text with `⏱` or just plain text. Actually keep `Clock` icon for duration — consistent with design.
- New import: `CalendarCheck` from `lucide-react`.
- Motion animation (`initial/animate`) on outer `motion.div` stays — still gives stagger entry.

---

## Requirements

- Card at rest: image only, no border, no background, no padding, `rounded-xl overflow-hidden`
- Image scale on hover: `group-hover:scale-105` (reduced from 110 — overlay needs to be readable)
- Hover overlay: `bg-gradient-to-t from-black/70 via-black/20 to-transparent`, `opacity-0 group-hover:opacity-100`, `transition-opacity duration-300`
- Title: top-left overlay, `font-serif text-sm font-semibold text-white`, max 2 lines (`line-clamp-2`)
- Description: below title, `font-sans text-xs text-white/70 line-clamp-2`
- Bottom-right strip (vertical, `flex-col items-end gap-1`):
  - Price: `text-white text-xs font-semibold` (with `$` prefix if value present)
  - Duration: `text-white/80 text-xs` (with `Clock` icon `size-3` inline)
  - `CalendarCheck` icon button: `size-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40`, `aria-label="Đặt lịch ngay"`
- Remove: `Heart` button, `DollarSign` import, full-width `Button` "Đặt Lịch Ngay"
- Keep: `onImageClick` on whole card (`div` wrapper), `handleBookNow` logic unchanged
- Accessibility: `role="button" tabIndex={0}` on outer card, `aria-label` on CalendarCheck button
- Touch: keep `isTouchDevice` — overlay CSS only applies on hover (works correctly on desktop)

---

## Architecture

```
<motion.div>                          ← entry animation wrapper, no styling
  <div role="button" tabIndex={0}     ← whole-card click → onImageClick
    className="group relative cursor-pointer overflow-hidden rounded-xl">

    <LazyImage />                     ← fills 100%, group-hover:scale-105

    {/* Hover overlay — only non-touch */}
    {!isTouchDevice && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                      bg-gradient-to-t from-black/70 via-black/20 to-transparent">

        {/* Top area: title + description */}
        <div className="absolute top-3 left-3 right-14">
          <h3 className="font-serif text-sm font-semibold text-white line-clamp-2">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-0.5 font-sans text-xs text-white/70 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom-right: price → duration → book icon */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
          {item.price && (
            <span className="font-sans text-xs font-semibold text-white">
              {item.price}
            </span>
          )}
          {item.duration && (
            <span className="flex items-center gap-0.5 font-sans text-xs text-white/80">
              <Clock className="size-3" />
              {item.duration}
            </span>
          )}
          <button
            aria-label="Đặt lịch ngay"
            className="mt-0.5 flex size-8 items-center justify-center rounded-full
                       bg-white/20 backdrop-blur-sm transition-colors
                       hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-white"
            onClick={(e) => { e.stopPropagation(); handleBookNow(); }}
          >
            <CalendarCheck className="size-4 text-white" />
          </button>
        </div>

      </div>
    )}
  </div>
</motion.div>
```

---

## Related Code Files

- `apps/client/src/components/gallery/GalleryCard.tsx` — full rewrite (same file)
- `apps/client/src/components/shared/LazyImage.tsx` — `placeholderClassName` prop; remove `rounded-[12px]` since parent has `overflow-hidden`

---

## Implementation Steps

### Step 1 — Update imports

**Before (line 3):**
```tsx
import { Clock, DollarSign, Heart } from "lucide-react";
```

**After:**
```tsx
import { CalendarCheck, Clock } from "lucide-react";
```

### Step 2 — Remove unused handler

Delete `handleSaveDesign` function (lines 53–57) entirely.

### Step 3 — Replace JSX

**Before (line 60–176):** full card with border, padding, content section

**After (complete replacement of the `return` statement):**
```tsx
return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      damping: 30,
      delay: index * 0.05,
      stiffness: 300,
      type: "spring",
    }}
  >
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl"
      onClick={onImageClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onImageClick?.();
        }
      }}
    >
      <LazyImage
        alt={item.title}
        className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        src={item.imageUrl}
      />

      {!isTouchDevice && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
                     opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          {/* Title + description — top area */}
          <div className="absolute top-3 left-3 right-14">
            <h3 className="font-serif text-sm font-semibold text-white line-clamp-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-0.5 font-sans text-xs text-white/70 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Action strip — bottom-right */}
          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
            {item.price && (
              <span className="font-sans text-xs font-semibold text-white">
                {item.price}
              </span>
            )}
            {item.duration && (
              <span className="flex items-center gap-0.5 font-sans text-xs text-white/80">
                <Clock className="size-3" />
                {item.duration}
              </span>
            )}
            <button
              aria-label="Đặt lịch ngay"
              className="mt-0.5 flex size-8 items-center justify-center rounded-full
                         bg-white/20 backdrop-blur-sm transition-colors
                         hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-white"
              onClick={(e) => {
                e.stopPropagation();
                handleBookNow();
              }}
            >
              <CalendarCheck className="size-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);
```

### Step 4 — Remove `placeholderClassName` from `LazyImage`

**Before (line 88):**
```tsx
placeholderClassName="rounded-[12px] md:rounded-[16px]"
```

**After:** remove this prop entirely (parent `overflow-hidden` handles clipping).

### Step 5 — Remove unused `Button` import

**Before:**
```tsx
import { Button } from "@/components/ui/button";
```

**After:** delete this import line (Button no longer used).

---

## Todo

- [ ] Update lucide-react imports: replace `DollarSign, Heart` with `CalendarCheck`
- [ ] Remove `handleSaveDesign` function
- [ ] Remove `Button` import
- [ ] Rewrite `return` JSX (remove border/padding/bg-card structure)
- [ ] Remove `placeholderClassName` prop on `LazyImage`
- [ ] Verify `handleBookNow` logic untouched
- [ ] Verify keyboard nav on outer div (`Enter`/`Space` triggers `onImageClick`)
- [ ] Verify `e.stopPropagation()` on book icon button

---

## Success Criteria

- Card at rest: image only, no visible border/padding/background
- Hover: gradient overlay appears, title + description + price + duration + icon visible
- Book icon click: navigates to `/booking` without opening modal
- Card click (non-icon area): opens `GalleryDetailModal`
- Touch device: overlay hidden, image-only (no regression)
- No TypeScript errors (no unused imports)

---

## Risk Assessment

- **Low**: `handleBookNow` logic is unchanged — booking navigation unaffected
- **Medium**: `isTouchDevice` check hides all overlay on mobile — touch users have no way to book from gallery card. Acceptable per scope; known limitation in plan.md Q2.
- **Low**: `line-clamp-2` requires Tailwind — already in project (`@tailwindcss/line-clamp` or built-in v3.3+; check Tailwind version)

---

## Security Considerations

None — no new data fetching, no user input, no auth changes.

---

## Next Steps

Phase 03 — Skeleton update.
