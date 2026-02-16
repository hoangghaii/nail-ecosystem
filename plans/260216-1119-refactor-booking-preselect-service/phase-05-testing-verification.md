# Phase 5: Testing & Verification

**Phase ID**: phase-05
**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: Phase 1-4 complete (all implementation done)
**Estimated Effort**: 2 hours

---

## Overview

**Date**: 2026-02-16
**Description**: Comprehensive manual testing of all flows and edge cases
**Priority**: Critical (production readiness)
**Implementation Status**: 🟢 Code Analysis Complete
**Review Status**: ⏳ Manual Testing Pending
**Report**: [260216-qa-agent-to-dev-team-phase5-testing-report.md](./reports/260216-qa-agent-to-dev-team-phase5-testing-report.md)

---

## Test Matrix

### 1. Happy Path Tests

#### Test 1.1: Gallery → Booking → Submit
**Steps**:
1. Navigate to `/gallery`
2. Select category filter (any)
3. Click "Đặt Lịch Ngay" on gallery card
4. Verify service summary displayed
5. Select date and time
6. Click "Tiếp Theo"
7. Fill customer info (all fields)
8. Click "Xác Nhận Đặt Lịch"
9. Verify success confirmation page

**Expected**:
- Service pre-selected from gallery category
- Gallery item preview shown
- 2-step process (Date/Time → Customer Info)
- Booking created successfully
- Confirmation displays service name

**Pass Criteria**: ✅ All steps work, booking created

---

#### Test 1.2: Services → Booking → Submit
**Steps**:
1. Navigate to `/services`
2. Select category filter (any)
3. Click "Đặt Dịch Vụ Này" on service card
4. Verify service summary displayed
5. Select date and time
6. Click "Tiếp Theo"
7. Fill customer info (all fields)
8. Click "Xác Nhận Đặt Lịch"
9. Verify success confirmation page

**Expected**:
- Service pre-selected (exact service)
- No gallery preview
- 2-step process
- Booking created successfully

**Pass Criteria**: ✅ All steps work, booking created

---

#### Test 1.3: HomePage → Services → Booking
**Steps**:
1. Navigate to `/` (HomePage)
2. Click "Xem Tất Cả Dịch Vụ" or similar CTA
3. Navigate to `/services`
4. Select service
5. Complete booking flow

**Expected**: Full flow works end-to-end

**Pass Criteria**: ✅ Booking created

---

### 2. Edge Case Tests

#### Test 2.1: Direct URL Navigation
**Steps**:
1. Open browser
2. Type `http://localhost:5173/booking` in address bar
3. Press Enter

**Expected**:
- Redirect to `/services`
- Toast: "Vui lòng chọn dịch vụ trước khi đặt lịch"

**Pass Criteria**: ✅ Redirect + toast shown

---

#### Test 2.2: Page Refresh Mid-Form
**Steps**:
1. Navigate Services → Booking
2. Fill date/time
3. Press F5 (refresh)

**Expected**:
- State lost (navigation state cleared)
- Redirect to `/services`
- Toast: "Vui lòng chọn dịch vụ trước khi đặt lịch"

**Pass Criteria**: ✅ Redirect + toast, no crash

---

#### Test 2.3: Back Button After Redirect
**Steps**:
1. Direct navigate to `/booking` → redirected to `/services`
2. Press browser back button

**Expected**:
- Stay on `/services` (no redirect loop)
- No infinite redirects

**Pass Criteria**: ✅ No redirect loop

---

#### Test 2.4: Gallery Item No Matching Service
**Steps**:
1. Navigate to `/gallery`
2. Find gallery item with category that has no active services
3. Click "Đặt Lịch Ngay"

**Expected**:
- Toast: "Không tìm thấy dịch vụ phù hợp..."
- No navigation
- Stay on gallery page

**Pass Criteria**: ✅ Error toast, no navigation

**Note**: May need to test in dev by filtering services

---

#### Test 2.5: Multiple Services Same Category
**Steps**:
1. Create 2+ services in same category (e.g., "manicure")
2. Navigate to gallery
3. Click "Đặt Lịch Ngay" on manicure gallery item
4. Verify which service selected

**Expected**:
- First matching service selected (by array order)
- Booking works normally

