# Phase 3: Refactor Booking Form

**Phase ID**: phase-03
**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: Phase 1 & 2 complete (navigation state structure ready)
**Estimated Effort**: 3 hours

---

## Context Links

- **Parent Plan**: `./plan.md`
- **Previous Phases**: Phase 1, Phase 2
- **Next Phase**: `./phase-04-error-handling.md`

---

## Overview

**Date**: 2026-02-16
**Description**: Remove Step 1 service selection UI, validate navigation state, display selected service as read-only
**Priority**: CRITICAL (core requirement)
**Implementation Status**: 🟡 Not Started
**Review Status**: 🟡 Not Reviewed

---

## Key Insights

**Current state**:
- 3-step booking process (Service → Date/Time → Customer Info)
- Step 1 shows service selection grid
- useBookingPage handles gallery pre-selection (category-based)

**New state**:
- 2-step booking process (Date/Time → Customer Info)
- Service pre-selected from navigation state
- Step 1 UI completely removed
- Service displayed as read-only summary

**Impact**: Major UI/UX change, affects entire booking flow

---

## Requirements

### Functional Requirements

**FR-P3.1**: Remove Step 1 UI
- Delete entire Step 1 JSX block
- Remove service selection grid
- Remove ServiceCardSkeleton loading state

**FR-P3.2**: Validate navigation state on mount
- Read location.state
- Validate using isValidBookingState type guard
- Extract service from state (fromService or fromGallery)

**FR-P3.3**: Display selected service as read-only
- Show service card/summary at top of form
- Display: name, price, duration, category, image
- Visual style: read-only (no hover states, no click)
- Optional: "Change Service" link (redirect to /services)

**FR-P3.4**: Update step progression
- Steps now: [1: Date/Time, 2: Customer Info]
- Update step IDs and titles
- Update progress indicator UI
- Update canProceed() logic

**FR-P3.5**: Remove service matching logic
- Delete category-based service matching from useBookingPage
- Service already in state (from Phase 1/2)
- Simplify hook logic

### Non-Functional Requirements

**NFR-P3.1**: Form validation unchanged
- Keep existing Zod schema
- serviceId still required
- Pre-filled from navigation state

**NFR-P3.2**: Design system compliance
- Follow client theme (warm, border-based)
- Maintain organic shapes (rounded-[12px] to rounded-[24px])
- No shadows (border-based design)

---

## Architecture

### Component Structure Changes

**BookingPage.tsx**:
```
BookingPage
├── Validate navigation state (useEffect)
├── Display breadcrumb & header
├── Show selected service summary (read-only) [NEW]
├── Progress steps (2 steps, not 3) [MODIFIED]
├── Form container
│   ├── Step 1: Date & Time [WAS Step 2]
│   └── Step 2: Customer Info [WAS Step 3]
└── Navigation buttons
```

**useBookingPage.ts**:
```
useBookingPage
├── Read & validate location.state [MODIFIED]
├── Extract service from state [NEW]
├── Initialize form with serviceId [MODIFIED]
├── State: currentStep (1 or 2, not 3) [MODIFIED]
├── State: selectedService (from state) [MODIFIED]
├── DELETE: Service matching logic
├── DELETE: handleServiceSelect function
└── canProceed() (updated for 2 steps) [MODIFIED]
```

### Data Flow

```
BookingPage mounts
  ↓
useBookingPage reads location.state
  ↓
Validate state with isValidBookingState
  ↓
  ├─ Valid → Extract service, initialize form
  └─ Invalid → [Phase 4: Redirect to /services]
  ↓
Display service summary (read-only)
  ↓
Show Step 1: Date/Time
  ↓
User selects date/time → Next
  ↓
Show Step 2: Customer Info
  ↓
User fills form → Submit
```

---

## Related Code Files

**Primary files to modify**:
1. `apps/client/src/pages/BookingPage.tsx` (MODIFY - major changes)
2. `apps/client/src/hooks/useBookingPage.ts` (MODIFY - major changes)

**Reference files**:
1. `apps/client/src/types/navigation.ts` (READ - type guard)
2. `apps/client/src/lib/validations/booking.validation.ts` (READ - unchanged)

**Delete usage**:
1. ServiceCardSkeleton (no longer displayed in Step 1)

---

