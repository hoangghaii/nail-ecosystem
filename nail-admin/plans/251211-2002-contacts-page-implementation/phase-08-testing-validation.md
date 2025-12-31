# Phase 8: Testing & Validation

**Duration**: 1 hour
**Dependencies**: Phase 7 (Page Integration)
**Risk**: Low

---

## Objectives

1. Test all validation rules (forms, data integrity)
2. Verify status change logic and timestamp updates
3. Test search/filter combinations
4. Verify localStorage persistence
5. Check mobile responsiveness

---

## Test Suite Structure

### 1. Type System Tests

**File**: Run TypeScript compiler

```bash
npx tsc --noEmit
```

**Checklist**:

- [ ] No type errors in `src/types/contact.types.ts`
- [ ] No type errors in `src/types/businessInfo.types.ts`
- [ ] All imports use `type` keyword for type-only imports
- [ ] Service methods return correct types (Contact, BusinessInfo)

---

### 2. Business Info Form Validation Tests

**Test File**: Manual testing in browser

#### Test 2.1: Phone Validation

**Input**: Empty phone
**Expected**: "Phone must be at least 10 digits" error

**Input**: "555"
**Expected**: "Phone must be at least 10 digits" error

**Input**: "abc-def-ghij"
**Expected**: "Invalid phone format" error

**Input**: "(555) 123-4567"
**Expected**: ✅ Valid

---

#### Test 2.2: Email Validation

**Input**: Empty email
**Expected**: "Invalid email address" error

**Input**: "notanemail"
**Expected**: "Invalid email address" error

**Input**: "hello@pinknail.com"
**Expected**: ✅ Valid

---

#### Test 2.3: Address Validation

**Input**: Empty street
**Expected**: "Street is required" error

**Input**: State = "California"
**Expected**: "Use 2-letter state code" error

**Input**: ZIP = "1234"
**Expected**: "Invalid ZIP code format (e.g., 94102)" error

**Input**: ZIP = "94102"
**Expected**: ✅ Valid

**Input**: ZIP = "94102-1234"
**Expected**: ✅ Valid (extended format)

---

#### Test 2.4: Business Hours Validation

**Scenario 1**: Monday not closed, open = empty, close = "07:00 PM"
**Expected**: "Open and close times required when not closed" error

**Scenario 2**: Monday not closed, open = "09:00 AM", close = "07:00 AM"
**Expected**: "Open time must be before close time" error

**Scenario 3**: Monday closed = true, open/close empty
**Expected**: ✅ Valid

**Scenario 4**: Monday not closed, open = "09:00 AM", close = "07:00 PM"
**Expected**: ✅ Valid

---

#### Test 2.5: Inline Editing Flow

**Steps**:

1. Click "Edit" button
2. Modify phone number
3. Click "Cancel"
4. **Expected**: Form reverts to original values

**Steps**:

1. Click "Edit" button
2. Modify email address
3. Click "Save Changes"
4. **Expected**: Success toast, form switches to read-only mode

---

### 3. Contact Details Modal Tests

#### Test 3.1: Admin Notes Validation

**Input**: 1001 characters
**Expected**: "Notes must be less than 1000 characters" error

**Input**: 500 characters
**Expected**: ✅ Valid

---

#### Test 3.2: Status Change Logic

**Initial State**: Contact status = "new", respondedAt = null

**Action**: Change status to "responded", click "Save Changes"

**Expected**:

- Service updates status to "responded"
- Service sets respondedAt to current timestamp
- Success toast appears
- Modal closes
- Table updates with "responded" badge

---

**Subsequent Test**:

**Initial State**: Contact status = "responded", respondedAt = "2025-12-10"

**Action**: Change status to "read", click "Save Changes"

**Expected**:

- Service updates status to "read"
- respondedAt remains "2025-12-10" (not cleared)

---

#### Test 3.3: Modal Interaction Flow

**Steps**:

1. Click contact row in table
2. **Expected**: Modal opens with contact details

**Steps**:

1. Modal open, click "Cancel"
2. **Expected**: Modal closes without saving

**Steps**:

1. Modal open, click outside dialog
2. **Expected**: Modal closes without saving

**Steps**:

1. Modal open, press Escape key
2. **Expected**: Modal closes without saving

---

### 4. Search & Filter Tests

#### Test 4.1: Search by Name

**Action**: Type "Sarah" in search
**Expected**: Only contacts with "Sarah" in firstName or lastName appear

