# Booking Flow Refactor - Implementation Plan

**Plan Directory**: `plans/260216-1119-refactor-booking-preselect-service/`
**Created**: 2026-02-16
**Status**: ✅ Planning Complete - Ready for Implementation

---

## Overview

Comprehensive implementation plan for refactoring client app booking flow to pre-select services from Gallery/Services pages, removing service selection step from BookingPage.

**Goal**: Streamline booking UX by enforcing service selection at source, reducing booking process from 3 steps to 2 steps.

---

## Plan Structure

```
260216-1119-refactor-booking-preselect-service/
├── README.md (this file)
├── plan.md (overview, phases, progress tracking)
├── reports/
│   ├── 01-current-booking-flow-analysis.md
│   ├── 02-navigation-strategy.md
│   └── 03-implementation-risks.md
├── phase-01-update-gallery-navigation.md
├── phase-02-update-services-navigation.md
├── phase-03-refactor-booking-form.md
├── phase-04-error-handling.md
└── phase-05-testing-verification.md
```

---

## Quick Start

### For Implementers

1. **Read first**: `plan.md` (high-level overview)
2. **Understand current state**: `reports/01-current-booking-flow-analysis.md`
3. **Review strategy**: `reports/02-navigation-strategy.md`
4. **Assess risks**: `reports/03-implementation-risks.md`
5. **Implement phases sequentially**: phase-01 → phase-02 → phase-03 → phase-04 → phase-05

### For Reviewers

1. **Start with**: `plan.md`
2. **Check reports**: Ensure analysis is thorough
3. **Review phases**: Verify implementation steps are clear
4. **Validate tests**: Ensure test coverage in phase-05

---

## Document Summaries

### plan.md
- **Purpose**: Master plan overview
- **Contents**: Success criteria, phases, dependencies, rollback
- **LOC**: 79 lines

### Reports

**01-current-booking-flow-analysis.md**:
- Current implementation breakdown
- Issues identified (5 major issues)
- Type definitions analysis
- Unresolved questions

**02-navigation-strategy.md**:
- Navigation strategy comparison (3 strategies)
- Selected approach: React Router state (recommended)
- Edge case handling strategies
- Type safety validation

**03-implementation-risks.md**:
- Risk assessment (6 categories)
- Risk matrix (priority levels)
- Mitigation strategies
- Acceptance criteria

### Implementation Phases

**Phase 1: Update Gallery Navigation** (2h)
- Move service matching from hook to GalleryCard
- Pass matched service in navigation state
- Create navigation types file
- Handle no-match errors

**Phase 2: Update Services Navigation** (1h)
- Add service to ServiceCard navigation state
- Type-safe state structure
- Simple implementation (service already available)

**Phase 3: Refactor Booking Form** (3h)
- Remove Step 1 service selection UI
- Validate navigation state on mount
- Display service as read-only summary
- Update step progression (2 steps)

**Phase 4: Error Handling** (1h)
- Add redirect for invalid state
- Validate service existence
- User-friendly Vietnamese error messages
- Handle page refresh edge case

**Phase 5: Testing & Verification** (2h)
- 26 test cases covering all flows
- Happy path tests (3)
- Edge case tests (5)
- UI/UX tests (5)
- Form validation (4)
- Mobile responsiveness (3)
- Regression tests (3)
- Build tests (3)

---

## Key Technical Decisions

### Navigation Strategy
**Selected**: React Router navigation state
**Rationale**: Type-safe, already partially implemented, aligns with requirements

**Alternative Rejected**: URL query parameters (no requirement for shareable links)

### Service Matching
**Gallery → Service**: Category-based, first match if multiple
**Services → Service**: Direct pass (exact service)

### Error Handling
**Strategy**: Auto-redirect to `/services` with toast message
**Rationale**: Smooth UX, no crashes, clear user guidance

### Type Safety
**Approach**: TypeScript type guards, @repo/types imports
**Files**: Create `apps/client/src/types/navigation.ts`

---

## Dependencies

**External**:
- React Router v7 (navigation state)
- @repo/types (Service, GalleryItem, ServiceCategory)
- TanStack Query (service fetching, caching)
- Zod (form validation - unchanged)

**Internal**:
- Phase 1 → Blocks Phase 3 (navigation types needed)
- Phase 2 → Blocks Phase 3 (both sources must be ready)
- Phase 3 → Blocks Phase 4 (form must be refactored first)
- Phase 1-4 → Block Phase 5 (all implementation complete before testing)

---

## Success Metrics

**Technical**:
- [ ] TypeScript compilation: 0 errors
- [ ] Build time: < 10s (unchanged)
- [ ] Bundle size: No significant increase
- [ ] Test coverage: 26/26 test cases pass

**User Experience**:
- [ ] Booking flow reduced from 3 steps to 2 steps
- [ ] Direct `/booking` navigation handled gracefully
- [ ] Mobile responsive (iOS Safari, Android Chrome)
- [ ] Vietnamese error messages clear and helpful

