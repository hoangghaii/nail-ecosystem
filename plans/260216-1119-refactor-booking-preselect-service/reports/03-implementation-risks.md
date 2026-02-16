# Implementation Risks

**Date**: 2026-02-16
**Scope**: Risk assessment for booking flow refactor

---

## Risk Categories

### 1. Technical Risks

#### Risk T1: State Loss on Page Refresh
**Severity**: Medium
**Probability**: High
**Impact**: User loses booking progress, must restart

**Mitigation**:
- Accept as standard SPA behavior (user education)
- Show clear error message + redirect to services
- Future: localStorage draft saving (v2)

**Contingency**: Add browser beforeunload warning if form partially filled

---

#### Risk T2: Type Misalignment (Gallery ↔ Service)
**Severity**: High
**Probability**: Low
**Impact**: Runtime errors, failed service matching

**Current state**:
- GalleryItem.category: `string` (slug)
- Service.category: `ServiceCategory` (enum)
- Categories aligned in @repo/types

**Mitigation**:
- Type guard validation before navigation
- Unit tests for category matching
- Shared constants in @repo/types

**Contingency**: Fallback to service picker if matching fails

---

#### Risk T3: Service Deleted Between Navigation and Submission
**Severity**: Medium
**Probability**: Low
**Impact**: Booking fails with confusing error

**Mitigation**:
- Validate service still active before submission
- Show user-friendly error message
- Redirect to services page for re-selection

**Contingency**: Backend validation returns 404 → show error toast

---

#### Risk T4: Multiple Services in Same Category
**Severity**: Medium
**Probability**: Medium
**Impact**: Wrong service auto-selected from gallery

**Current behavior**: Picks first match (arbitrary)

**Mitigation Options**:
- **Option A**: Select cheapest service (price-based)
- **Option B**: Select featured service (if available)
- **Option C**: Show service picker modal (adds complexity)
- **Option D**: Select first match, show "Change Service" link

**Recommended**: Option D (KISS), document behavior

**Contingency**: Add service switcher UI if users complain

---

#### Risk T5: Zustand State Conflicts
**Severity**: Low
**Probability**: Low
**Impact**: Stale state from previous booking

**Mitigation**:
- Use React Router state (isolated per navigation)
- Clear form state on unmount
- Reset state after successful booking

**Contingency**: Add useEffect cleanup in useBookingPage

---

### 2. User Experience Risks

#### Risk UX1: No Service Change Option
**Severity**: Medium
**Probability**: High
**Impact**: User must go back to services, loses progress

**Scenario**: User clicks wrong service, proceeds to booking, realizes mistake

**Mitigation**:
- Add "Change Service" link (redirects to /services)
- Preserve form data in sessionStorage (optional)
- Clear visual display of selected service

**Contingency**: Add service selector dropdown (defeats purpose, avoid)

---

#### Risk UX2: Confusing Error Messages
**Severity**: Medium
**Probability**: Medium
**Impact**: User doesn't understand why booking page is blank

**Mitigation**:
- Clear Vietnamese error messages
- Redirect to /services with toast explanation
- Add breadcrumb trail for navigation context

**Contingency**: A/B test error messages for clarity

---

#### Risk UX3: Direct Link Sharing Fails
**Severity**: Low
**Probability**: Low
**Impact**: User shares /booking link, recipient sees error

**Current requirement**: No shareable booking links needed

**Mitigation**:
- Document that direct /booking navigation is not supported
- Show helpful error message with service selection link

**Contingency**: Future: Add ?serviceId query param support (v2)

---

### 3. Development Risks

#### Risk D1: Breaking Existing Gallery Flow
**Severity**: High
**Probability**: Medium
**Impact**: Gallery → Booking navigation broken

**Mitigation**:
- Comprehensive testing of gallery flow
- Preserve existing navigation state structure
- Incremental refactor (gallery first, then services)

**Contingency**: Feature flag to toggle new/old behavior

---

#### Risk D2: Regression in Form Validation
**Severity**: High
**Probability**: Low
**Impact**: Invalid bookings submitted to API

**Mitigation**:
- Keep existing Zod validation schema
- Add validation for pre-selected service
- Integration tests for booking submission

**Contingency**: Backend validation catches invalid data

---

#### Risk D3: Component Props Complexity
**Severity**: Low
**Probability**: Medium
**Impact**: Hard-to-maintain component interfaces

