# Phase 4: Error Handling & Validation

**Phase ID**: phase-04
**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: Phase 3 complete (booking form refactored)
**Estimated Effort**: 1 hour

---

## Overview

**Date**: 2026-02-16
**Description**: Add validation, redirects, and error messages for edge cases
**Priority**: High (production readiness)
**Implementation Status**: 🟡 Not Started
**Review Status**: 🟡 Not Reviewed

---

## Key Insights

**Edge cases to handle**:
1. Direct navigation to `/booking` (no state)
2. Invalid navigation state structure
3. Service ID in state doesn't exist
4. Page refresh (state lost)
5. Service deleted/deactivated after navigation

**Strategy**: Auto-redirect to `/services` with helpful toast message

---

## Requirements

### Functional Requirements

**FR-P4.1**: Detect invalid navigation state
- Check location.state exists
- Validate with isValidBookingState type guard
- Detect missing/malformed service object

**FR-P4.2**: Redirect to services page
- Use navigate() to redirect
- Show toast with Vietnamese message
- Preserve UX (no crash, smooth transition)

**FR-P4.3**: Service validation
- Verify service._id exists
- Verify service is active (optional)
- Handle service not found scenario

**FR-P4.4**: User-friendly error messages
- Vietnamese language
- Clear instructions (select service first)
- Non-technical language

---

## Implementation Steps

### Step 1: Add Redirect Logic to useBookingPage

**File**: `apps/client/src/hooks/useBookingPage.ts`

**Add useEffect for validation**:
```typescript
import { useEffect } from "react"; // Add to imports
import { toast } from "@/lib/toast"; // Add to imports

export function useBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ... existing code ...

  // Validate navigation state on mount
  useEffect(() => {
    const navState = location.state as BookingNavigationState | null;

    if (!isValidBookingState(navState)) {
      // Invalid state: redirect to services
      toast.error("Vui lòng chọn dịch vụ trước khi đặt lịch");
      navigate("/services", { replace: true });
      return;
    }

    // Additional validation: check service exists
    if (!navState.service || !navState.service._id) {
      toast.error("Dịch vụ không hợp lệ. Vui lòng chọn lại");
      navigate("/services", { replace: true });
      return;
    }
  }, [location.state, navigate]);

  // ... rest of hook ...
}
```

**Note**: `replace: true` prevents back button from returning to invalid state

---

### Step 2: Update BookingPage for Loading State

**File**: `apps/client/src/pages/BookingPage.tsx`

**Add early return for invalid state**:
```typescript
export function BookingPage() {
  const { selectedService, isValidState, ... } = useBookingPage();

  // Show loading while validating/redirecting
  if (!isValidState || !selectedService) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center">
            <p className="font-sans text-lg text-muted-foreground">
              Đang chuyển hướng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ... rest of component ...
}
```

**Alternative**: Show spinner instead of text

---

### Step 3: Add Toast Messages

**File**: Verify toast import exists

**Messages**:
- Invalid state: "Vui lòng chọn dịch vụ trước khi đặt lịch"
- Missing service: "Dịch vụ không hợp lệ. Vui lòng chọn lại"
- Service not found: "Dịch vụ không khả dụng. Vui lòng chọn dịch vụ khác"

---

### Step 4: Handle Page Refresh

**Scenario**: User refreshes BookingPage mid-form

**Current behavior**: State lost, redirect to services

**Enhancement (Optional)**:
```typescript
// Save draft to localStorage before redirect
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    const formData = form.getValues();
    if (formData.customerInfo.email || formData.date) {
      e.preventDefault();
      e.returnValue = "Bạn có chắc muốn rời khỏi? Thông tin đặt lịch sẽ bị mất.";
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [form]);
```

**Decision**: Skip for v1 (YAGNI), add if users complain

---

### Step 5: GalleryCard Error Handling (Phase 1 follow-up)

**File**: `apps/client/src/components/gallery/GalleryCard.tsx`

**Verify error handling exists** (from Phase 1):
```typescript
const handleBookNow = () => {
  const matchedService = services.find(
    (service: Service) => service.category === item.category
  );

  if (!matchedService) {
    toast.error(
      "Không tìm thấy dịch vụ phù hợp. Vui lòng liên hệ với chúng tôi."
    );
    return; // Don't navigate
  }

  // Navigate only if service found
  navigate("/booking", { ... });
};
```

---

### Step 6: ServiceCard Validation (Phase 2 follow-up)

**File**: `apps/client/src/components/services/ServiceCard.tsx`

**Add validation** (defensive programming):
```typescript
const handleBookNow = () => {
  // Validate service prop exists
  if (!service || !service._id) {
    toast.error("Dịch vụ không hợp lệ");
    return;
  }

  navigate("/booking", {
    state: {
      fromService: true,
      service: service,
    },
  });
};
```

**Note**: Should never happen (service validated by parent), but defensive

---

## Manual Testing

**Test Case 1: Direct URL Navigation**
1. Open browser
2. Type `http://localhost:5173/booking` directly
3. **Expected**: Redirect to `/services`, toast shown

**Test Case 2: Page Refresh**
1. Navigate Gallery → Booking
2. Fill partial form data
3. Press F5 (refresh)
4. **Expected**: Redirect to `/services`, toast shown

**Test Case 3: Invalid State Structure**
1. Use DevTools console: `window.history.pushState({}, '', '/booking')`
2. **Expected**: Redirect to `/services`, toast shown

**Test Case 4: Gallery No Matching Service**
1. Create gallery item with category "invalid-category"
2. Click "Đặt Lịch Ngay"
3. **Expected**: Toast error, no navigation

**Test Case 5: Back Button After Redirect**
1. Direct navigate to `/booking` → redirected
2. Press browser back button
3. **Expected**: Stay on `/services` (replace: true prevents loop)

---

## Todo List

**Implementation**:
- [ ] Add useEffect validation to useBookingPage
- [ ] Import toast utility
- [ ] Add redirect logic with replace: true
- [ ] Add loading state to BookingPage
- [ ] Verify GalleryCard error handling (Phase 1)
- [ ] Add ServiceCard validation (Phase 2 follow-up)

**Testing**:
- [ ] Test direct URL navigation
- [ ] Test page refresh
- [ ] Test invalid state
- [ ] Test gallery no match
- [ ] Test back button behavior
- [ ] Verify toast messages in Vietnamese
- [ ] Test on mobile browsers

**Documentation**:
- [ ] Document error handling strategy
- [ ] Update README if needed

---

## Success Criteria

- [ ] Direct `/booking` navigation redirects to `/services`
- [ ] Toast messages shown in Vietnamese
- [ ] Page refresh handled gracefully
- [ ] Invalid state detected and handled
- [ ] No console errors
- [ ] Back button doesn't create redirect loop
- [ ] All test cases pass (5/5)

---

## Error Message Copy

**Vietnamese messages**:
```typescript
const ERROR_MESSAGES = {
  INVALID_STATE: "Vui lòng chọn dịch vụ trước khi đặt lịch",
  MISSING_SERVICE: "Dịch vụ không hợp lệ. Vui lòng chọn lại",
  SERVICE_NOT_FOUND: "Dịch vụ không khả dụng. Vui lòng chọn dịch vụ khác",
  NO_MATCH: "Không tìm thấy dịch vụ phù hợp. Vui lòng liên hệ với chúng tôi",
};
```

---

## Next Steps

**After Phase 4**:
- Proceed to Phase 5 (Testing & Verification)
- Phase 5 is comprehensive manual testing

---

**Status**: Ready for implementation
**Blocked by**: Phase 3 (booking form refactored)
**Blocking**: Phase 5 (testing)