**Code Quality**:
- [ ] YAGNI, KISS, DRY principles followed
- [ ] @repo/types used (no duplication)
- [ ] Client design system maintained (warm, border-based)
- [ ] Code reviewed and approved

---

## Risk Mitigation

**High Risks**:
- Type misalignment (Service ↔ GalleryItem): Type guards + validation
- Breaking existing gallery flow: Incremental refactor + testing
- Form validation regression: Preserve Zod schema unchanged

**Medium Risks**:
- State loss on refresh: Accept as standard SPA behavior
- Multiple services match category: Document first-match behavior
- Service deleted after navigation: Validation + error handling

**Low Risks**:
- Service fetch delay: TanStack Query caching (already fast)
- Mobile testing insufficient: Real device testing in Phase 5

---

## Rollback Strategy

If critical issues found post-deployment:

1. **Immediate**: Revert Phase 3 changes (restore Step 1 UI)
2. **Validate**: Test original flow works
3. **Deploy**: Push rollback commit
4. **Keep**: Phase 1 & 2 changes (backward compatible, safe)

**Rollback Time**: ~30 minutes

---

## Implementation Checklist

### Pre-Implementation
- [ ] Read all documentation (plan + reports + phases)
- [ ] Review current codebase (BookingPage, GalleryCard, ServiceCard)
- [ ] Verify @repo/types structure
- [ ] Set up local dev environment

### Phase 1 (Gallery Navigation)
- [ ] Create navigation types file
- [ ] Update GalleryCard component
- [ ] Add service matching logic
- [ ] Test gallery → booking flow

### Phase 2 (Services Navigation)
- [ ] Update ServiceCard component
- [ ] Add navigation state
- [ ] Test services → booking flow

### Phase 3 (Booking Form)
- [ ] Update useBookingPage hook
- [ ] Remove Step 1 UI from BookingPage
- [ ] Add service summary display
- [ ] Update step progression
- [ ] Test both navigation sources

### Phase 4 (Error Handling)
- [ ] Add state validation
- [ ] Add redirect logic
- [ ] Test edge cases
- [ ] Verify error messages

### Phase 5 (Testing)
- [ ] Execute all 26 test cases
- [ ] Test on real mobile devices
- [ ] Verify no regressions
- [ ] Build & type-check pass

### Post-Implementation
- [ ] Code review
- [ ] Update progress in plan.md
- [ ] Create PR
- [ ] Deploy to staging
- [ ] User acceptance testing

---

## File Modification Summary

**Files to CREATE**:
- `apps/client/src/types/navigation.ts` (new file, ~50 LOC)

**Files to MODIFY**:
- `apps/client/src/components/gallery/GalleryCard.tsx` (~15 lines changed)
- `apps/client/src/components/services/ServiceCard.tsx` (~5 lines changed)
- `apps/client/src/pages/BookingPage.tsx` (~80 lines changed, ~60 deleted)
- `apps/client/src/hooks/useBookingPage.ts` (~50 lines changed, ~20 deleted)

**Files to DELETE**: None

**Total Impact**: ~5 files, ~200 LOC changed/deleted

---

## Estimated Timeline

**Total Effort**: 8-9 hours (1-2 working days)

| Phase | Effort | Status |
|-------|--------|--------|
| Phase 1 | 2h | 🟡 Not Started |
| Phase 2 | 1h | 🟡 Not Started |
| Phase 3 | 3h | 🟡 Not Started |
| Phase 4 | 1h | 🟡 Not Started |
| Phase 5 | 2h | 🟡 Not Started |
| **Total** | **9h** | **0% Complete** |

**Recommended Schedule**:
- Day 1 Morning: Phase 1 + 2 (3h)
- Day 1 Afternoon: Phase 3 (3h)
- Day 2 Morning: Phase 4 + 5 (3h)
- Day 2 Afternoon: PR review + adjustments

---

## Contact & Support

**Plan Author**: Claude Code (AI Assistant)
**Plan Date**: 2026-02-16
**Project**: Pink Nail Salon - Client App

**For questions**:
1. Read reports for context
2. Check specific phase documentation
3. Review code standards: `../../docs/code-standards.md`
4. Review shared types: `../../docs/shared-types.md`

---

## Related Documentation

**Project Docs**:
- `../../README.md` - Project overview
- `../../docs/code-standards.md` - Coding conventions
- `../../docs/shared-types.md` - Type definitions
- `../../docs/system-architecture.md` - Architecture overview

**Scout Reports**:
- `../../plans/scout-reports/apps/client-app.md` - Client app deep dive

**Claude Workflows**:
- `../../.claude/workflows/development-rules.md` - Development rules
- `../../CLAUDE.md` - AI assistant guidelines

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-16 | Initial plan created |

---

**Status**: ✅ Planning Complete - Ready for Implementation
**Next Action**: Begin Phase 1 implementation