---

#### Test 4.2: Search by Email

**Action**: Type "gmail.com" in search
**Expected**: Only contacts with "gmail.com" in email appear

---

#### Test 4.3: Search by Subject

**Action**: Type "inquiry" in search
**Expected**: Contacts with "inquiry" in subject appear

---

#### Test 4.4: Search by Message Content

**Action**: Type "wedding" in search
**Expected**: Contacts with "wedding" in message body appear

---

#### Test 4.5: Status Filter

**Action**: Click "New" status filter
**Expected**:

- Only NEW status contacts appear
- Badge shows count (e.g., "5")

**Action**: Click "All" status filter
**Expected**: All contacts appear

---

#### Test 4.6: Combined Filter + Search

**Action**:

1. Click "Responded" status filter
2. Type "discount" in search

**Expected**: Only RESPONDED contacts with "discount" in any field

---

### 5. DataTable Tests

#### Test 5.1: Column Sorting

**Action**: Click "Date" column header
**Expected**: Contacts sorted by date (ascending/descending toggle)

**Action**: Click "Customer" column header
**Expected**: Contacts sorted by customer name

---

#### Test 5.2: Row Click

**Action**: Click any contact row
**Expected**: ContactDetailsModal opens with that contact's data

---

#### Test 5.3: Empty State

**Action**: Search for non-existent term (e.g., "zzzzzzzzz")
**Expected**: "No messages found matching your filters" message

---

### 6. localStorage Persistence Tests

**Note**: Only if localStorage integration added (optional in Phase 4)

#### Test 6.1: Contacts Persistence

**Steps**:

1. Update contact status
2. Refresh browser
3. **Expected**: Contact status persists

---

#### Test 6.2: Business Info Persistence

**Steps**:

1. Update business phone
2. Refresh browser
3. **Expected**: Business phone persists

---

### 7. Mobile Responsiveness Tests

**Device Sizes to Test**:

- Mobile (375px width)
- Tablet (768px width)
- Desktop (1280px width)

#### Test 7.1: Business Info Form

**Mobile**:

- [ ] City, State, ZIP fields stack vertically
- [ ] Business hours day/times stack vertically
- [ ] Edit/Cancel buttons are full width

**Desktop**:

- [ ] City, State, ZIP in 3-column grid
- [ ] Business hours in 4-column grid

---

#### Test 7.2: Customer Messages Table

**Mobile**:

- [ ] Table scrolls horizontally
- [ ] Search input full width
- [ ] Status filter buttons wrap to multiple rows

**Desktop**:

- [ ] All columns visible without scrolling
- [ ] Search input constrained to max-w-sm

---

#### Test 7.3: Contact Details Modal

**Mobile**:

- [ ] Customer info grid stacks vertically
- [ ] Form fields full width
- [ ] Save/Cancel buttons stack vertically

**Desktop**:

- [ ] Customer info in 2-column grid
- [ ] Save/Cancel buttons horizontal

---

### 8. Integration Tests

#### Test 8.1: Navigation

**Steps**:

1. Click "Contacts" in sidebar
2. **Expected**: /contacts route loads, page displays

---

#### Test 8.2: Store Initialization

**Steps**:

1. Open browser dev tools console
2. Refresh page
3. Check for `initializeContacts()` call
4. **Expected**: No duplicate initialization warnings

---

#### Test 8.3: Service Layer Mock Mode

**Steps**:

1. Verify `.env` has `VITE_USE_MOCK_API=true`
2. Update contact status
3. Check browser console for API calls
4. **Expected**: No real API calls, store updates directly

---

### 9. Error Handling Tests

#### Test 9.1: Service Error Simulation

**Setup**: Temporarily modify service to throw error

```typescript
// In contactsService.update()
throw new Error("Simulated error");
```

**Steps**:

1. Update contact status
2. **Expected**: Error toast appears, modal stays open

---

#### Test 9.2: Validation Error Display

**Steps**:

1. Business Info Form: Enter invalid ZIP "1234"
2. Click "Save Changes"
3. **Expected**:
   - ZIP input has red border (border-destructive)
   - Error message below input
   - Form stays in edit mode

---

### 10. Accessibility Tests

#### Test 10.1: Keyboard Navigation

**Steps**:

1. Tab through business info form
2. **Expected**: All inputs focusable in logical order

**Steps**:

1. Open ContactDetailsModal
2. Tab through form fields
3. **Expected**: Focus trapped within modal

