# Phase 3: Booking Integration

**Phase**: 3/5
**Date**: 2026-02-14
**Duration**: 1.5 days
**Priority**: P2 (Core Feature)
**Status**: ✅ Complete
**Completed**: 2026-02-15

---

## Context

**Dependencies**: Phase 2 complete (loading/error states)
**Blocked By**: Phase 2
**Blocks**: Phase 4 (need working booking before optimization)

**Problem**: BookingPage likely has incomplete API integration. Backend `POST /bookings` exists but form may not use it. Need full booking flow with validation, success states, error handling.

---

## Overview

Complete booking form integration with API. Verify existing implementation, add missing pieces. Implement customer-friendly validation, success confirmation, error recovery.

**Goals**:
- Booking form submits to API
- Form validation matches backend rules
- Success confirmation shows booking details
- Error handling with retry
- Mobile-optimized UX

---

## Key Insights from Research

**From researcher-01**:
- `bookingsService.create()` exists but likely not integrated
- Need React Hook Form + Zod + mutation hook
- Booking is most complex form (service selection, date/time, customer info)

**From researcher-02**:
- Use mutation pattern from admin
- Add optimistic updates for instant feedback
- Customer-friendly error messages
- Retry booking submissions (retry: 1 for mutations)

**Backend Requirements** (from API docs):
- POST /bookings requires: serviceId, customerName, customerEmail, customerPhone, bookingDate, bookingTime, notes (optional)
- Returns: Booking object with _id, status, createdAt

---

## Requirements

### Functional Requirements

**FR-3.1**: Booking form validates all required fields
**FR-3.2**: Service selection shows available services
**FR-3.3**: Date picker validates future dates only
**FR-3.4**: Time picker shows available time slots
**FR-3.5**: Form submits to POST /bookings
**FR-3.6**: Success shows confirmation with booking details
**FR-3.7**: Error shows inline message with retry
**FR-3.8**: Form clears after successful submission
**FR-3.9**: Submit button disabled while pending

### Non-Functional Requirements

**NFR-3.1**: Form validation completes in <100ms
**NFR-3.2**: Booking submission shows loading state immediately
**NFR-3.3**: Success confirmation appears in <500ms
**NFR-3.4**: Form accessible (keyboard nav, ARIA labels)
**NFR-3.5**: Mobile-friendly (date/time pickers native)

---

## Architecture

### Data Flow

**Booking Form Flow**:
```
User fills form → React Hook Form validation (Zod)
  ↓
Select service → useServices() hook (already integrated)
  ↓
Select date/time → Validation (future dates only)
  ↓
Submit → useBookingMutation()
  ↓
bookingsService.create(data)
  ↓
POST /bookings
  ↓
Success: Show confirmation, clear form
Error: Show inline error, enable retry
```

### Component Structure

**BookingPage** (verify/modify):
- Service selection dropdown (use `useServices()`)
- Date picker (future dates only)
- Time picker (available slots)
- Customer info fields (name, email, phone)
- Notes field (optional)
- Submit button with loading state
- Success confirmation modal/section
- Error message inline

**New Hook**:
- `useBookingMutation()` - Create booking mutation

---

## Related Code Files

### Files to Verify

**Existing** (may need updates):
- `/apps/client/src/pages/BookingPage.tsx` - Main booking form
- `/apps/client/src/services/bookings.service.ts` - Service layer exists

### Files to Create

**New Files**:
- `/apps/client/src/hooks/api/useBookings.ts` - **CREATE** mutation hook
- `/apps/client/src/components/booking/BookingConfirmation.tsx` - **CREATE** success UI

### Files to Reference

**Patterns**:
- `/apps/client/src/hooks/api/useContacts.ts` - Mutation pattern (Phase 1)
- `/apps/client/src/pages/ContactPage.tsx` - Form pattern (Phase 1)
- `@repo/types/booking` - Booking type definition

---

## Implementation Steps

### Step 1: Analyze Existing BookingPage (30 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Tasks:
1. Read file to understand current implementation
2. Check if `bookingsService.create()` is used
3. Identify missing pieces:
   - React Hook Form setup?
   - Zod validation schema?
   - Mutation hook?
   - Success/error states?
