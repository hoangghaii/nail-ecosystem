# Phase 03 — ServiceCard: Forward Gallery Context to Booking

## Context Links

- Plan: [plan.md](./plan.md)
- Phase 01 (types): [phase-01-type-system.md](./phase-01-type-system.md)
- Phase 02 (entry points): [phase-02-gallery-entry-points.md](./phase-02-gallery-entry-points.md)
- File: `apps/client/src/components/services/ServiceCard.tsx`

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-20 |
| Description | `ServiceCard.handleBookNow` reads incoming gallery state from `useLocation` and forwards it to `/booking` |
| Priority | High — critical link in the chain |
| Implementation status | completed |
| Review status | completed |

---

## Key Insights

Current `handleBookNow` (lines 27-41):
```typescript
const handleBookNow = () => {
  if (!service || !service._id) {
    toast.error("Dịch vụ không hợp lệ");
    return;
  }
  navigate("/booking", {
    state: { fromService: true, service } as BookingNavigationState,
  });
};
```

- Always emits `fromService` variant, even when user came from gallery.
- Fix: add `useLocation()`, call `isValidServicesState(location.state)`, conditionally build `BookingNavigationState`.
- `fromService` path must remain unchanged for direct `/services` visits.

---

## Requirements

1. `useLocation()` added to read `location.state`.
2. If `isValidServicesState(location.state)` → emit `{ fromGallery: true, galleryItem: location.state.galleryItem, service }`.
3. Else → emit `{ fromService: true, service }` (current behavior, unchanged).
4. `toast.error` guard for invalid service unchanged.
5. Imports: add `useLocation` from `react-router-dom`, add `import type { ServicesNavigationState }` + `isValidServicesState` from `@/types/navigation`.

---

## Architecture

```typescript
// Imports to add:
import { useLocation, useNavigate } from "react-router-dom"; // add useLocation
import type { BookingNavigationState, ServicesNavigationState } from "@/types/navigation";
import { isValidServicesState } from "@/types/navigation";

// Inside ServiceCard:
const location = useLocation();

const handleBookNow = () => {
  if (!service || !service._id) {
    toast.error("Dịch vụ không hợp lệ");
    return;
  }

  // Check if we arrived from gallery — forward gallery context to booking
  const galleryState = isValidServicesState(location.state)
    ? (location.state as ServicesNavigationState)
    : null;

  const bookingState: BookingNavigationState = galleryState
    ? { fromGallery: true, galleryItem: galleryState.galleryItem, service }
    : { fromService: true, service };

  navigate("/booking", { state: bookingState });
};
```

### Why not `satisfies` here?

`bookingState` is a `const` with conditional branches — explicit annotation `BookingNavigationState` is clearer and `satisfies` would require each branch to independently satisfy the union. Explicit annotation is correct here.

### Type import note

`ServicesNavigationState` is needed only for the cast `location.state as ServicesNavigationState` after guard. The `isValidServicesState` guard narrows `unknown` → no explicit cast needed if we access `.galleryItem` through the narrowed type directly. The guard return type `state is ServicesNavigationState` handles narrowing.

---

## Related Code Files

- `apps/client/src/components/services/ServiceCard.tsx` — modify (lines 1-8, 24-41)
- `apps/client/src/types/navigation.ts` — source of `isValidServicesState` (Phase 01)
- `apps/client/src/pages/BookingPage.tsx` — receives `fromGallery` state (no change needed)
- `apps/client/src/hooks/useBookingPage.ts` — already extracts `galleryItem` from state (no change needed)

---

## Implementation Steps

1. Add `useLocation` to the `react-router-dom` import (alongside existing `useNavigate`).
2. Add `isValidServicesState` to the `@/types/navigation` import (alongside existing `BookingNavigationState`).
3. Add `import type { ServicesNavigationState }` — separate type import or merge with existing type import line.
4. Add `const location = useLocation();` inside `ServiceCard` component, before `handleBookNow`.
5. Replace `handleBookNow` body with conditional state logic as shown above.
6. Verify `as BookingNavigationState` cast removed (use explicit annotation instead).

---

## Todo List

- [ ] Add `useLocation` to react-router-dom import
- [ ] Add `isValidServicesState` to `@/types/navigation` import
- [ ] Add `const location = useLocation()` to component body
- [ ] Replace `handleBookNow` with conditional state logic
- [ ] Verify `fromService` path still works (direct `/services` visit → no gallery state)
- [ ] Run `npm run type-check`

---

## Success Criteria

- When arriving from gallery: `navigate("/booking", { state: { fromGallery, galleryItem, service } })`
- When arriving directly: `navigate("/booking", { state: { fromService, service } })`
- No TS errors
- `toast.error` guard for invalid service unchanged

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Stale state if user navigates forward then back | Low | React Router replaces state on each navigation — fresh on each `/services` visit |
| `isValidServicesState` false-negative (rejects valid state) | Low | Guard checks `fromGallery === true` + `galleryItem._id` — minimal requirements |
| `fromService` flow broken | None | `else` branch is verbatim copy of current behavior |

---

## Security Considerations

`isValidServicesState` guard prevents trusting arbitrary `location.state` from the browser history. Only proceeds with gallery item data that passes structural validation.

---

## Next Steps

Phase 04 (ServicesPage banner) is independent of this phase — can be implemented in parallel. Both phases depend on Phase 01 types.
