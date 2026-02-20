# Phase 02 — Gallery Entry Points: Pass Context to /services

## Context Links

- Plan: [plan.md](./plan.md)
- Phase 01 (type): [phase-01-type-system.md](./phase-01-type-system.md)
- Files: `apps/client/src/components/gallery/GalleryDetailModal.tsx`, `GalleryCard.tsx`

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-20 |
| Description | Both gallery "Book" entry points must pass `ServicesNavigationState` when navigating to `/services` |
| Priority | High |
| Implementation status | completed |
| Review status | completed |

---

## Key Insights

**GalleryDetailModal** (lines 44-49):
```typescript
const handleBookDesign = () => {
  if (!item) return;
  toast.info("Chọn dịch vụ phù hợp để đặt lịch cho thiết kế này.");  // remove
  navigate("/services");  // fix
  onClose();
};
```
- `item` (type `GalleryItem`) is already in scope.
- `toast.info` is now redundant — ServicesPage will render the banner instead.

**GalleryCard** (lines 24-27):
```typescript
const handleBookNow = () => {
  toast.info("Chọn dịch vụ phù hợp để đặt lịch cho thiết kế này.");  // remove
  navigate("/services");  // fix
};
```
- `item` prop (type `GalleryItem`) is already available in component scope.

Both fixes are mechanical — swap bare `navigate("/services")` for `navigate("/services", { state })`.

---

## Requirements

1. `GalleryDetailModal.handleBookDesign` navigates with `{ fromGallery: true, galleryItem: item }`.
2. `GalleryCard.handleBookNow` navigates with `{ fromGallery: true, galleryItem: item }`.
3. Remove `toast.info` calls from both (replaced by ServicesPage banner in Phase 04).
4. No other changes to either component.
5. Import `ServicesNavigationState` type from `@/types/navigation` using `import type`.

---

## Architecture

### GalleryDetailModal.tsx — diff

```typescript
// Add import at top (with other navigation import if needed):
import type { ServicesNavigationState } from "@/types/navigation";

// Replace handleBookDesign:
const handleBookDesign = () => {
  if (!item) return;
  navigate("/services", {
    state: { fromGallery: true, galleryItem: item } satisfies ServicesNavigationState,
  });
  onClose();
};
```

### GalleryCard.tsx — diff

```typescript
// Add import at top:
import type { ServicesNavigationState } from "@/types/navigation";

// Replace handleBookNow:
const handleBookNow = () => {
  navigate("/services", {
    state: { fromGallery: true, galleryItem: item } satisfies ServicesNavigationState,
  });
};
```

Note: `satisfies` operator provides compile-time type checking without widening the type — preferred over `as ServicesNavigationState`.

---

## Related Code Files

- `apps/client/src/components/gallery/GalleryDetailModal.tsx` — modify (lines 1-5, 44-49)
- `apps/client/src/components/gallery/GalleryCard.tsx` — modify (lines 1-5, 24-27)
- `apps/client/src/types/navigation.ts` — consumer of new type (Phase 01)
- `apps/client/src/pages/ServicesPage.tsx` — receives state (Phase 04)

---

## Implementation Steps

**GalleryDetailModal.tsx**:
1. Add `import type { ServicesNavigationState } from "@/types/navigation";` to imports (line ~5 area).
2. Remove `import { toast } from "sonner";` only if toast is not used elsewhere in the file. Check: `toast` is only used in `handleBookDesign` → safe to remove the line after confirming no other usage.
3. Replace `handleBookDesign` body: remove `toast.info(...)`, change `navigate("/services")` to `navigate("/services", { state: { fromGallery: true, galleryItem: item } satisfies ServicesNavigationState })`.

**GalleryCard.tsx**:
1. Add `import type { ServicesNavigationState } from "@/types/navigation";` to imports.
2. Remove `import { toast } from "sonner";` only if no other toast usage in file. Check: `toast` only in `handleBookNow` → safe to remove.
3. Replace `handleBookNow` body: remove `toast.info(...)`, change `navigate("/services")` to `navigate("/services", { state: { fromGallery: true, galleryItem: item } satisfies ServicesNavigationState })`.

---

## Todo List

- [ ] `GalleryDetailModal.tsx`: add `ServicesNavigationState` import
- [ ] `GalleryDetailModal.tsx`: remove `toast` import (verify no other usage first)
- [ ] `GalleryDetailModal.tsx`: update `handleBookDesign` — add state, remove toast call
- [ ] `GalleryCard.tsx`: add `ServicesNavigationState` import
- [ ] `GalleryCard.tsx`: remove `toast` import (verify no other usage first)
- [ ] `GalleryCard.tsx`: update `handleBookNow` — add state, remove toast call
- [ ] Run `npm run type-check`

---

## Success Criteria

- Clicking "Book" in `GalleryDetailModal` navigates to `/services` with `{ fromGallery: true, galleryItem }` in `location.state`
- Clicking CalendarCheck in `GalleryCard` navigates to `/services` with same state
- No TS errors
- No toast calls remain in either handler

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `toast` used elsewhere in component | Low | Grep file before removing import |
| `item` null guard (GalleryDetailModal) | None | Already guarded: `if (!item) return` |
| State lost on page refresh | Expected | React Router state is session-only — acceptable UX |

---

## Security Considerations

`GalleryItem` data originates from the API and is already validated before render — no XSS risk passing it through router state. React Router state is client-only, not transmitted to server.

---

## Next Steps

Phase 03 (`ServiceCard`) reads the state this phase injects. Phase 04 (`ServicesPage`) displays the banner. Both depend on this phase.
