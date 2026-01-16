# Phase 5: Type-Check & Testing

**Plan**: 260116-2015-admin-business-info-integration
**Phase**: 5 of 5
**Effort**: 30 minutes

---

## Objective

Verify all changes work correctly through type-checking and manual testing.

---

## Type Checking

### 1. Run Type-Check
```bash
npm run type-check
```

**Expected**: No TypeScript errors

---

### 2. Run Admin-Only Type-Check
```bash
npx turbo type-check --filter=admin
```

**Expected**: No errors in admin app

---

### 3. Build Admin App
```bash
npx turbo build --filter=admin
```

**Expected**: Successful build

---

## Manual Testing

### Form Loading
- [ ] Navigate to Contacts page
- [ ] Business info form displays
- [ ] Loading state shows briefly
- [ ] Form populates with current data from API
- [ ] All fields show correct values (phone, email, address)
- [ ] All 7 days show with correct hours

### Edit Mode
- [ ] Click "Edit Information" button
- [ ] All fields become editable
- [ ] Time pickers functional
- [ ] Closed toggles functional
- [ ] Form validation works (try invalid email)

### Save Changes
- [ ] Edit phone number
- [ ] Edit email
- [ ] Edit address
- [ ] Change business hours for one day
- [ ] Click "Save Changes"
- [ ] Success toast appears
- [ ] Form returns to read-only mode
- [ ] Changes persist after page refresh

### Cancel Changes
- [ ] Click "Edit Information"
- [ ] Make some changes
- [ ] Click "Cancel"
- [ ] Form resets to original values
- [ ] Returns to read-only mode

### Error Handling
- [ ] Disconnect network (DevTools offline mode)
- [ ] Refresh page
- [ ] Error state displays
- [ ] Reconnect network
- [ ] Retry loading - works

### Validation
- [ ] Edit mode ON
- [ ] Clear email field → Shows error
- [ ] Enter invalid email → Shows error
- [ ] Clear phone field → Shows error
- [ ] Clear address field → Shows error
- [ ] Fix errors → Can save successfully

### API Calls
**Open DevTools Network tab**:
- [ ] Page load triggers `GET /business-info`
- [ ] Save triggers `PATCH /business-info` with correct payload
- [ ] Cancel does NOT trigger API call
- [ ] Request includes JWT auth header

### React Query Caching
- [ ] Load page (API call made)
- [ ] Navigate away and back
- [ ] No new API call (uses cache)
- [ ] Wait >1 hour or clear cache
- [ ] New API call made

---

## Regression Testing

### Ensure Other Features Still Work
- [ ] Contacts list still loads
- [ ] Contact search still works
- [ ] Contact CRUD operations unaffected
- [ ] Navigation between pages works
- [ ] Authentication still functional

---

## Success Criteria

All checkboxes above must be checked (✓) before marking phase complete.

---

## Notes

- Focus on business info form functionality
- Verify API integration works end-to-end
- Ensure no console errors during testing
- Test both happy path and error scenarios