**Mitigation**:
- Define clear TypeScript interfaces
- Document prop types in JSDoc
- Follow existing component patterns

**Contingency**: Refactor props if complexity grows

---

### 4. Testing Risks

#### Risk TEST1: E2E Test Coverage Gaps
**Severity**: Medium
**Probability**: High
**Impact**: Edge cases not caught before production

**Current state**: Manual testing only (no Playwright yet)

**Mitigation**:
- Comprehensive manual test plan
- Document all edge cases
- Test matrix: Gallery/Service × Valid/Invalid states

**Contingency**: Add E2E tests in future sprint

---

#### Risk TEST2: Mobile Testing Insufficient
**Severity**: Medium
**Probability**: Medium
**Impact**: Mobile UX issues in production

**Mitigation**:
- Test on iOS Safari, Android Chrome
- Verify touch interactions
- Test navigation state persistence on mobile

**Contingency**: Hotfix mobile-specific issues post-launch

---

### 5. Performance Risks

#### Risk P1: Additional Service Fetch in GalleryCard
**Severity**: Low
**Probability**: High
**Impact**: Slight delay before navigation

**New behavior**: GalleryCard must fetch services to match category

**Mitigation**:
- Use TanStack Query caching (already implemented)
- Services prefetched on app load (low latency)
- Show loading state if needed

**Contingency**: Preload services on HomePage

---

#### Risk P2: Larger Navigation State Objects
**Severity**: Low
**Probability**: High
**Impact**: Negligible (state is in-memory)

**Mitigation**: None needed (YAGNI)

---

### 6. Design System Risks

#### Risk DS1: Read-Only Service Display Styling
**Severity**: Low
**Probability**: Low
**Impact**: Visual inconsistency with design system

**Mitigation**:
- Follow client design system (warm, border-based)
- Reuse existing ServiceCard styling
- Design review before implementation

**Contingency**: Design adjustment in PR review

---

## Risk Matrix

| Risk | Severity | Probability | Priority | Mitigation Status |
|------|----------|-------------|----------|-------------------|
| T2: Type Misalignment | High | Low | HIGH | Planned |
| D1: Breaking Gallery Flow | High | Medium | HIGH | Planned |
| D2: Form Validation Regression | High | Low | HIGH | Planned |
| T1: State Loss on Refresh | Medium | High | MEDIUM | Accepted |
| T3: Service Deleted | Medium | Low | MEDIUM | Planned |
| T4: Multiple Services Match | Medium | Medium | MEDIUM | Documented |
| UX1: No Service Change | Medium | High | MEDIUM | Planned |
| UX2: Confusing Errors | Medium | Medium | MEDIUM | Planned |
| TEST1: E2E Gaps | Medium | High | MEDIUM | Accepted (manual) |
| TEST2: Mobile Testing | Medium | Medium | MEDIUM | Planned |
| P1: Service Fetch Delay | Low | High | LOW | Cached |
| All Others | Low | Low-Medium | LOW | Monitored |

---

## High-Priority Mitigations

1. **Type safety validation** (T2, D1, D2)
   - Type guards for navigation state
   - Comprehensive TypeScript coverage
   - Unit tests for state validation

2. **User experience** (UX1, UX2)
   - Clear error messages in Vietnamese
   - "Change Service" link on BookingPage
   - Smooth redirect flow for invalid state

3. **Testing** (D1, D2, TEST1)
   - Manual test plan covering all flows
   - Gallery → Booking (existing)
   - Services → Booking (new)
   - Direct /booking (edge case)
   - Form submission end-to-end

---

## Acceptance Criteria for Risk Mitigation

- [ ] No TypeScript errors in build
- [ ] All navigation paths manually tested
- [ ] Error messages tested with non-technical users
- [ ] Mobile testing on 2+ devices
- [ ] Gallery flow regression test passed
- [ ] Service matching handles multi-service categories
- [ ] Invalid state redirects work correctly
- [ ] Form validation unchanged (Zod schema)

---

## Unresolved Questions

1. Should we add analytics to track which page initiates bookings?
2. Acceptable delay for service matching in GalleryCard?
3. Should "Change Service" preserve form data?
4. Feature flag for gradual rollout?

---

**Overall Risk Level**: MEDIUM
**Recommended Approach**: Incremental rollout with manual testing
