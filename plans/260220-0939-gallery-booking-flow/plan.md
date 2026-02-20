# Gallery → Booking Flow Fix

**Date**: 2026-02-20
**Status**: Completed
**Priority**: High — broken user journey

---

## Problem

Gallery → booking navigation loses `GalleryItem` context. User clicks "Book" on a lookbook item, arrives at `/services` with no state; picks a service; arrives at `/booking` with `{ fromService: true, service }` only — gallery item gone. `fromGallery` booking variant already exists in types + BookingPage but is never triggered.

## Root Causes

| # | Location | Bug |
|---|----------|-----|
| 1 | `GalleryDetailModal.handleBookDesign()` | `navigate("/services")` — no state |
| 2 | `GalleryCard.handleBookNow()` | `navigate("/services")` — no state |
| 3 | `ServiceCard.handleBookNow()` | always emits `{ fromService: true, service }` — ignores incoming gallery state |
| 4 | `ServicesPage` | never reads location state — no forwarding mechanism |

## Solution Overview

Minimal wire-up across 4 files + 1 new type. No new components, no new hooks beyond `useLocation` calls.

```
Gallery entry → /services?state={fromGallery,galleryItem} → ServiceCard picks up state →
/booking?state={fromGallery,galleryItem,service} → BookingPage renders both panels
```

## Phases

| Phase | File(s) | Change | Status |
|-------|---------|--------|--------|
| [01](./phase-01-type-system.md) | `types/navigation.ts` | Add `ServicesNavigationState` type + type guard | completed |
| [02](./phase-02-gallery-entry-points.md) | `GalleryDetailModal.tsx`, `GalleryCard.tsx` | Pass `{ fromGallery, galleryItem }` state to `/services` | completed |
| [03](./phase-03-service-card-forward.md) | `ServiceCard.tsx` | `useLocation` → build conditional `BookingNavigationState` | completed |
| [04](./phase-04-services-page-banner.md) | `ServicesPage.tsx` | Context banner: thumbnail + design name when `fromGallery` | completed |

## Acceptance Criteria

1. Gallery "Book" → `/services` shows banner: design thumbnail + "Đặt lịch theo thiết kế: [name]"
2. Pick service → `/booking` shows "Thiết Kế Đã Chọn" + "Dịch Vụ Đã Chọn" panels
3. Direct `/services` visit → no banner, zero regression
4. No TS errors; `fromService` flow unchanged
5. Client design system: border-based, NO shadows, warm/organic Tailwind

## Key Files

- `apps/client/src/types/navigation.ts`
- `apps/client/src/components/gallery/GalleryDetailModal.tsx`
- `apps/client/src/components/gallery/GalleryCard.tsx`
- `apps/client/src/components/services/ServiceCard.tsx`
- `apps/client/src/pages/ServicesPage.tsx`
- `apps/client/src/pages/BookingPage.tsx` (no change needed — already renders `galleryItem`)
- `apps/client/src/hooks/useBookingPage.ts` (no change needed — already extracts `galleryItem`)

## Constraints

- No new components (banner inline in `ServicesPage`)
- No new hooks
- No API changes
- No shared-package changes (type lives in `apps/client/src/types/navigation.ts`)
- `verbatimModuleSyntax: true` — all type imports use `import type`
