# Testing Strategy

**Test Coverage:** Manual testing (8 core + 3 edge cases)
**Estimated Time:** 15-20 minutes

---

## Core Test Cases

### Test 1: Page Reload with Valid Tokens
**Scenario:** User with active session reloads page

**Steps:**
1. Login with credentials (admin@pinknail.com / admin123)
2. Navigate to `/bookings` or any protected page
3. Hard reload page (Cmd+R / Ctrl+R)

**Expected Results:**
- ✅ Page loads without redirect to login
- ✅ User data visible immediately
- ✅ No flash of loading screen (< 100ms)
- ✅ No console errors

**How to Verify:**
- Check URL stays on `/bookings`
- Check user avatar/name visible in header
- Check DevTools console for errors

---

### Test 2: Page Reload Without Tokens
**Scenario:** User not logged in accesses app

**Steps:**
1. Ensure logged out state (or open incognito window)
2. Navigate to `/` (should show login page)
3. Hard reload page

**Expected Results:**
- ✅ Stay on login page
- ✅ No redirect loop
- ✅ No loading spinner visible
- ✅ Login form renders immediately

**How to Verify:**
- Check URL stays `/login`
- Check network tab shows no API calls
- Check localStorage is empty

---

### Test 3: Clear Storage and Reload
**Scenario:** Tokens removed while app running

**Steps:**
1. Login successfully
2. Open DevTools → Application → Local Storage
3. Delete `auth_token`, `refresh_token`, `auth_user`
4. Hard reload page

**Expected Results:**
- ✅ Redirect to `/login`
- ✅ Brief loading spinner (< 100ms)
- ✅ No error toasts
- ✅ No console errors

**How to Verify:**
- URL changes to `/login`
- No red toast notifications
- Console clean (no 401 errors)

---

### Test 4: Login Flow Still Works
**Scenario:** New user logs in

**Steps:**
1. Navigate to `/login`
2. Enter credentials: admin@pinknail.com / admin123
3. Click login button

**Expected Results:**
- ✅ Redirect to `/` (dashboard)
- ✅ No loading spinner after login
- ✅ User data visible immediately
- ✅ Success toast shows

**How to Verify:**
- URL changes to `/`
- Dashboard content renders
- localStorage populated with tokens

---

### Test 5: Logout Flow Still Works
**Scenario:** User logs out

**Steps:**
1. Login successfully
2. Navigate to dashboard
3. Click logout button

**Expected Results:**
- ✅ Redirect to `/login`
- ✅ localStorage cleared
- ✅ Subsequent reload stays on login
- ✅ No re-authentication attempts

**How to Verify:**
- URL changes to `/login`
- localStorage empty
- Reload doesn't trigger API calls

---

### Test 6: Remember Me Persistence
**Scenario:** User with 30-day token returns later

**Steps:**
1. Login with "Remember Me" checked
2. Verify 30-day token in DevTools (Application → Local Storage → auth_token → decode JWT)
3. Close browser completely
4. Reopen browser and navigate to admin URL

**Expected Results:**
- ✅ Auto-login with 30-day token
- ✅ No redirect to login page
- ✅ Dashboard loads immediately

**How to Verify:**
- User stays logged in
- Check token expiry is 30 days from login
- No login page shown

---

### Test 7: Direct URL Access When Logged In
**Scenario:** User opens protected page in new tab

**Steps:**
1. Login successfully in one tab
2. Copy URL of protected page (e.g., `/bookings`)
3. Open new tab
4. Paste URL and press Enter

**Expected Results:**
- ✅ Page loads without redirect
- ✅ No visible loading spinner
- ✅ Content renders immediately

**How to Verify:**
- Bookings page renders
- No login page flash
- URL stays `/bookings`

---

### Test 8: Direct URL Access When Logged Out
**Scenario:** User tries to access protected page without auth

