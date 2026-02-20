# Plan: Hide Service Page & Route Booking via Lookbook

**Date:** 2026-02-19
**Directory:** `plans/260219-1526-booking-via-lookbook/`
**Status:** Pending

---

## Summary

Temporarily hide `/services` page from customer-facing UI and redirect all booking flows through the Lookbook (`/gallery`) page. The gallery→booking flow already exists in the codebase (`fromGallery` nav state, `GalleryCard` "Đặt Lịch Ngay" button, `GalleryDetailModal` "Đặt Lịch Theo Mẫu Này" button). Work is primarily removal/redirect + fixing the booking fallback redirect from `/services` to `/gallery`.

**Scope:** Client app only (`apps/client/`). API and Admin untouched.

---

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 01 | Hide Service Page | pending | [phase-01-hide-service-page.md](./phase-01-hide-service-page.md) |
| 02 | Booking Flow via Lookbook | pending | [phase-02-booking-via-lookbook.md](./phase-02-booking-via-lookbook.md) |

---

## Estimated Scope

- Files to modify: ~7
- Files to create: 0
- No shared type changes required
- No API changes required
- No admin changes required

---

## Key Dependencies

- Phase 01 must complete before Phase 02 (redirect target must be confirmed)
- `BookingNavigationState` type already supports `fromGallery` — no type changes needed
- `GalleryCard` + `GalleryDetailModal` already implement gallery→booking — minimal new work

---

## Unresolved Questions

1. Should `/services` redirect to `/gallery` (hard redirect) or render a 404/NotFoundPage?
2. Should `ServicesOverview` on HomePage be hidden entirely or replaced with a Lookbook CTA section?
3. Should the "← Thay đổi dịch vụ" back-link in `BookingPage` redirect to `/gallery` or be removed?
4. Is "temporary" hide tracked by a feature flag or just code removal? (Code removal is simpler per KISS; a flag adds complexity.)
