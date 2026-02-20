# Phase 02: Booking Flow via Lookbook

**Parent Plan:** [plan.md](./plan.md)
**Depends on:** [Phase 01](./phase-01-hide-service-page.md)

---

## Overview

- **Date:** 2026-02-19
- **Priority:** High
- **Status:** Pending
- **Description:** Ensure the Lookbook is the sole entry point for booking. Fix broken back-link in BookingPage, improve Lookbook→Booking UX, and update fallback redirect in `useBookingPage`.

---

## Key Insights

### Current Gallery → Booking Flow (Already Works)

The `fromGallery` flow is **fully implemented**:

1. `GalleryCard.tsx` — "Đặt Lịch Ngay" button calls `handleBookNow()`:
   - Fetches active services via `useServices({ isActive: true })`
   - Matches service by `service.category === item.category`
   - Navigates: `navigate("/booking", { state: { fromGallery: true, galleryItem: item, service: matchedService } })`

2. `GalleryDetailModal.tsx` — "Đặt Lịch Theo Mẫu Này" button calls `handleBookDesign()`:
   - Same service-matching logic as `GalleryCard`
   - Closes modal then navigates to `/booking` with `fromGallery` state

3. `BookingPage.tsx` + `useBookingPage.ts`:
   - Reads `location.state` as `BookingNavigationState`
   - Validates via `isValidBookingState()`
   - Extracts `galleryItem` when `fromGallery === true`
   - Shows gallery item preview thumbnail in Step 1 (lines 212-237 of `BookingPage.tsx`)

4. `BookingNavigationState` type (`apps/client/src/types/navigation.ts`) supports both `fromService` and `fromGallery` cases — **no type changes needed**.

### Issues to Fix

1. **`useBookingPage.ts` L78-79**: On invalid state, redirects to `/services` — must change to `/gallery`:
   ```typescript
   navigate("/services", { replace: true }); // ← broken after Phase 01
   ```
   Appears **twice** (lines 78 and 86).

2. **`BookingPage.tsx` L157**: "← Thay đổi dịch vụ" back-link points to `/services`:
   ```tsx
   <Link to="/services" ...>← Thay đổi dịch vụ</Link>
   ```
   Must update to `/gallery` and change label to "← Xem Lookbook".

3. **`ServicesOverview.tsx` individual card CTAs** (L129): Each service card has:
   ```tsx
   <Link to="/booking" className="block pt-2">
   ```
   This navigates to `/booking` without navigation state → `isValidBookingState` fails → user sees spinner + gets redirected. After Phase 01, `ServicesOverview` is removed from HomePage so this is no longer reachable. No fix needed.

4. **`LookbookHighlight.tsx` on HomePage**: Grid items link to `/gallery` (not directly to `/booking`) — correct behavior, no change needed.

### What Already Works Well

- `GalleryCard` + `GalleryDetailModal` both have working "Book Now" CTAs
- `BookingPage` already renders gallery item preview when `fromGallery` is set
- Service matching by category is already implemented in both gallery components
- No new components needed — only fix the redirect target + back-link

---

## Requirements

### Functional
- Invalid booking state redirect must go to `/gallery` not `/services`
- "← Thay đổi dịch vụ" link in BookingPage must go to `/gallery`
- All Lookbook→Booking paths must work: GalleryCard button, GalleryDetailModal button
- Toast error message on missing service match must remain informative

### Non-functional
- No new components (YAGNI/KISS)
- No changes to `BookingNavigationState` type (already correct)
- No API changes

---

## Architecture

```
Lookbook Entry Points → Booking Flow:

1. GalleryCard "Đặt Lịch Ngay"
   └─ handleBookNow() → match service by category → navigate("/booking", fromGallery state)
       └─ BookingPage: shows gallery thumb + service → Step1 (Date/Time) → Step2 (Info) → Submit

2. GalleryDetailModal "Đặt Lịch Theo Mẫu Này"
   └─ handleBookDesign() → match service by category → navigate("/booking", fromGallery state)
       └─ BookingPage: same flow as above

3. Direct /booking URL (no state)
   └─ isValidBookingState(null) = false → redirect to /gallery [FIXED in this phase]

Back navigation from BookingPage:
   "← Xem Lookbook" → /gallery  [FIXED in this phase]
```

