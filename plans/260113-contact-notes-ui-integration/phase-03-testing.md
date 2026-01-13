# Phase 3: Testing & Verification

**Duration**: 5 minutes
**Prerequisites**: Phases 1-2 complete

---

## Objective

Verify integration works correctly via manual UI testing, type-checking, and network monitoring.

---

## Pre-Testing Checklist

### 1. Type-Check

```bash
cd /Users/hainguyen/Documents/nail-project
npm run type-check
```

**Expected**: ✅ 0 errors across all apps

---

### 2. Build Verification

```bash
npm run build --filter=admin
```

**Expected**: ✅ Build succeeds without errors

---

### 3. Start Development Environment

```bash
# Terminal 1: Start all services
npm run dev

# Or Docker Compose
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Expected**: Admin runs on http://localhost:5174

---

## Manual Test Cases

### Test Setup

1. Navigate to http://localhost:5174/admin
2. Login with admin credentials
3. Go to Contacts section
4. Open any contact detail modal

---

### Test 1: Notes-Only Update ✅

**Steps**:
1. Open contact with status "new"
2. Add admin notes: "Customer called, requested appointment for Friday"
3. **Do NOT change status dropdown** (leave as "new")
4. Click "Save Changes"

**Expected Results**:
- ✅ Toast: "Admin notes updated successfully"
- ✅ Modal closes
- ✅ Network tab shows: `PATCH /contacts/:id/notes`
- ✅ Request body: `{"adminNotes": "Customer called..."}`
- ✅ Response status: 200 OK
- ✅ Status badge remains "new"
- ✅ Notes visible when reopening modal

**Verify in React DevTools**:
- Query cache key `contacts.detail(id)` updated
- `adminNotes` field matches new value
- `status` field unchanged

---

### Test 2: Status-Only Update ✅

**Steps**:
1. Open same contact
2. Change status from "new" → "read"
3. **Do NOT modify admin notes**
4. Click "Save Changes"

**Expected Results**:
- ✅ Toast: "Contact status updated successfully"
- ✅ Modal closes
- ✅ Network tab shows: `PATCH /contacts/:id/status`
- ✅ Request body: `{"status": "read", "adminNotes": "Customer called..."}`
- ✅ Response status: 200 OK
- ✅ Status badge changes to "read"
- ✅ Notes preserved from previous update

---

### Test 3: Both Status + Notes Update ✅

**Steps**:
1. Open contact
2. Change status "read" → "responded"
3. Update notes: "Customer booked appointment for Friday 3pm"
4. Click "Save Changes"

**Expected Results**:
- ✅ Toast: "Contact status updated successfully"
- ✅ Network tab shows: `PATCH /contacts/:id/status`
- ✅ Request body: `{"status": "responded", "adminNotes": "Customer booked..."}`
- ✅ Both fields updated

---

### Test 4: Empty Notes Validation ❌

**Steps**:
1. Open contact with existing notes
2. Delete all notes (clear textarea)
3. Leave status unchanged
4. Click "Save Changes"

**Expected Results**:
- ✅ No API call made (notes unchanged from empty → empty)
- ✅ Modal closes normally
- ✅ No errors

**Alternative**: If notes had content → deleted:
- Notes changed but empty string won't pass backend validation
- This scenario handled by conditional guard: `if (data.adminNotes)`

---

### Test 5: Cancel Button ✅

**Steps**:
1. Open contact modal
2. Modify notes and/or status
3. Click "Cancel"

**Expected Results**:
- ✅ Modal closes
- ✅ No API calls made
- ✅ Changes discarded
- ✅ Form resets on reopen

---

### Test 6: Loading States ✅

**Steps**:
1. Open contact modal
2. Add notes, click "Save Changes"
3. Observe button during API call

**Expected Results**:
- ✅ Button text: "Saving..."
- ✅ Submit button disabled
- ✅ Cancel button disabled
- ✅ No double-submission possible

---

## Network Tab Verification

### Notes-Only Update

```http
PATCH http://localhost:3000/contacts/6965078aaf6353129b6aa609/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{"adminNotes": "Customer called, requested appointment for Friday"}
```

**Response (200)**:
```json
{
  "_id": "6965078aaf6353129b6aa609",
  "firstName": "Jane",
  "lastName": "Doe",
  "status": "new",
  "adminNotes": "Customer called, requested appointment for Friday",
  "updatedAt": "2026-01-13T10:30:00.000Z"
}
```

---

### Status Update

```http
PATCH http://localhost:3000/contacts/6965078aaf6353129b6aa609/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{"status": "read", "adminNotes": "Customer called, requested appointment for Friday"}
```

**Response (200)**:
```json
{
  "_id": "6965078aaf6353129b6aa609",
  "firstName": "Jane",
  "lastName": "Doe",
  "status": "read",
  "adminNotes": "Customer called, requested appointment for Friday",
  "updatedAt": "2026-01-13T10:31:00.000Z"
}
```

---

## Error Scenarios

### Unauthorized (401)

**Trigger**: Logout, try to update contact

**Expected**:
- ✅ API returns 401
- ✅ App redirects to login
- ✅ Toast: "Session expired"

---

### Contact Not Found (404)

**Trigger**: Update contact that was deleted by another admin

**Expected**:
- ✅ API returns 404
- ✅ Toast: "Contact not found"
- ✅ Modal closes
- ✅ Contact list refreshed

---

### Network Error

**Trigger**: Stop API server, try update

**Expected**:
- ✅ Toast: "Failed to update contact"
- ✅ Modal stays open
- ✅ User can retry

---

## React DevTools Inspection

### Query Cache

```javascript
// Open React DevTools → React Query tab
// Inspect cache keys:

contacts.lists() → Array<Contact> (invalidated after update)
contacts.detail("6965078aaf6353129b6aa609") → Contact (updated directly)
```

### Mutation Status

```javascript
// Check mutation state:
updateNotes.isPending: false
updateNotes.isSuccess: true
updateNotes.data: Contact {...}

updateStatus.isPending: false
updateStatus.isSuccess: true
```

---

## Success Criteria Checklist

- [ ] Type-check passes (0 errors)
- [ ] Build succeeds without warnings
- [ ] Test 1: Notes-only update → Correct API endpoint called
- [ ] Test 2: Status-only update → Correct API endpoint called
- [ ] Test 3: Both updates → Status endpoint used
- [ ] Test 4: Empty notes → No validation errors
- [ ] Test 5: Cancel works → No API calls
- [ ] Test 6: Loading states → UI disabled during save
- [ ] Network tab: Correct endpoints called with correct bodies
- [ ] React DevTools: Cache updated correctly
- [ ] No console errors during any operation
- [ ] Toast notifications accurate for each operation

---

## Rollback Plan

If critical issues found:

1. **Revert validation schema**:
   ```bash
   git checkout apps/admin/src/lib/validations/contact.validation.ts
   ```

2. **Revert modal component**:
   ```bash
   git checkout apps/admin/src/components/contacts/ContactDetailsModal.tsx
   ```

3. **Verify original behavior restored**:
   ```bash
   npm run type-check && npm run build --filter=admin
   ```

---

## Completion

✅ All tests pass → Mark implementation complete
❌ Issues found → Document in unresolved questions, fix or rollback

---

## Next Steps

- Create commit: `feat(admin): integrate PATCH /contacts/:id/notes in ContactDetailsModal`
- Update project roadmap
- Document in API integration guide (if exists)
- Consider future enhancement: separate "Save Notes" button (low priority)