4. Document findings in implementation notes
5. Create task list for integration

### Step 2: Create Booking Zod Schema (20 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Schema fields:
- serviceId: string, required
- customerName: string, min 2 chars, required
- customerEmail: string, email format, required
- customerPhone: string, min 10 chars, required
- bookingDate: date, future only, required
- bookingTime: string, format HH:MM, required
- notes: string, optional

Validation rules:
```typescript
const bookingFormSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone must be at least 10 digits'),
  bookingDate: z.date().refine((date) => date > new Date(), {
    message: 'Booking date must be in the future',
  }),
  bookingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  notes: z.string().optional(),
});
```

### Step 3: Create useBookingMutation Hook (15 mins)

**File**: `/apps/client/src/hooks/api/useBookings.ts` (NEW)

Implementation:
```typescript
import { useMutation } from '@tanstack/react-query';
import { bookingsService, type CreateBookingDto } from '@/services/bookings.service';

export function useBookingMutation() {
  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    retry: 1, // Retry once for booking submissions
  });
}
```

### Step 4: Integrate React Hook Form (45 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Tasks:
1. Import useForm from react-hook-form
2. Import useBookingMutation hook
3. Import useServices hook (service selection)
4. Initialize form with zodResolver
5. Initialize mutation hook
6. Create onSubmit handler
7. Replace plain inputs with registered inputs
8. Add error displays below fields
9. Disable submit while pending

### Step 5: Implement Service Selection (30 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Tasks:
1. Use `useServices({ isActive: true })` hook
2. Create service dropdown/select
3. Display service name + price
4. Register with React Hook Form
5. Add loading state for services
6. Add error state if services fail to load

Example:
```tsx
const { data: services = [], isLoading: servicesLoading } = useServices({ isActive: true });

<select {...register('serviceId')}>
  <option value="">Select a service</option>
  {services.map((service) => (
    <option key={service._id} value={service._id}>
      {service.name} - {formatCurrency(service.price)}
    </option>
  ))}
</select>
```

### Step 6: Implement Date/Time Pickers (30 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Date picker:
- Use native `<input type="date" />` (mobile-friendly)
- Set min attribute to tomorrow's date
- Register with React Hook Form
- Convert to Date object for validation

Time picker:
- Use native `<input type="time" />` (mobile-friendly)
- Set min/max for business hours (e.g., 09:00-18:00)
- Register with React Hook Form
- Validate format HH:MM

Example:
```tsx
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];

<input
  type="date"
  min={minDate}
  {...register('bookingDate', { valueAsDate: true })}
/>

<input
  type="time"
  min="09:00"
  max="18:00"
  {...register('bookingTime')}
/>
```

### Step 7: Create BookingConfirmation Component (30 mins)

**File**: `/apps/client/src/components/booking/BookingConfirmation.tsx` (NEW)

Props:
- booking: Booking object (from mutation success)
- onClose: () => void

Display:
- Booking ID
- Service name
- Date and time
- Customer name
- Status badge
- Success message
- "Book Another" button (clears form, closes confirmation)

Design:
- Border-based card (NO shadows)
- Success accent: green border
- Check icon
- Customer-friendly language

### Step 8: Integrate Success/Error States (45 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Success handling:
1. On mutation success, show BookingConfirmation
2. Pass booking data to confirmation component
3. Clear form after confirmation closed
4. Optionally navigate to confirmation page

