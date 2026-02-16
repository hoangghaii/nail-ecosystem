# Phase 08: Booking Flow Enhancement

**Date**: Weeks 15-16 (2026-05-23 to 2026-06-05)
**Priority**: Medium (P2)
**Status**: Implementation Ready (Optional)
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 07: Gallery Modal Popups](./phase-07-gallery-modal-popups.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Optional 3-step flow
- **Next Phase**: [phase-09-confetti-success-states.md](./phase-09-confetti-success-states.md)

---

## Key Insights

**Blueprint Requirement**:
- Current booking: 2 steps (Date/Time + Customer Info)
- Optional expansion: 3 steps for better UX
- **Decision**: Implement only if user feedback suggests need
- Otherwise: Polish existing 2-step flow

**Design Philosophy**:
- Guided flow (not overwhelming)
- Visual selections over dropdowns
- Artist personalization

---

## Requirements

**Option A: Polish Existing 2-Step Flow** (Recommended for MVP):
1. Step 1: Date/Time selection (enhance UI)
2. Step 2: Customer info (existing)

**Option B: Expand to 3-Step Flow** (Optional):
1. Step 1: Choose Concept (nail shape + art complexity)
2. Step 2: Artist & Time (avatars + calendar)
3. Step 3: Customer Info (existing)

**Recommended Approach**: Option A (polish existing flow)

---

## Architecture

**Option A Implementation**:
- Update existing BookingPage.tsx
- Enhance Step 1 with better date/time picker UI
- Apply new design system (typography, colors, spacing)
- Improve progress indicator

**Option B Implementation**:
- Add new Step 0 (concept selection)
- Shift existing steps forward
- Update progress indicator to 3 steps
- Add visual selectors for nail shapes

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/BookingPage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/hooks/useBookingPage.ts`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/booking/BookingSteps.tsx` (if exists)

---

## Implementation Steps (Option A: Polish Existing)

1. **Update Progress Indicator**
   - Replace thick progress bar with minimalist dots:
     ```tsx
     <div className="flex justify-center items-center gap-3 mb-8">
       {[1, 2].map((step) => (
         <div
           key={step}
           className={cn(
             "flex items-center gap-2",
             step < currentStep && "opacity-50"
           )}
         >
           <div
             className={cn(
               "w-3 h-3 rounded-full transition-all",
               step === currentStep
                 ? "bg-primary scale-125"
                 : step < currentStep
                 ? "bg-primary/50"
                 : "bg-border"
             )}
           />
           {step < 2 && (
             <div className={cn(
               "w-8 h-0.5",
               step < currentStep ? "bg-primary/50" : "bg-border"
             )} />
           )}
         </div>
       ))}
     </div>
     ```

2. **Enhance Step 1: Date/Time Picker**
   - Update typography to serif for step titles
   - Improve time slot visual design:
     ```tsx
     <h3 className="font-serif text-2xl font-semibold mb-6">
       Chọn Ngày & Giờ
     </h3>

     {/* Time slots */}
     <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
       {timeSlots.map((slot) => (
         <button
           key={slot.time}
           disabled={!slot.available}
           className={cn(
             "p-3 rounded-[12px] text-sm font-medium transition-all",
             selectedTime === slot.time
               ? "bg-primary text-primary-foreground shadow-soft-md"
               : slot.available
               ? "bg-card border-2 border-border hover:border-primary"
               : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
           )}
         >
           {slot.time}
         </button>
       ))}
     </div>
     ```

3. **Enhance Step 2: Customer Info**
   - Use updated Input component from Phase 02
   - Apply consistent spacing and typography
   - Ensure form validation clear

4. **Integrate Gallery Pre-fill**
   - Check for navigation state on mount:
     ```tsx
     const location = useLocation();
     const state = location.state as {
       fromGallery?: boolean;
       galleryItem?: GalleryItem;
       service?: Service;
     };

     useEffect(() => {
       if (state?.fromGallery && state?.service) {
         // Pre-select service
         setSelectedService(state.service);
       }
     }, [state]);
     ```

5. **Test Booking Flow End-to-End**
   - Start booking from gallery modal
   - Verify service pre-filled
   - Complete booking
   - Verify submission works

---

## Implementation Steps (Option B: 3-Step Flow)

**Note**: Only implement if explicitly requested. Otherwise skip.

1. **Create Step 1: Concept Selection**
   - Visual nail shape cards with images
   - Art complexity selector (Simple/Complex/Masterpiece)

2. **Update Step Numbering**
   - Shift existing steps forward (Step 1 → Step 2, etc.)
   - Update progress indicator to show 3 dots

3. **Add Validation Between Steps**
   - Can't proceed without selecting nail shape
   - Can't proceed without art complexity

---

## Todo List (Option A: Recommended)

- [ ] Update progress indicator (minimalist dots)
- [ ] Apply font-serif to step titles
- [ ] Enhance time slot button styling
- [ ] Improve disabled time slot visual (opacity 50%)
- [ ] Apply updated Input component to Step 2
- [ ] Add gallery pre-fill logic (useLocation state)
- [ ] Test booking from homepage (no pre-fill)
- [ ] Test booking from gallery (service pre-filled)
- [ ] Verify form validation works
- [ ] Test end-to-end booking submission
- [ ] Test mobile responsiveness (time slots wrap)
- [ ] Verify keyboard navigation (Tab through form)

---

## Todo List (Option B: If Requested)

- [ ] Create nail shape visual selector
- [ ] Create art complexity selector
- [ ] Add Step 1 validation
- [ ] Update progress indicator to 3 dots
- [ ] Shift existing steps forward
- [ ] Update form state management
- [ ] Test 3-step flow end-to-end

---

## Success Criteria

**Technical**:
- [ ] Booking flow works end-to-end
- [ ] Gallery pre-fill functions correctly
- [ ] Form validation prevents submission with missing data
- [ ] Navigation state persists correctly

**Design**:
- [ ] Progress indicator minimalist and clear
- [ ] Time slots visually distinct (available/disabled/selected)
- [ ] Typography consistent with design system
- [ ] Mobile: time slots thumb-friendly

**UX**:
- [ ] Booking feels guided (not overwhelming)
- [ ] Visual selections more engaging than dropdowns
- [ ] Conversion rate maintained or improved

---

## Risk Assessment

**Low Risk** (Option A):
- Minimal changes to existing flow
- Visual polish only

**Medium Risk** (Option B):
- Additional step could reduce conversion
- Requires user testing to validate

**Mitigation**:
- A/B test if implementing Option B
- Monitor booking completion rate

---

## Security Considerations

**N/A** - Booking UI has no security implications (backend validation exists)

---

## Next Steps

After completion:
1. Monitor booking conversion metrics
2. Proceed to [Phase 09: Confetti & Success States](./phase-09-confetti-success-states.md)
3. Add celebration on booking confirmation

---

**Phase Status**: Ready for Implementation (Option A Recommended)
**Estimated Effort**: 2 weeks
**Blocking**: Phase 07 completion required