**Pass Criteria**: ✅ Booking created, service deterministic

---

### 3. UI/UX Tests

#### Test 3.1: Service Summary Display
**Steps**:
1. Navigate Gallery → Booking
2. Inspect service summary component

**Verify**:
- [ ] Service name displayed
- [ ] Service price displayed
- [ ] Service duration displayed
- [ ] Service image displayed (if available)
- [ ] Service description displayed (if available)
- [ ] Border-based design (no shadows)
- [ ] "Thay đổi dịch vụ" link present
- [ ] Warm color theme (primary/5 background)

**Pass Criteria**: ✅ All elements visible and styled correctly

---

#### Test 3.2: Progress Indicator
**Steps**:
1. Navigate Services → Booking
2. Inspect progress steps

**Verify**:
- [ ] Only 2 steps shown (Date/Time, Customer Info)
- [ ] No "Chọn Dịch Vụ" step
- [ ] Current step highlighted
- [ ] Completed steps show checkmark
- [ ] Connecting lines update correctly

**Pass Criteria**: ✅ 2 steps, correct states

---

#### Test 3.3: Change Service Link
**Steps**:
1. Navigate Gallery → Booking
2. Click "Thay đổi dịch vụ" link

**Expected**:
- Navigate to `/services`
- Can select different service
- Booking flow restarts

**Pass Criteria**: ✅ Redirect works

---

#### Test 3.4: Gallery Item Preview (from Gallery)
**Steps**:
1. Navigate Gallery → Booking
2. Verify gallery item preview shown in Step 1 (Date/Time)

**Verify**:
- [ ] Gallery image thumbnail displayed
- [ ] Gallery title displayed
- [ ] "Thiết Kế Đã Chọn" label shown
- [ ] Styled with secondary border

**Pass Criteria**: ✅ Preview displayed correctly

---

#### Test 3.5: No Gallery Preview (from Services)
**Steps**:
1. Navigate Services → Booking
2. Verify NO gallery item preview in Step 1

**Expected**: Only service summary at top, no gallery preview

**Pass Criteria**: ✅ No gallery preview shown

---

### 4. Form Validation Tests

#### Test 4.1: Service ID Pre-filled
**Steps**:
1. Navigate Services → Booking
2. Open DevTools → React DevTools
3. Inspect form state

**Verify**:
- `serviceId` field pre-filled with service._id
- `serviceId` not empty

**Pass Criteria**: ✅ ServiceId correct

---

#### Test 4.2: Step 1 Validation (Date/Time)
**Steps**:
1. Navigate Services → Booking
2. Try clicking "Tiếp Theo" without selecting date
3. Select date, try "Tiếp Theo" without time
4. Select both, click "Tiếp Theo"

**Expected**:
- Button disabled if date missing
- Button disabled if time missing
- Button enabled if both selected
- Navigate to Step 2

**Pass Criteria**: ✅ Validation works

---

#### Test 4.3: Step 2 Validation (Customer Info)
**Steps**:
1. Navigate to Step 2 (Customer Info)
2. Try submitting with empty fields
3. Fill each field one by one
4. Verify button enables when all filled

**Expected**:
- Button disabled if any field empty
- Email validation works
- Phone validation works
- Button enabled when all valid

**Pass Criteria**: ✅ Form validation unchanged

---

#### Test 4.4: Booking Submission
**Steps**:
1. Complete full booking flow
2. Check Network tab for API request
3. Verify payload structure

**Verify Payload**:
```json
{
  "serviceId": "abc123",
  "date": "2026-02-17",
  "timeSlot": "14:00",
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789"
  },
  "notes": ""
}
```

**Pass Criteria**: ✅ Payload correct, booking created

---

### 5. Mobile Responsiveness Tests

#### Test 5.1: iOS Safari
**Device**: iPhone (Safari browser)

**Test**:
1. Gallery → Booking flow
2. Services → Booking flow
3. Verify all touch interactions work
4. Verify date picker works on iOS

**Pass Criteria**: ✅ All flows work on iOS

---

#### Test 5.2: Android Chrome
**Device**: Android phone (Chrome browser)

**Test**:
1. Gallery → Booking flow
2. Services → Booking flow
3. Verify all touch interactions work
4. Verify date picker works on Android