Error handling:
1. Display inline error below form
2. Show customer-friendly message
3. Add retry button
4. Keep form values (don't clear on error)

Example:
```tsx
const { mutate, isPending, isSuccess, data: booking, isError, error } = useBookingMutation();

{isSuccess && booking && (
  <BookingConfirmation
    booking={booking}
    onClose={() => {
      reset();
      // Navigate or reload
    }}
  />
)}

{isError && (
  <ErrorMessage
    message="Failed to create booking. Please try again."
    onRetry={() => handleSubmit(onSubmit)()}
  />
)}
```

### Step 9: Add Form Validation Feedback (20 mins)

**File**: `/apps/client/src/pages/BookingPage.tsx`

Add error messages below each field:
```tsx
{errors.serviceId && (
  <p className="text-sm text-destructive">{errors.serviceId.message}</p>
)}
```

Style validated fields:
- Error: `border-destructive` on input
- Success: `border-success` on valid input (optional)

### Step 10: Test Booking Flow (30 mins)

Manual testing checklist:
1. Load booking page
2. Verify services load in dropdown
3. Test form validation (empty fields)
4. Test date validation (past dates)
5. Test time validation (invalid format)
6. Submit valid booking
7. Verify success confirmation appears
8. Verify form clears after success
9. Test error handling (disconnect API)
10. Test retry button
11. Test mobile responsiveness
12. Test keyboard navigation

---

## Todo Checklist

### Analysis
- [ ] Read existing BookingPage implementation
- [ ] Identify missing pieces
- [ ] Document current state

### Zod Schema
- [ ] Create bookingFormSchema
- [ ] Add all field validations
- [ ] Test date validation (future only)
- [ ] Test time validation (format)

### Mutation Hook
- [ ] Create useBookingMutation hook
- [ ] Export hook
- [ ] Test hook in isolation

### Form Integration
- [ ] Import useForm and useBookingMutation
- [ ] Initialize form with zodResolver
- [ ] Initialize mutation hook
- [ ] Create onSubmit handler
- [ ] Replace plain inputs with registered inputs
- [ ] Add error messages below fields

### Service Selection
- [ ] Integrate useServices hook
- [ ] Create service dropdown
- [ ] Add loading state for services
- [ ] Add error state if services fail
- [ ] Register with React Hook Form

### Date/Time Pickers
- [ ] Implement date picker (native)
- [ ] Set min date to tomorrow
- [ ] Implement time picker (native)
- [ ] Set business hours (09:00-18:00)
- [ ] Register with React Hook Form

### Success/Error States
- [ ] Create BookingConfirmation component
- [ ] Integrate success confirmation
- [ ] Clear form after success
- [ ] Add inline error display
- [ ] Add retry button
- [ ] Keep form values on error

### Testing
- [ ] Test form validation (all fields)
- [ ] Test service selection
- [ ] Test date picker (future dates)
- [ ] Test time picker (business hours)
- [ ] Test booking submission success
- [ ] Test booking submission error
- [ ] Test retry functionality
- [ ] Test form clearing after success
- [ ] Test mobile responsiveness
- [ ] Test keyboard navigation

---

## Success Criteria

**Form Functionality**:
- ✅ Form validates all required fields
- ✅ Service selection shows active services
- ✅ Date picker only allows future dates
- ✅ Time picker validates business hours
- ✅ Form submits to POST /bookings
- ✅ Success shows confirmation with details
- ✅ Error shows inline message with retry
- ✅ Form clears after successful submission

**UX Quality**:
- ✅ Submit button disabled while pending
- ✅ Loading state shows immediately on submit
- ✅ Success confirmation appears <500ms
- ✅ Customer-friendly error messages
- ✅ Mobile-friendly (native pickers)
- ✅ Keyboard accessible

**Code Quality**:
- ✅ Follows client design system
- ✅ Uses shared types from @repo/types
- ✅ No console errors
- ✅ TypeScript strict mode passes

---

## Risk Assessment

**Medium Risk**:
- Date/time validation edge cases
- Service selection loading states
- Form state management complexity

**High Risk**:
- Booking submission failures (payment processing, conflicts)
- Timezone handling (date/time)
- Real-time availability checking (future enhancement)

**Mitigation**:
- Test date/time validation thoroughly
- Add clear error messages for booking conflicts
- Document timezone assumptions (future: add timezone selection)
- Phase 4 can add real-time availability if needed

---

## Security Considerations

**Input Validation**:
- Client-side validation (UX)
- Backend validation required (security)
- Sanitize customer inputs

**Data Privacy**:
- Customer email/phone handled securely
- No sensitive data in URLs
- Backend enforces rate limiting (prevent spam)

**Booking Conflicts**:
- Backend must validate availability
- Client validation is advisory only
- Show clear error if slot taken

---

## Next Steps

**After Phase 3**:
1. Move to Phase 4: Performance Optimization
2. Add prefetching for services
3. Implement lazy loading for gallery
4. Optimize cache settings
5. Test mobile performance