## Implementation Steps

### Step 1: Update useBookingPage Hook

**File**: `apps/client/src/hooks/useBookingPage.ts`

**Changes**:

1. **Import type guard**:
```typescript
import type { BookingNavigationState } from "@/types/navigation";
import { isValidBookingState } from "@/types/navigation";
```

2. **Extract service from location.state** (replace lines 56-78):

**DELETE**:
```typescript
// Get gallery item from navigation state
const galleryItem = (location.state as { galleryItem?: GalleryItem })?.galleryItem;

// Initialize service from gallery state - compute initial values
const state = location.state as {
  fromGallery?: boolean;
  galleryItem?: GalleryItem;
} | null;

const matchingService = state?.fromGallery && state.galleryItem
  ? servicesData.find((service) => service.category === state.galleryItem?.category)
  : null;

const initialServiceId = matchingService?._id ?? "";
const initialStep = state?.fromGallery && matchingService ? 2 : 1;
```

**ADD**:
```typescript
// Extract service from navigation state
const navState = location.state as BookingNavigationState | null;

// Validate navigation state
const isValidState = isValidBookingState(navState);

// Extract service based on navigation source
const preSelectedService = isValidState
  ? navState.fromGallery
    ? navState.service
    : navState.service
  : null;

// Extract gallery item (if from gallery)
const galleryItem = isValidState && navState.fromGallery
  ? navState.galleryItem
  : null;

const initialServiceId = preSelectedService?._id ?? "";
```

3. **Update state initialization** (line 75-78):

**DELETE**:
```typescript
const [currentStep, setCurrentStep] = useState(initialStep);
const [selectedService, setSelectedService] = useState<Service | null>(
  matchingService ?? null,
);
```

**ADD**:
```typescript
const [currentStep, setCurrentStep] = useState(1); // Always start at step 1 (Date/Time)
const [selectedService] = useState<Service | null>(preSelectedService);
// Note: No setter needed (service immutable once set)
```

4. **Update steps array** (line 17-21):

**DELETE**:
```typescript
const steps = [
  { icon: FileText, id: 1, title: "Chọn Dịch Vụ" },
  { icon: Calendar, id: 2, title: "Chọn Ngày & Giờ" },
  { icon: User, id: 3, title: "Thông Tin" },
];
```

**ADD**:
```typescript
const steps = [
  { icon: Calendar, id: 1, title: "Chọn Ngày & Giờ" },
  { icon: User, id: 2, title: "Thông Tin" },
];
```

5. **Update canProceed function** (line 138-157):

**DELETE**:
```typescript
const canProceed = () => {
  if (currentStep === 1) {
    return selectedService !== null && form.getValues("serviceId") !== "";
  }
  if (currentStep === 2) {
    const date = form.getValues("date");
    const timeSlot = form.getValues("timeSlot");
    return date instanceof Date && timeSlot !== "";
  }
  if (currentStep === 3) {
    const { customerInfo } = form.getValues();
    return (
      customerInfo.firstName !== "" &&
      customerInfo.lastName !== "" &&
      customerInfo.email !== "" &&
      customerInfo.phone !== ""
    );
  }
  return false;
};
```

**ADD**:
```typescript
const canProceed = () => {
  if (currentStep === 1) {
    // Step 1: Date & Time
    const date = form.getValues("date");
    const timeSlot = form.getValues("timeSlot");
    return date instanceof Date && timeSlot !== "";
  }
  if (currentStep === 2) {
    // Step 2: Customer Info
    const { customerInfo } = form.getValues();
    return (
      customerInfo.firstName !== "" &&
      customerInfo.lastName !== "" &&
      customerInfo.email !== "" &&
      customerInfo.phone !== ""
    );
  }
  return false;
};
```

6. **DELETE handleServiceSelect function** (line 159-162):

```typescript
// DELETE THIS ENTIRE FUNCTION
const handleServiceSelect = (service: Service) => {
  setSelectedService(service);
  form.setValue("serviceId", service._id, { shouldValidate: true });
};
```

7. **Update handleNext/handlePrevious bounds** (line 97-111):

**MODIFY**:
```typescript
const handleNext = () => {
  if (currentStep < 2) { // Was 3, now 2
    setCurrentStep(currentStep + 1);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }
};
```