---

#### Test 10.2: Screen Reader Labels

**Tool**: Browser dev tools Accessibility panel

**Checklist**:

- [ ] All inputs have associated labels
- [ ] Buttons have accessible names
- [ ] Status badges have text content (not just colors)

---

## Testing Checklist Summary

### Types & Build

- [ ] TypeScript compiles without errors
- [ ] All type-only imports correct

### Business Info Form

- [ ] Phone validation (format, length)
- [ ] Email validation
- [ ] Address validation (street, city, state, ZIP)
- [ ] Business hours validation (closed logic, time comparison)
- [ ] Edit/Cancel flow works
- [ ] Save triggers success toast

### Contact Details Modal

- [ ] Modal opens on row click
- [ ] Admin notes validation (max 1000 chars)
- [ ] Status change updates respondedAt (first time only)
- [ ] Save triggers success toast and data refresh
- [ ] Cancel discards changes

### Search & Filter

- [ ] Search by name, email, subject, message
- [ ] Debounce working (300ms)
- [ ] Status filter works
- [ ] Combined filter + search works
- [ ] Status counts accurate

### DataTable

- [ ] Columns render correctly
- [ ] Sorting works (date, customer columns)
- [ ] Row click opens modal
- [ ] Empty state displays

### Mobile Responsiveness

- [ ] Business info form responsive
- [ ] Customer messages table scrolls horizontally
- [ ] Modal responsive on mobile
- [ ] Status filter buttons wrap

### Integration

- [ ] Route /contacts works
- [ ] Sidebar navigation works
- [ ] Store initialization no duplicates
- [ ] Mock mode (no real API calls)

### Error Handling

- [ ] Service errors show toast
- [ ] Validation errors show red border + message
- [ ] Form stays open on error

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus trap in modal
- [ ] Labels associated with inputs
- [ ] Buttons have accessible names

---

## Regression Testing

After implementation, verify existing pages still work:

- [ ] Login page works
- [ ] Dashboard page works
- [ ] Banners page works
- [ ] Bookings page works
- [ ] Gallery page works

---

## Performance Testing

### Load Time

**Metric**: Time to interactive on /contacts page

**Target**: < 2 seconds on initial load

**Tool**: Browser dev tools Performance tab

---

### Filter Performance

**Metric**: Time to filter 20 contacts

**Target**: < 100ms (instant)

**Method**: Console.time around filter logic

---

## Security Validation

### Data Privacy

- [ ] Admin notes marked as "Private" in UI
- [ ] No PII logged to console
- [ ] localStorage keys prefixed with `nail_admin_`

---

### Input Sanitization

- [ ] Zod validation prevents injection (built-in)
- [ ] No unescaped HTML rendering (React escapes by default)

---

## Browser Compatibility

**Test Browsers**:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Known Issues**: None expected (uses standard React patterns)

---

## Deployment Checklist

### Pre-Deploy

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console warnings in production build
- [ ] `.env` configured correctly

---

### Build Test

```bash
npm run build
```

**Expected**: Build succeeds without errors

---

### Preview Test

```bash
npm run preview
```

**Expected**: Production build runs locally, all features work

---

## Test Reporting Template

**Format**: Create test results file

**File**: `plans/251211-2002-contacts-page-implementation/test-results.md`

```markdown
# ContactsPage Test Results

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: Local / Staging / Production

## Test Summary

- Total Tests: X
- Passed: Y
- Failed: Z

## Failed Tests

### Test Name

- **Expected**: [Expected result]
- **Actual**: [Actual result]
- **Steps to Reproduce**: [Steps]
- **Severity**: Critical / High / Medium / Low

## Notes

[Any additional observations]
```

---

## Next Steps After Testing

1. Fix any failed tests
2. Document any known issues
3. Create GitHub issues for medium/low priority bugs (if any)
4. Update README with ContactsPage documentation
5. Consider adding E2E tests with Playwright/Cypress (future enhancement)

---

## Success Criteria

✅ All validation rules work correctly
✅ Status change updates respondedAt timestamp
✅ Search/filter combinations work
✅ Mobile responsive design
✅ No TypeScript errors
✅ No console errors
✅ Accessibility standards met

---

## Files to Create (Optional)

1. `plans/251211-2002-contacts-page-implementation/test-results.md` - Test report

---

## Implementation Complete!

Once all tests pass, ContactsPage is ready for production use.
