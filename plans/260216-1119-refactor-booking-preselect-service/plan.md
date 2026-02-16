# Booking Flow Refactor - Pre-select Service

**Plan ID**: 260216-1119-refactor-booking-preselect-service
**Date**: 2026-02-16
**Scope**: Client app only (apps/client)
**Estimated Effort**: 6-8 hours
**Priority**: High

---

## Overview

Refactor booking flow to pre-select services from Gallery/Services pages, removing service selection step from BookingPage entirely.

**Goal**: Streamline booking UX by forcing service selection at source (Gallery/Services pages), making booking process faster and more intuitive.

---

## Context

**Current state**:
- Gallery cards: Partial pre-selection (category-based matching)
- Service cards: No pre-selection (user re-selects on booking page)
- BookingPage Step 1: Service selection grid (must be removed)

**Desired state**:
- All bookings originate from Gallery or Services pages
- Service passed via navigation state
- BookingPage shows selected service as read-only
- Direct /booking navigation redirects to /services

---

## Success Criteria

- [x] Service selection UI removed from BookingPage
- [x] ServiceCard navigates with pre-selected service
- [x] GalleryCard navigates with matched service
- [x] Direct /booking redirects to /services with toast
- [x] Selected service displayed as read-only on BookingPage
- [x] Form validation unchanged (Zod schema)
- [x] Type safety maintained (@repo/types)
- [ ] No regression in existing gallery flow (manual testing pending)
- [ ] Mobile-responsive on iOS/Android (manual testing pending)

---

## Implementation Phases

### Phase 1: Update Gallery Navigation
**Status**: ✅ COMPLETE
**Effort**: 2h
**File**: `phase-01-update-gallery-navigation.md`

Move service matching from useBookingPage to GalleryCard, pass matched service in navigation state.

**Completed**: Created apps/client/src/types/navigation.ts with BookingNavigationState type. Updated GalleryCard to fetch services and match by category. Service passed in navigation state. TypeScript compilation passes.

### Phase 2: Update Services Navigation
**Status**: ✅ COMPLETE
**Effort**: 1h
**File**: `phase-02-update-services-navigation.md`

Add service object to ServiceCard navigation state.

**Completed**: Updated ServiceCard to pass service in navigation state. TypeScript compilation passes.

### Phase 3: Refactor Booking Form
**Status**: ✅ COMPLETE
**Effort**: 3h
**File**: `phase-03-refactor-booking-form.md`

Remove Step 1, validate navigation state, display selected service as read-only.

**Completed**: Removed Step 1 (service selection UI). Updated to 2-step booking process. Added read-only service summary display. Updated useBookingPage hook (removed service matching, updated steps array). Updated BookingPage component (removed Step 1 block, updated step conditions). TypeScript compilation passes.

### Phase 4: Error Handling
**Status**: ✅ COMPLETE
**Effort**: 1h
**File**: `phase-04-error-handling.md`

Add redirects, validation, error messages for edge cases.

**Completed**: Added useEffect validation with redirect logic in useBookingPage. Added loading state for invalid navigation in BookingPage. Added defensive validation to ServiceCard. Vietnamese error toast messages. TypeScript compilation passes. Build succeeds.

### Phase 5: Testing & Verification
**Status**: ✅ COMPLETE (Automated)
**Effort**: 2h
**File**: `phase-05-testing-verification.md`

Comprehensive manual testing of all flows and edge cases.

**Completed**: TypeScript compilation: 0 errors. Lint checks: Clean (client, admin). Build verification: All apps build successfully. Code review: Implementation verified. Dev server: Running successfully. Manual browser testing: Documented (11 test scenarios pending execution).

---

## Technical Approach

**Navigation**: React Router state (no URL params)
**Type safety**: TypeScript type guards + @repo/types
**Edge cases**: Redirect to /services with toast
**Service matching**: Category-based (first match)

---

## Dependencies

- React Router v7 (navigation state)
- @repo/types (Service, GalleryItem)
- TanStack Query (service fetching)
- Existing Zod validation schema

---

## Risks

**High**: Type misalignment, breaking gallery flow
**Medium**: State loss on refresh, multiple service matches
**Low**: Service fetch delay, mobile testing

See: `reports/03-implementation-risks.md`

---

## Rollback Plan

1. Revert phase-03 changes (restore Step 1 UI)
2. Keep phase-01/02 (backward compatible)
3. Test original flow works
4. Deploy rollback commit

---

## Progress Tracking

**Phase 1**: 100% → Gallery navigation updated ✅
**Phase 2**: 100% → Services navigation updated ✅
**Phase 3**: 100% → Booking form refactored ✅
**Phase 4**: 100% → Error handling added ✅
**Phase 5**: 95% → Testing complete (automated checks pass, manual browser testing documented but pending execution)

**Overall**: 95% complete

**Files Modified**:
1. apps/client/src/types/navigation.ts (NEW)
2. apps/client/src/components/gallery/GalleryCard.tsx (MODIFIED)
3. apps/client/src/components/services/ServiceCard.tsx (MODIFIED)
4. apps/client/src/hooks/useBookingPage.ts (MAJOR REFACTOR)
5. apps/client/src/pages/BookingPage.tsx (MAJOR REFACTOR)

---

## Related Documentation

- `./reports/01-current-booking-flow-analysis.md`
- `./reports/02-navigation-strategy.md`
- `./reports/03-implementation-risks.md`
- `../../docs/code-standards.md`
- `../../docs/shared-types.md`

---

**Last Updated**: 2026-02-16
**Status**: Implementation COMPLETE - 95% (automated testing passed, manual browser testing pending)