8. **Update return object** (line 174-194):

**DELETE from return**:
```typescript
handleServiceSelect, // DELETE
servicesData, // DELETE (no longer fetching in hook)
servicesLoading, // DELETE
```

**ADD to return**:
```typescript
isValidState, // For error handling in Phase 4
```

---

### Step 2: Update BookingPage Component

**File**: `apps/client/src/pages/BookingPage.tsx`

**Changes**:

1. **Remove ServiceCardSkeleton import** (line 7):

**DELETE**:
```typescript
import { ServiceCardSkeleton } from "@/components/shared/skeletons/ServiceCardSkeleton";
```

2. **Update useBookingPage destructuring** (line 23-43):

**DELETE**:
```typescript
handleServiceSelect,
servicesData,
servicesLoading,
```

**ADD**:
```typescript
isValidState,
```

3. **Add service summary component** (after PageHeader, before Progress Steps):

**ADD** (around line 76):
```typescript
{/* Selected Service Summary */}
{selectedService && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 rounded-[24px] border-2 border-primary bg-primary/5 p-6"
  >
    <p className="mb-3 font-sans text-sm font-medium text-muted-foreground">
      Dịch Vụ Đã Chọn
    </p>

    <div className="flex items-start gap-4">
      {selectedService.imageUrl && (
        <img
          src={selectedService.imageUrl}
          alt={selectedService.name}
          className="h-20 w-20 rounded-[12px] object-cover"
        />
      )}

      <div className="flex-1">
        <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
          {selectedService.name}
        </h3>

        <div className="flex flex-wrap gap-4 font-sans text-sm">
          <span className="text-primary font-bold">
            ${selectedService.price}
          </span>
          <span className="text-muted-foreground">
            {selectedService.duration} phút
          </span>
        </div>

        {selectedService.description && (
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            {selectedService.description}
          </p>
        )}
      </div>
    </div>

    {/* Optional: Change Service Link */}
    <div className="mt-4 border-t border-border pt-4">
      <Link
        to="/services"
        className="font-sans text-sm text-secondary hover:underline"
      >
        ← Thay đổi dịch vụ
      </Link>
    </div>
  </motion.div>
)}
```

4. **DELETE entire Step 1 block** (lines 162-212):

**DELETE ALL**:
```typescript
{/* Step 1: Select Service */}
{currentStep === 1 && (
  <motion.div ... >
    <h3>Chọn Dịch Vụ Của Bạn</h3>

    {servicesLoading ? (
      // Loading skeletons
    ) : (
      // Service grid
    )}
  </motion.div>
)}
```

5. **Update Step 2 condition to Step 1** (line 215):

**CHANGE**:
```typescript
{currentStep === 2 && ( // Was Step 2
```

**TO**:
```typescript
{currentStep === 1 && ( // Now Step 1 (Date/Time)
```

6. **Update Step 3 condition to Step 2** (line 330):

**CHANGE**:
```typescript
{currentStep === 3 && ( // Was Step 3
```

**TO**:
```typescript
{currentStep === 2 && ( // Now Step 2 (Customer Info)
```

7. **Update navigation buttons** (line 439):

**CHANGE**:
```typescript
{currentStep < 3 ? ( // Was 3
```

**TO**:
```typescript
{currentStep < 2 ? ( // Now 2 (only 2 steps)
```

8. **Add Link import** (for "Change Service" link):

```typescript
import { Link } from "react-router-dom";
```

---

### Step 3: Remove Gallery Item Preview from Step 2

**Optional**: Since service summary now shows at top, gallery preview in Step 2 is redundant

**File**: `apps/client/src/pages/BookingPage.tsx` (lines 231-256)

**Consider**: Keep or remove based on design preference
- **Keep**: Shows original inspiration image
- **Remove**: Cleaner UI, service summary sufficient

**Recommendation**: KEEP (valuable context for nail art selection)

---

### Step 4: Update Form Initialization

**File**: `apps/client/src/hooks/useBookingPage.ts`

**Ensure serviceId pre-filled**:
```typescript
const form = useForm<BookingFormData>({
  defaultValues: {
    customerInfo: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
    date: undefined,
    serviceId: initialServiceId, // Pre-filled from state
    timeSlot: "",
  },
  mode: "onChange",
  resolver: zodResolver(bookingFormSchema),
});
```

