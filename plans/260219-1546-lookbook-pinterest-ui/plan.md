# Plan: Lookbook Pinterest UI Redesign

**Date:** 2026-02-19
**Priority:** Medium
**Status:** Pending
**Directory:** `plans/260219-1546-lookbook-pinterest-ui/`

---

## Overview

Redesign `/gallery` (Lookbook) to a Pinterest-style masonry grid:
- 4–5 columns (up from 3)
- Image-only cards at rest — no border, no padding, no content below
- Hover overlay reveals: title, description, price, duration, booking icon
- Bottom-right vertical action strip: price → duration → `CalendarCheck` icon

**Scope**: 3 files changed, 1 CSS block updated. No new dependencies.

---

## Phases

| # | File | Change |
|---|------|--------|
| 01 | `GalleryPage.tsx` + `index.css` | 4-5 col grid, wider container, tighter gaps |
| 02 | `GalleryCard.tsx` | Pinterest card redesign |
| 03 | `GalleryItemSkeleton.tsx` | Image-only skeleton, variable heights |

---

## Key Decisions

- **Container**: `max-w-6xl` → `max-w-7xl` (keeps padding, fits 5 cols comfortably)
- **Mobile**: 2 cols at `<640px` (unchanged), 1 col if `<380px` — see unresolved Q1
- **isTouchDevice guard**: Keep — overlay hidden on touch, fallback needed (see Q2)
- **Heart save button**: Remove — YAGNI (unimplemented, placeholder toast)
- **Whole-card click** opens modal; `e.stopPropagation()` on book icon only
- **CSS gaps**: `.masonry-grid` `gap-6` → `gap-2.5`, `.masonry-column` `gap-2.5`

---

## Files

- `phase-01-grid-layout.md`
- `phase-02-card-redesign.md`
- `phase-03-skeleton-update.md`

---

## Unresolved Questions

1. **Mobile 1-col?** At `<380px`, 2 cols may be too narrow for overlay text — add breakpoint `380: 1` or keep 2?
2. **Touch device overlay**: `isTouchDevice` currently shows no overlay at all. Pinterest tap = show overlay. Should tap toggle overlay visibility on mobile?
3. **`handleSaveDesign` Heart button**: Remove entirely or keep hidden (no UI) for future use?
4. **Overlay text truncation**: `item.description` can be long — truncate to 2 lines (`line-clamp-2`) or omit on small cards?
5. **`placeholderClassName`** on `LazyImage` currently sets `rounded-[12px]` — remove since card now has `overflow-hidden` on parent.
