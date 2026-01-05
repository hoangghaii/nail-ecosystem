# Manual Testing Guide - Auth Persistence Fix
**Date:** 2026-01-02
**Bug Fix:** localStorage key mismatch corrected (line 21 authStore.ts)
**Admin URL:** http://localhost:5174
**Test Credentials:** admin@pinknail.com / admin123

---

## Pre-Testing Setup

**Admin Server Status:** RUNNING (port 5174)
**API Server Status:** RUNNING (port 3000)

**Browser DevTools Setup:**
1. Open http://localhost:5174 in Chrome/Firefox
2. Open DevTools (F12)
3. Navigate to:
   - **Application tab** → Local Storage → http://localhost:5174
   - **Console tab** → monitor for errors
   - **Network tab** → filter XHR requests

---

## Test Execution Checklist

### Test 1: Page Reload with Valid Tokens (CRITICAL - Was Broken)

**Steps:**
1. Login with admin@pinknail.com / admin123
2. Navigate to /bookings page
3. Hard reload (Cmd+R / Ctrl+R)

**Expected:**
- ✅ Stay on /bookings (NO redirect to /login)
- ✅ User data visible immediately
- ✅ No loading spinner (or < 100ms flash)
- ✅ No console errors

**Verify in DevTools:**
```javascript
// Application → Local Storage
localStorage.getItem('auth_token')      // Should have JWT
localStorage.getItem('refresh_token')   // Should have refresh token
localStorage.getItem('auth_user')       // Should have user JSON

// Console - check for errors
// Should be clean (no 401, no "Failed to read localStorage")
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Test 2: Page Reload Without Tokens

**Steps:**
1. Ensure logged out (or use incognito window)
2. Navigate to http://localhost:5174
3. Hard reload page

**Expected:**
- ✅ Stay on /login page
- ✅ No redirect loop
- ✅ No loading spinner
- ✅ Login form visible immediately

**Verify in DevTools:**
```javascript
// Application → Local Storage
localStorage.length === 0  // Should be empty

// Network tab
// Should show NO API calls (no auth check)
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Test 3: Clear Storage and Reload

**Steps:**
1. Login successfully
2. DevTools → Application → Local Storage
3. Delete: auth_token, refresh_token, auth_user
4. Hard reload page

**Expected:**
- ✅ Redirect to /login
- ✅ Brief loading spinner (< 100ms)
- ✅ No error toasts
- ✅ No console errors

**Verify in DevTools:**
```javascript
// Console
// Should be clean (no errors)

// After reload, URL should be /login
window.location.pathname === '/login'
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Test 4: Login Flow Still Works

**Steps:**
1. Navigate to /login
2. Enter: admin@pinknail.com / admin123
3. Click "Sign In" button

**Expected:**
- ✅ Redirect to / (dashboard)
- ✅ No loading spinner after login
- ✅ User data visible immediately
- ✅ Success toast shows

**Verify in DevTools:**
```javascript
// Application → Local Storage (after login)
localStorage.getItem('auth_token')      // JWT present
localStorage.getItem('refresh_token')   // Refresh token present
localStorage.getItem('auth_user')       // User object present

// Verify tokens match storage service keys
// (This was the bug - should now be "refresh_token" not "nail_admin_refresh_token")
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Test 5: Logout Flow Still Works

**Steps:**
1. Login successfully
2. Navigate to dashboard
3. Click logout button (topbar)

**Expected:**
- ✅ Redirect to /login
- ✅ localStorage cleared
- ✅ Subsequent reload stays on login
- ✅ No re-authentication attempts

**Verify in DevTools:**
```javascript
// Application → Local Storage (after logout)
localStorage.getItem('auth_token')      // null
localStorage.getItem('refresh_token')   // null
localStorage.getItem('auth_user')       // null

// Network tab
// Reload should NOT trigger /auth/refresh or /auth/me calls
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Test 6: Remember Me Persistence

**Steps:**
1. Login with "Remember Me" checked
2. DevTools → Application → Local Storage → auth_token
3. Copy token value
4. Decode JWT at https://jwt.io
5. Check exp (expiration) field

**Expected:**
- ✅ Token stored in localStorage
- ✅ Expiry is 30 days from login (if Remember Me works)
- ✅ Expiry is 1 day if Remember Me NOT checked

**Verify:**
```javascript
// In Console
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
const expiresAt = new Date(payload.exp * 1000);
const issuedAt = new Date(payload.iat * 1000);
const daysValid = (expiresAt - issuedAt) / (1000 * 60 * 60 * 24);