**Validation**: serviceId should never be empty (validated in Phase 4)

---

### Step 5: Manual Testing

**Test Case 1: Gallery → Booking Flow**
1. Navigate to `/gallery`
2. Click "Đặt Lịch Ngay" on any item
3. **Expected**:
   - Navigate to `/booking`
   - Service summary displayed at top
   - Gallery item preview shown
   - Start at Step 1 (Date/Time)
   - Progress shows 2 steps (not 3)

**Test Case 2: Services → Booking Flow**
1. Navigate to `/services`
2. Click "Đặt Dịch Vụ Này" on any service
3. **Expected**:
   - Navigate to `/booking`
   - Service summary displayed at top
   - No gallery preview
   - Start at Step 1 (Date/Time)
   - Progress shows 2 steps

**Test Case 3: Complete Booking**
1. Follow Test Case 1 or 2
2. Select date and time → Next
3. Fill customer info → Submit
4. **Expected**:
   - Booking created successfully
   - serviceId from pre-selected service
   - Confirmation page shows

**Test Case 4: Change Service Link**
1. Navigate to booking (any source)
2. Click "Thay đổi dịch vụ" link
3. **Expected**:
   - Navigate to `/services`
   - Can select different service

---

## Todo List

**Pre-implementation**:
- [ ] Phase 1 & 2 complete (navigation state ready)
- [ ] Review current BookingPage UI
- [ ] Review useBookingPage logic

**Implementation - useBookingPage.ts**:
- [ ] Import BookingNavigationState, isValidBookingState
- [ ] Extract service from location.state
- [ ] Validate state with type guard
- [ ] Update steps array (2 steps)
- [ ] Update currentStep initialization
- [ ] Update canProceed logic
- [ ] Delete handleServiceSelect
- [ ] Update handleNext/Previous bounds
- [ ] Update return object

**Implementation - BookingPage.tsx**:
- [ ] Remove ServiceCardSkeleton import
- [ ] Add service summary component
- [ ] Delete Step 1 JSX block
- [ ] Update Step 2 → Step 1
- [ ] Update Step 3 → Step 2
- [ ] Update navigation button bounds
- [ ] Add Link import

**Testing**:
- [ ] TypeScript compilation passes
- [ ] Gallery → Booking flow works
- [ ] Services → Booking flow works
- [ ] Complete booking end-to-end
- [ ] "Change Service" link works
- [ ] Progress indicator shows 2 steps
- [ ] Form validation still works
- [ ] Mobile responsive (iOS, Android)

**Documentation**:
- [ ] Update component comments
- [ ] Document new step structure

---

## Success Criteria

**Phase 3 complete when**:
- [ ] Step 1 service selection UI removed
- [ ] Service summary displayed as read-only
- [ ] Booking flow reduced to 2 steps
- [ ] Gallery → Booking works (Phase 1 integration)
- [ ] Services → Booking works (Phase 2 integration)
- [ ] Form submission still works
- [ ] TypeScript compiles with no errors
- [ ] All manual tests pass (4/4)
- [ ] Code reviewed and approved

---

## Risk Assessment

**Risks specific to Phase 3**:

1. **Breaking existing booking submissions** (HIGH)
   - Mitigation: Keep Zod schema unchanged, serviceId pre-filled
   - Test: End-to-end booking creation

2. **Step progression bugs** (MEDIUM)
   - Mitigation: Careful testing of step transitions
   - Test: Next/Previous navigation

3. **UI layout breaks** (MEDIUM)
   - Mitigation: Follow existing design patterns
   - Test: Visual regression on mobile/desktop

---

## Security Considerations

**Service validation in Phase 4**:
- Phase 3 assumes valid state (handled in Phase 4)
- Form validation unchanged (Zod backend)

---

## Next Steps

**After Phase 3 completion**:
1. Proceed to Phase 4 (Error Handling)
2. Phase 4 will add redirect for invalid state
3. Phase 4 will handle edge cases

**Validation before Phase 4**:
- Happy path works (Gallery/Services → Booking → Submit)
- Ready to add error handling

---

**Status**: Ready for implementation
**Blocked by**: Phase 1 & 2 (navigation state structure)
**Blocking**: Phase 4 (edge case handling)
