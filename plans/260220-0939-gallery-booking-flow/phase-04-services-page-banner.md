# Phase 04 — ServicesPage: Context Banner

## Context Links

- Plan: [plan.md](./plan.md)
- Phase 01 (types): [phase-01-type-system.md](./phase-01-type-system.md)
- Phase 02 (entry points): [phase-02-gallery-entry-points.md](./phase-02-gallery-entry-points.md)
- File: `apps/client/src/pages/ServicesPage.tsx`

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-20 |
| Description | Show a gallery-context banner on `/services` when navigated from gallery, with thumbnail + design title |
| Priority | Medium — UX polish, required by acceptance criteria |
| Implementation status | completed |
| Review status | completed |

---

## Key Insights

Current `ServicesPage` (128 lines) never calls `useLocation`. No banner exists. The page uses `useServicesPage` hook for all data logic — keeping the banner logic inline in the page is acceptable given its simplicity (no state, no data fetch, pure render from `location.state`).

Client design system constraints:
- Border-based, NO shadows (`shadow-*` classes forbidden)
- Warm, organic shapes: `rounded-[20px]` / `rounded-[16px]` preferred
- Colors: `border-secondary`, `bg-card`, `text-muted-foreground`, `text-foreground`
- Font: `font-sans` for body, `font-serif` for headings
- Pattern: match the existing `GalleryItem` preview block in `BookingPage.tsx` (lines 212-237) — same visual language

Reference from `BookingPage.tsx` step 1 gallery preview (lines 213-237):
```tsx
<div className="rounded-[16px] border-2 border-secondary bg-card p-3">
  <div className="flex gap-4">
    <img className="h-20 w-20 rounded-[12px] object-cover" ... />
    <div>
      <p className="font-sans text-xs text-muted-foreground">Thiết Kế Đã Chọn</p>
      <h4 className="font-serif text-base font-semibold text-foreground">{galleryItem.title}</h4>
      <p className="font-sans text-xs text-muted-foreground">{galleryItem.description}</p>
    </div>
  </div>
</div>
```

Reuse this exact visual pattern — consistency with BookingPage and zero new design decisions.

---

## Requirements

1. `useLocation()` added to `ServicesPage`.
2. `isValidServicesState(location.state)` → extract `galleryItem`.
3. If `galleryItem` present, render banner between `PageHeader` and category filter strip.
4. Banner shows: thumbnail (48x48 or 56x56), label "Đặt lịch theo thiết kế:", design title.
5. Banner must not render when state is absent (direct `/services` visit).
6. No Motion animation required (static render is fine — KISS).
7. No shadows. Border-based styling only.

---

## Architecture

### Banner markup (inline in ServicesPage)

```tsx
{/* Gallery Context Banner — only shown when navigated from gallery */}
{galleryItem && (
  <div className="mb-8 rounded-[16px] border-2 border-secondary bg-card p-4">
    <div className="flex items-center gap-4">
      <img
        src={galleryItem.imageUrl}
        alt={galleryItem.title}
        className="h-14 w-14 flex-shrink-0 rounded-[10px] object-cover"
      />
      <div>
        <p className="font-sans text-xs font-medium text-muted-foreground">
          Đặt lịch theo thiết kế:
        </p>
        <p className="font-serif text-base font-semibold text-foreground">
          {galleryItem.title}
        </p>
      </div>
    </div>
  </div>
)}
```

### Placement in ServicesPage JSX

Insert between `<PageHeader ... />` (line 35-38) and the category filter `<div>` (line 41). This gives the user context before they choose a category/service.

### Full diff overview for ServicesPage.tsx

```typescript
// Add imports:
import { useLocation } from "react-router-dom";               // add to existing react-router-dom import
import type { GalleryItem } from "@/types";                   // add type import
import { isValidServicesState } from "@/types/navigation";    // add function import

// Inside ServicesPage():
const location = useLocation();
const galleryItem: GalleryItem | null = isValidServicesState(location.state)
  ? location.state.galleryItem
  : null;

// In JSX — after <PageHeader />, before category filter:
{galleryItem && (
  <div className="mb-8 rounded-[16px] border-2 border-secondary bg-card p-4">
    <div className="flex items-center gap-4">
      <img
        src={galleryItem.imageUrl}
        alt={galleryItem.title}
        className="h-14 w-14 flex-shrink-0 rounded-[10px] object-cover"
      />
      <div>
        <p className="font-sans text-xs font-medium text-muted-foreground">
          Đặt lịch theo thiết kế:
        </p>
        <p className="font-serif text-base font-semibold text-foreground">
          {galleryItem.title}
        </p>
      </div>
    </div>
  </div>
)}
```

---

## Related Code Files

- `apps/client/src/pages/ServicesPage.tsx` — modify
- `apps/client/src/types/navigation.ts` — source of `isValidServicesState` (Phase 01)
- `apps/client/src/pages/BookingPage.tsx` — visual reference for gallery item preview panel

---

## Implementation Steps

1. Add `useLocation` to `react-router-dom` import line.
2. Add `import type { GalleryItem } from "@/types";`.
3. Add `import { isValidServicesState } from "@/types/navigation";`.
4. Inside `ServicesPage()`, after hook calls, add `const galleryItem` derivation.
5. Insert banner JSX between `<PageHeader />` and category filter `<div>`.
6. Run `npm run type-check`.
7. Manual test: navigate from gallery → verify banner shows. Navigate to `/services` directly → verify banner absent.

---

## Todo List

- [ ] Add `useLocation` import
- [ ] Add `GalleryItem` type import
- [ ] Add `isValidServicesState` import
- [ ] Add `galleryItem` derivation inside component
- [ ] Insert banner JSX in correct position
- [ ] Verify banner absent on direct `/services` visit
- [ ] Run `npm run type-check`

---

## Success Criteria

- Banner renders with thumbnail + "Đặt lịch theo thiết kế: [title]" when `location.state` is valid gallery state
- Banner not rendered on direct visits
- No shadows, border-based styling consistent with client design system
- Matches visual language of BookingPage gallery preview panel
- No TS errors
- `ServicesPage` remains under 200-line limit (currently 128 lines; banner adds ~15 lines → ~143 lines — safe)

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Banner flickers on re-render | None | `location.state` is synchronous, no async derivation |
| Image load failure | Low | Browser shows broken image — acceptable; no loading state needed (KISS) |
| `galleryItem.imageUrl` undefined | Very low | `GalleryItem` type has `imageUrl: string` — not optional |
| State persists after back-navigation to different gallery item | None | React Router replaces state on each `navigate("/services", { state })` call |

---

## Security Considerations

- `isValidServicesState` guard prevents rendering arbitrary data from `location.state`.
- `galleryItem.imageUrl` is a Cloudinary URL from the API — safe to render in `<img src>`.
- No user-supplied HTML is rendered — only text via React's DOM escaping.

---

## Next Steps

This is the final phase. After implementation, run the full acceptance criteria checklist from `plan.md`. No further phases required.