**Steps:**
1. Ensure logged out state
2. Type `/bookings` directly in URL bar
3. Press Enter

**Expected Results:**
- ✅ Redirect to `/login`
- ✅ Brief loading check (< 100ms)
- ✅ No error messages

**How to Verify:**
- URL changes to `/login`
- Login form shows
- No 401 errors in console

---

## Edge Case Testing

### Edge Case 1: Corrupted localStorage Data
**Scenario:** Invalid token data in storage

**Setup:**
```javascript
// In DevTools Console
localStorage.setItem('auth_token', 'corrupted-invalid-token');
localStorage.removeItem('refresh_token');
localStorage.setItem('auth_user', '{"id":"123","email":"test@test.com"}');
```

**Action:** Reload page

**Expected:**
- ✅ Redirect to login (auth check fails gracefully)
- ✅ No JavaScript errors
- ✅ No infinite loops

---

### Edge Case 2: Partial localStorage Data
**Scenario:** Only some auth data present

**Setup:**
```javascript
// In DevTools Console
localStorage.setItem('auth_token', 'some-token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('auth_user');
```

**Action:** Reload page

**Expected:**
- ✅ Redirect to login
- ✅ No console errors
- ✅ initializeAuth() handles missing data

---

### Edge Case 3: Network Offline on Reload
**Scenario:** User reloads with no network

**Steps:**
1. Login successfully
2. Enable offline mode in DevTools (Network tab → Offline)
3. Reload page

**Expected:**
- ✅ Auth state restored from localStorage
- ✅ App renders (UI visible)
- ✅ API calls fail separately (not blocking)
- ✅ User sees appropriate error toasts for API failures

**Note:** Auth should work (localStorage), but data fetching will fail (expected).

---

## Performance Validation

### Metrics to Measure

**1. Initialization Time**
- Open DevTools → Performance
- Start recording
- Reload page
- Stop recording
- Measure time from page load to `isInitialized: true`
- **Target:** < 50ms

**2. Loading Spinner Visibility**
- Use Performance timeline
- Find when spinner div mounts/unmounts
- **Target:** < 100ms (ideally not visible)

**3. Time to Interactive**
- From page load to first meaningful paint
- Should be same as before (no added latency)
- **Target:** No regression

### How to Measure

```javascript
// Add to App.tsx temporarily for testing
const start = performance.now();
initializeAuth();
const end = performance.now();
console.log(`Auth init took ${end - start}ms`);
```

---

## Regression Testing

**Pre-Implementation Baseline:**
1. Test all 8 core scenarios with OLD code
2. Document any issues/quirks
3. Note exact behavior

**Post-Implementation Comparison:**
1. Re-run all 8 core scenarios
2. Verify no new issues introduced
3. Confirm fix works (reload preserves auth)

---

## Success Criteria Checklist

After testing, verify:

- [ ] All 8 core tests pass
- [ ] All 3 edge cases handled gracefully
- [ ] No console errors or warnings
- [ ] Login flow works normally
- [ ] Logout flow works normally
- [ ] Remember Me still functional
- [ ] Performance < 50ms initialization
- [ ] Loading spinner < 100ms visibility
- [ ] No regression in existing functionality

---

## Failed Test Response

**If any test fails:**

1. **Document the failure:**
   - Which test case?
   - Expected vs actual behavior
   - Console errors?
   - Network requests?

2. **Debug steps:**
   - Check authStore state in DevTools
   - Verify initializeAuth() is called
   - Check timing of state updates
   - Review ProtectedRoute logic

3. **Common fixes:**
   - Missing `isInitialized` in state object
   - Wrong Zustand selector syntax
   - initializeAuth() not called in App.tsx
   - Logic error in condition checks

4. **Retest:**
   - Fix the issue
   - Re-run failed test
   - Re-run all other tests (verify no new breaks)

---

**Testing Status:** Ready to execute after implementation
**Next Step:** Run all tests sequentially, document results