---

## Related Code Files

| File | Path | Action |
|------|------|--------|
| BookingPage hook | `apps/client/src/hooks/useBookingPage.ts` | Modify — change 2x `navigate("/services")` → `navigate("/gallery")` |
| BookingPage view | `apps/client/src/pages/BookingPage.tsx` | Modify — change back-link `to="/services"` → `to="/gallery"`, update label |

No other files require changes for Phase 02.

---

## Implementation Steps

### Step 1 — Fix fallback redirect in useBookingPage

File: `apps/client/src/hooks/useBookingPage.ts`

Two occurrences of `navigate("/services", { replace: true })` at lines ~78 and ~86:

```typescript
// BEFORE (both occurrences):
navigate("/services", { replace: true });

// AFTER (both occurrences):
navigate("/gallery", { replace: true });
```

Also update the toast message at line 77 to reference Lookbook instead of "dịch vụ":

```typescript
// BEFORE (line ~77):
toast.error("Vui lòng chọn dịch vụ trước khi đặt lịch");

// AFTER:
toast.error("Vui lòng chọn mẫu thiết kế từ Lookbook trước khi đặt lịch");
```

### Step 2 — Fix back-link in BookingPage

File: `apps/client/src/pages/BookingPage.tsx`

Lines ~155-161 — update the Link:

```tsx
// BEFORE:
<Link
  to="/services"
  className="font-sans text-sm text-secondary hover:underline"
>
  ← Thay đổi dịch vụ
</Link>

// AFTER:
<Link
  to="/gallery"
  className="font-sans text-sm text-secondary hover:underline"
>
  ← Xem Lookbook
</Link>
```

---

## Todo Checklist

- [ ] Replace `navigate("/services", { replace: true })` (occurrence 1, ~line 78) with `navigate("/gallery", { replace: true })` in `useBookingPage.ts`
- [ ] Replace `navigate("/services", { replace: true })` (occurrence 2, ~line 86) with `navigate("/gallery", { replace: true })` in `useBookingPage.ts`
- [ ] Update toast error message to reference Lookbook (line ~77)
- [ ] Update `BookingPage.tsx` back-link `to` from `/services` to `/gallery`
- [ ] Update back-link label from "← Thay đổi dịch vụ" to "← Xem Lookbook"
- [ ] Run `npm run type-check` — 0 errors expected
- [ ] Manual test: visit `/booking` directly (no state) → should redirect to `/gallery` with toast
- [ ] Manual test: click "Đặt Lịch Ngay" on any GalleryCard → booking page loads with gallery thumb
- [ ] Manual test: open GalleryDetailModal → click "Đặt Lịch Theo Mẫu Này" → booking page loads
- [ ] Manual test: on BookingPage, click "← Xem Lookbook" → navigates to `/gallery`
- [ ] Manual test: gallery item with no matching service category → toast "không tìm thấy dịch vụ" appears

---

## Success Criteria

- Visiting `/booking` directly redirects to `/gallery` (not `/services`)
- GalleryCard "Đặt Lịch Ngay" → booking page shows correct gallery thumbnail + matched service
- GalleryDetailModal CTA → same booking flow as above
- BookingPage back-link says "← Xem Lookbook" and navigates to `/gallery`
- No references to `/services` remain in the booking flow
- `npm run type-check` passes

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Gallery item category has no matching service | Medium | Medium | Already handled: toast error in `GalleryCard.handleBookNow` and `GalleryDetailModal.handleBookDesign`; no code change needed |
| `useBookingPage` effect runs twice (StrictMode) | Low | Low | Already guarded by `isValidBookingState` check; idempotent |
| User lands on `/booking` via browser back after service page removal | Low | Low | Redirect to `/gallery` is correct UX |

---

## Security Considerations

- Navigation state is validated client-side via `isValidBookingState` — no server-side impact
- Service matching is read-only API call — no auth required
- No new data exposure

---

## Next Steps

After Phase 02:
- Verify end-to-end flow with Docker Compose dev environment
- Optionally delete `ServicesPage.tsx` + `ServicesOverview.tsx` if confirmed permanently unused (separate cleanup task)
- Consider adding a "Lookbook" section heading or CTA above the booking form when `fromGallery` to further contextualise the flow