**Pass Criteria**: ✅ All flows work on Android

---

#### Test 5.3: Responsive Layouts
**Test Breakpoints**:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1440px width

**Verify**:
- [ ] Service summary layout adapts
- [ ] Progress steps responsive
- [ ] Form fields stack correctly
- [ ] Buttons sized appropriately
- [ ] "Thay đổi dịch vụ" link visible

**Pass Criteria**: ✅ No layout breaks

---

### 6. Regression Tests

#### Test 6.1: Gallery Page Unchanged
**Steps**:
1. Navigate to `/gallery`
2. Test all existing features:
   - Category filters
   - Image lightbox
   - Lazy loading
   - Hover states

**Expected**: No regression, all features work

**Pass Criteria**: ✅ Gallery page unaffected

---

#### Test 6.2: Services Page Unchanged
**Steps**:
1. Navigate to `/services`
2. Test all existing features:
   - Category filters
   - Service cards display
   - Hover states
   - "Đặt Lịch Hẹn" CTA at bottom

**Expected**: No regression, all features work

**Pass Criteria**: ✅ Services page unaffected

---

#### Test 6.3: HomePage Unchanged
**Steps**:
1. Navigate to `/`
2. Test all sections work
3. Verify CTAs to services/booking

**Expected**: No regression

**Pass Criteria**: ✅ HomePage unaffected

---

### 7. TypeScript & Build Tests

#### Test 7.1: TypeScript Compilation
**Command**: `npm run type-check`

**Expected**: No TypeScript errors

**Pass Criteria**: ✅ 0 errors

---

#### Test 7.2: Production Build
**Command**: `npm run build`

**Expected**: Build succeeds, no warnings

**Pass Criteria**: ✅ Build successful

---

#### Test 7.3: Lint Check
**Command**: `npm run lint`

**Expected**: No linting errors

**Pass Criteria**: ✅ 0 errors

---

## Test Checklist Summary

**Happy Path** (3 tests):
- [ ] Gallery → Booking → Submit
- [ ] Services → Booking → Submit
- [ ] HomePage → Services → Booking

**Edge Cases** (5 tests):
- [ ] Direct URL navigation
- [ ] Page refresh mid-form
- [ ] Back button after redirect
- [ ] Gallery no matching service
- [ ] Multiple services same category

**UI/UX** (5 tests):
- [ ] Service summary display
- [ ] Progress indicator (2 steps)
- [ ] Change service link
- [ ] Gallery preview (from gallery)
- [ ] No gallery preview (from services)

**Form Validation** (4 tests):
- [ ] ServiceId pre-filled
- [ ] Step 1 validation (date/time)
- [ ] Step 2 validation (customer info)
- [ ] Booking submission payload

**Mobile** (3 tests):
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive layouts

**Regression** (3 tests):
- [ ] Gallery page unchanged
- [ ] Services page unchanged
- [ ] HomePage unchanged

**Build** (3 tests):
- [ ] TypeScript compilation
- [ ] Production build
- [ ] Lint check

**Total**: 26 test cases

---

## Bug Report Template

**If bugs found, document**:
```
Bug ID: BUG-P5-001
Phase: Phase 5 (Testing)
Test Case: Test X.Y
Severity: High/Medium/Low
Description: [What went wrong]
Steps to Reproduce:
1. [Step]
2. [Step]
Expected: [What should happen]
Actual: [What actually happened]
Screenshots: [If applicable]
Fix Required: [Which phase/file to update]
```

---

## Success Criteria

**Phase 5 complete when**:
- [ ] All 26 test cases pass
- [ ] No critical bugs found
- [ ] TypeScript compiles (0 errors)
- [ ] Build succeeds
- [ ] Mobile tested on real devices
- [ ] No regressions in existing features
- [ ] Code reviewed and approved
- [ ] Ready for production deployment

---

## Next Steps

**After Phase 5**:
- Mark plan as complete
- Update progress tracking in plan.md
- Create PR for code review
- Deploy to staging environment
- User acceptance testing (UAT)

---

**Status**: Ready to begin
**Blocked by**: Phase 1-4 implementation
**Blocking**: Production deployment
