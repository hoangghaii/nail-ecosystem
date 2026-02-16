# Phase 2: Update Services Navigation

**Phase ID**: phase-02
**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: Phase 1 complete (navigation types defined)
**Estimated Effort**: 1 hour

---

## Context Links

- **Parent Plan**: `./plan.md`
- **Previous Phase**: `./phase-01-update-gallery-navigation.md`
- **Next Phase**: `./phase-03-refactor-booking-form.md`
- **Navigation Types**: Created in Phase 1

---

## Overview

**Date**: 2026-02-16
**Description**: Add service object to ServiceCard navigation state
**Priority**: High (blocking phase 3)
**Implementation Status**: 🟡 Not Started
**Review Status**: 🟡 Not Reviewed

---

## Key Insights

**Current behavior**:
- ServiceCard navigates to `/booking` with NO state
- User forced to re-select service on booking page (poor UX)

**New behavior**:
- ServiceCard passes full Service object in state
- BookingPage receives service directly (no re-selection)

**Complexity**: LOW (simpler than Phase 1, service already available as prop)

---

## Requirements

### Functional Requirements

**FR-P2.1**: Pass service in navigation state
- State structure: `{ fromService: true, service }`
- Use BookingNavigationState type from Phase 1
- Service object already available (component prop)

**FR-P2.2**: Validate service before navigation
- Service object exists (not null/undefined)
- Service has valid _id field

### Non-Functional Requirements

**NFR-P2.1**: Type Safety
- Use BookingNavigationState type
- Import from navigation.ts (created Phase 1)

**NFR-P2.2**: Backward Compatibility
- Changes only affect ServiceCard
- No breaking changes to parent components

---

## Architecture

### Component Structure

```
ServiceCard (apps/client/src/components/services/ServiceCard.tsx)
├── Props: { service: Service, index: number }
├── Hooks:
│   └── useNavigate() - React Router navigation
├── Functions:
│   └── handleBookNow() - Navigate to booking [MODIFIED]
└── UI: "Đặt Dịch Vụ Này" button
```

### Data Flow

```
User clicks "Đặt Dịch Vụ Này"
  ↓
handleBookNow() triggered
  ↓
Validate service prop exists
  ↓
Navigate with state: { fromService: true, service }
```

---

## Related Code Files

**Primary files to modify**:
1. `apps/client/src/components/services/ServiceCard.tsx` (MODIFY)

**Reference files**:
1. `apps/client/src/types/navigation.ts` (READ - from Phase 1)
2. `packages/types/src/service.ts` (READ - Service type)

---

## Implementation Steps

### Step 1: Update ServiceCard Imports

**File**: `apps/client/src/components/services/ServiceCard.tsx`

**Add import**:
```typescript
import type { BookingNavigationState } from "@/types/navigation";
```

**No other imports needed** (service already available, navigate already imported)

---

### Step 2: Update handleBookNow Function

**File**: `apps/client/src/components/services/ServiceCard.tsx`

**OLD**:
```typescript
const handleBookNow = () => {
  navigate("/booking");
};
```

**NEW**:
```typescript
const handleBookNow = () => {
  // Navigate with service pre-selected
  navigate("/booking", {
    state: {
      fromService: true,
      service: service,
    } as BookingNavigationState,
  });
};
```

**Note**: `service` prop already validated by parent (ServicesPage), no additional validation needed

---

### Step 3: Optional - Add Type Annotation

**For extra type safety**:
```typescript
const handleBookNow = () => {
  const navState: BookingNavigationState = {
    fromService: true,
    service: service,
  };

  navigate("/booking", { state: navState });
};
```

**Decision**: Use inline type assertion (simpler, KISS principle)

---

### Step 4: Manual Testing

**Test Case 1: Services → Booking (Happy Path)**
1. Navigate to `/services`
2. Select any category filter (optional)
3. Click "Đặt Dịch Vụ Này" on any service card
4. **Expected**: Navigate to `/booking`, service pre-selected

**Test Case 2: Services → Booking (All Categories)**
1. Test each category filter
2. Click "Đặt Dịch Vụ Này" on different services
3. **Expected**: All navigate correctly with correct service

**Test Case 3: Verify State Structure**
1. Open React DevTools
2. Navigate Services → Booking
3. Inspect `location.state`
4. **Expected**: `{ fromService: true, service: { _id, name, ... } }`

---

## Todo List

**Pre-implementation**:
- [ ] Phase 1 complete (navigation.ts exists)
- [ ] Read current ServiceCard implementation
- [ ] Verify Service type structure

**Implementation**:
- [ ] Import BookingNavigationState type
- [ ] Update handleBookNow function
- [ ] Add type assertion for state

**Testing**:
- [ ] TypeScript compilation passes
- [ ] Test Services → Booking (all categories)
- [ ] Verify navigation state structure (DevTools)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Verify "Đặt Dịch Vụ Này" button still styled correctly

**Documentation**:
- [ ] Add comment to handleBookNow function

---

## Success Criteria

**Phase 2 complete when**:
- [ ] ServiceCard passes service in navigation state
- [ ] Navigation state matches BookingNavigationState type
- [ ] TypeScript compiles without errors
- [ ] Manual tests pass (3/3 test cases)
- [ ] No visual regression on ServiceCard
- [ ] Code reviewed and approved

---

## Risk Assessment

**Risks specific to Phase 2**:

1. **Breaking service card display** (LOW)
   - Mitigation: Only handleBookNow changed, UI untouched
   - Test: Service cards render correctly

2. **Type mismatch with navigation.ts** (LOW)
   - Mitigation: Use BookingNavigationState type
   - Test: TypeScript compilation

---

## Security Considerations

**None specific to Phase 2**:
- Service data already validated by API
- No user input in navigation state

---

## Next Steps

**After Phase 2 completion**:
1. Both navigation sources (Gallery, Services) now pass service
2. Proceed to Phase 3 (Refactor Booking Form)
3. Phase 3 will consume navigation state from both sources

**Validation before Phase 3**:
- Services → Booking navigation working
- Gallery → Booking navigation still working (Phase 1)
- Both use same state structure

---

**Status**: Ready for implementation
**Blocked by**: Phase 1 (navigation.ts must exist)
**Blocking**: Phase 3 (needs both navigation sources ready)