console.log('Token valid for:', daysValid, 'days');
// Should be ~30 if Remember Me checked, ~1 if not
```

**Result:** [ ] PASS / [ ] FAIL
**Token Validity:** ___ days
**Notes:**

---

### Test 7: Direct URL Access When Logged In

**Steps:**
1. Login in one tab
2. Copy /bookings URL
3. Open NEW tab (Cmd+T)
4. Paste /bookings URL and press Enter

**Expected:**
- ✅ Page loads without redirect
- ✅ No loading spinner flash
- ✅ Bookings content renders immediately
- ✅ URL stays /bookings

**Verify in DevTools:**
```javascript
// Network tab
// Should NOT see /auth/login or redirect responses

// Console
// Should be clean (no errors)
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Test 8: Direct URL Access When Logged Out

**Steps:**
1. Ensure logged out (clear storage or incognito)
2. Type http://localhost:5174/bookings in URL bar
3. Press Enter

**Expected:**
- ✅ Redirect to /login
- ✅ Brief loading check (< 100ms)
- ✅ No error messages
- ✅ Login form visible

**Verify in DevTools:**
```javascript
// URL should change to /login
window.location.pathname === '/login'

// Console
// Should be clean (no 401 errors shown to user)
```

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

## Performance Validation

### Initialization Time Measurement

**Add to App.tsx temporarily:**
```typescript
const start = performance.now();
initializeAuth();
const end = performance.now();
console.log(`Auth init took ${end - start}ms`);
```

**Expected:** < 50ms

**Measured Time:** ___ ms
**Result:** [ ] PASS (< 50ms) / [ ] FAIL

---

### Loading Spinner Visibility

**Test Method:**
1. Open DevTools → Performance tab
2. Start recording
3. Reload page with valid tokens
4. Stop recording
5. Find spinner element mount/unmount timing

**Expected:** Spinner visible < 100ms (ideally not visible at all)

**Measured Time:** ___ ms
**Result:** [ ] PASS (< 100ms) / [ ] FAIL

---

## Edge Case Testing

### Edge Case 1: Corrupted localStorage Data

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

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Edge Case 2: Partial localStorage Data

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

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

### Edge Case 3: Network Offline on Reload

**Setup:**
1. Login successfully
2. DevTools → Network tab → Offline mode enabled
3. Reload page

**Expected:**
- ✅ Auth state restored from localStorage (UI visible)
- ✅ App renders with cached auth data
- ✅ API calls fail separately (expected)
- ✅ User sees error toasts for API failures (NOT auth failures)

**Result:** [ ] PASS / [ ] FAIL
**Notes:**

---

## Bug Fix Verification

**Critical Bug:** localStorage key mismatch in authStore.ts line 21

**Before Fix:**
```typescript
const refreshToken = storage.get<string | null>("nail_admin_refresh_token", null);
```

**After Fix:**
```typescript
const refreshToken = storage.get<string | null>("refresh_token", null);
```

**Verify Fix:**
```javascript
// In DevTools Console (after login)
localStorage.getItem('refresh_token')  // Should NOT be null
localStorage.getItem('nail_admin_refresh_token')  // Should be null (old key)

// Check authStore.ts line 21 in source code
// Should read "refresh_token" not "nail_admin_refresh_token"
```

**Fix Verified:** [ ] YES / [ ] NO
**Notes:**

---

## Success Criteria Summary

**All tests MUST pass:**
- [ ] Test 1: Reload with valid tokens (CRITICAL)
- [ ] Test 2: Reload without tokens
- [ ] Test 3: Clear storage and reload
- [ ] Test 4: Login flow
- [ ] Test 5: Logout flow
- [ ] Test 6: Remember Me
- [ ] Test 7: Direct URL logged in
- [ ] Test 8: Direct URL logged out

**Performance:**
- [ ] Auth init < 50ms
- [ ] Loading spinner < 100ms

**Edge Cases:**
- [ ] Corrupted data handled
- [ ] Partial data handled
- [ ] Offline mode works

**Overall Result:** [ ] ALL PASS / [ ] FAILURES FOUND

---

## Test Execution Log

**Tester:** _______________
**Date:** 2026-01-02
**Time Started:** _______
**Time Ended:** _______
**Browser:** Chrome / Firefox / Safari (circle one)
**Browser Version:** _______

**Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Recommendations:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Next Steps

**If ALL tests pass:**
1. Mark bug fix as VERIFIED
2. Document in completion report
3. Close bug fix plan
4. Deploy to production (if applicable)

**If ANY test fails:**
1. Document failure in detail
2. Identify root cause
3. Apply additional fixes
4. Re-run full test suite
5. DO NOT mark as complete until 100% pass rate

---

**End of Testing Guide**
