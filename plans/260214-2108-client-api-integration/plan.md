# Client App API Integration - Implementation Plan

**Project**: Pink Nail Salon - Client App API Integration
**Plan Date**: 2026-02-14
**Status**: 🟡 Planning
**Priority**: High (P1)
**Duration**: 4 days

---

## Overview

Complete API integration for client app (apps/client). Currently 50% integrated - Gallery, Services, Business Info working. Critical gaps: ContactPage form, HomePage ServicesOverview using mock data. Missing: loading skeletons, error boundaries, retry logic.

**Scope**: 5 phases, progressive enhancement from broken functionality → polished UX.

---

## Current State

**Working** (50% complete):
- ✅ Gallery API (filtered, paginated)
- ✅ Services API (filtered)
- ✅ Business Info API (Footer + ContactPage)
- ✅ TanStack Query setup

**Broken** (Critical gaps):
- ❌ HomePage ServicesOverview (uses mock data despite API hook existing)
- ❌ ContactPage form (no API integration, non-functional)
- ❌ Loading states missing (Footer shows nothing while loading)
- ❌ Error boundaries missing (no customer-friendly error handling)
- ❌ BookingPage integration incomplete

---

## Implementation Phases

| Phase | Name | Duration | Priority | Status | Dependencies |
|-------|------|----------|----------|--------|--------------|
| 1 | Critical Gaps | 0.5 day | P1 | 🟡 Pending | None |
| 2 | Loading & Error States | 1 day | P1 | 🟡 Pending | Phase 1 |
| 3 | Booking Integration | 1.5 days | P2 | 🟡 Pending | Phase 2 |
| 4 | Performance Optimization | 0.5 day | P2 | 🟡 Pending | Phase 3 |
| 5 | Testing & Polish | 0.5 day | P3 | 🟡 Pending | Phase 4 |

---

## Key Decisions

**Query Config**: 5min staleTime, 10min gcTime, retry 2 (customer-friendly, mobile-optimized)
**Error Handling**: Inline errors (NO toasts), customer-friendly messages, retry buttons
**Loading States**: Border-based skeleton loaders (NO shadows, matches client design)
**Mutations**: Bookings + Contacts only (services/gallery read-only)

---

## Success Criteria

**Phase 1**: ContactPage form submits, HomePage ServicesOverview shows live data
**Phase 2**: All pages show loading skeletons, errors handled gracefully
**Phase 3**: Booking flow works end-to-end with validation
**Phase 4**: Fast load times (<2s), prefetching working, images lazy-loaded
**Phase 5**: Zero mock data, all manual tests passing, docs updated

---

## Timeline

- **Day 1**: Phase 1 (morning), Phase 2 start (afternoon)
- **Day 2**: Phase 2 complete (morning), Phase 3 start (afternoon)
- **Day 3**: Phase 3 complete
- **Day 4**: Phase 4 (morning), Phase 5 (afternoon)

---

## Next Steps

1. Create phase files (phase-01 through phase-05)
2. Start Phase 1: Fix HomePage ServicesOverview (5 mins)
3. Start Phase 1: Implement ContactPage form (45 mins)
4. Move to Phase 2: Loading states
