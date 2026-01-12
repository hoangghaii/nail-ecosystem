# Phase 5: Testing & Verification

**Duration**: 4 minutes
**Files**: 0 (testing only)

---

## Objective

Verify implementation works correctly via type-check, manual API testing, and admin UI integration.

---

## Test 1: Type-Check

**Command**:
```bash
npm run type-check
```

**Expected**: No TypeScript errors

**If errors occur**:
- Check DTO import path
- Verify service method signature
- Confirm controller parameter types

---

## Test 2: Build Verification

**Command**:
```bash
cd apps/api
npm run build
```

**Expected**: Build succeeds without errors

---

## Test 3: Start API Server

**Command**:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-api
```

**Expected**: Server starts on port 3000

---

## Test 4: Manual API Testing

### Prerequisites

1. **Get JWT token**:
   ```bash
   # Login to get token
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "yourpassword"
     }'

   # Copy accessToken from response
   ```

2. **Get contact ID**:
   ```bash
   # List contacts
   curl -X GET http://localhost:3000/contacts \
     -H "Authorization: Bearer {accessToken}"

   # Copy _id from any contact
   ```

### Test 4.1: Valid Update

**Request**:
```bash
curl -X PATCH http://localhost:3000/contacts/{contactId}/notes \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": "Test note from API - followed up via email"}'
```

**Expected Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "subject": "Booking inquiry",
  "status": "new",
  "adminNotes": "Test note from API - followed up via email",
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-10T10:15:00.000Z"
}
```

**Verify**:
- ✅ Status code 200
- ✅ `adminNotes` updated to new value
- ✅ `status` field unchanged
- ✅ `updatedAt` timestamp changed

---

### Test 4.2: Invalid ID Format

**Request**:
```bash
curl -X PATCH http://localhost:3000/contacts/invalid-id/notes \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": "Test"}'
```

**Expected Response** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": "Invalid contact ID",
  "error": "Bad Request"
}
```

---

### Test 4.3: Non-existent ID

**Request**:
```bash
curl -X PATCH http://localhost:3000/contacts/507f1f77bcf86cd799439099/notes \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": "Test"}'
```

**Expected Response** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Contact with ID 507f1f77bcf86cd799439099 not found",
  "error": "Not Found"
}
```

---

### Test 4.4: Empty Admin Notes

**Request**:
```bash
curl -X PATCH http://localhost:3000/contacts/{contactId}/notes \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": ""}'
```

**Expected Response** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": ["Admin notes cannot be empty"],
  "error": "Bad Request"
}
```

---

### Test 4.5: Unauthorized Access

**Request**:
```bash
curl -X PATCH http://localhost:3000/contacts/{contactId}/notes \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": "Test"}'
```

**Expected Response** (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### Test 4.6: Notes Too Long (>1000 chars)

**Request**:
```bash
curl -X PATCH http://localhost:3000/contacts/{contactId}/notes \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": "'"$(printf 'A%.0s' {1..1001})"'"}'
```

**Expected Response** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": ["Admin notes cannot exceed 1000 characters"],
  "error": "Bad Request"
}
```

---

## Test 5: Swagger UI Verification

1. Open `http://localhost:3000/api` in browser
2. Navigate to "Contacts" section
3. Find `PATCH /contacts/{id}/notes`
4. Verify:
   - ✅ Endpoint visible
   - ✅ "Authorize" lock icon present
   - ✅ Request body schema shows `adminNotes` field
   - ✅ Response examples present
   - ✅ All error codes documented (400, 401, 404)

---

## Test 6: Admin UI Integration

### Setup

1. Start admin app:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-admin
   ```

2. Open `http://localhost:5174` in browser

3. Login with admin credentials

### Test Flow

1. **Navigate**: Dashboard → Contacts page

2. **Select Contact**: Click any contact row (status "new")

3. **Open Details Modal**: Contact details should display

4. **Add Admin Note**:
   - Find admin notes textarea
   - Type: "Test note from UI - integration test"
   - Click "Save" or "Update Notes" button

5. **Verify Success**:
   - ✅ Toast message: "Admin notes updated successfully"
   - ✅ Note appears in modal
   - ✅ No console errors (F12 DevTools)
   - ✅ Status still shows "new" (unchanged)

6. **Verify Persistence**:
   - Close modal
   - Reopen same contact
   - ✅ Note persists

### React Query DevTools Check

1. Open React Query DevTools (bottom-left icon)
2. Find `contacts.detail` query
3. Check network tab:
   - ✅ Request: `PATCH /contacts/{id}/notes`
   - ✅ Response: 200 OK
   - ✅ Response body contains updated `adminNotes`

---

## Test 7: Database Verification

**Command**:
```bash
docker exec -it nail-mongo mongosh

use nail_salon

db.contacts.findOne({ _id: ObjectId("{contactId}") })
```

**Expected**:
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  firstName: "Jane",
  status: "new",  // ← Unchanged
  adminNotes: "Test note from API - followed up via email",  // ← Updated
  updatedAt: ISODate("2026-01-10T10:15:00.000Z")  // ← Recent
}
```

---

## Success Criteria Checklist

### API Tests
- [ ] Type-check passes
- [ ] Build succeeds
- [ ] Valid update returns 200 OK
- [ ] Invalid ID returns 400 Bad Request
- [ ] Non-existent ID returns 404 Not Found
- [ ] Empty notes returns 400 Bad Request
- [ ] Unauthorized returns 401 Unauthorized
- [ ] Long notes (>1000) returns 400 Bad Request
- [ ] Swagger UI displays endpoint correctly

### Admin UI Tests
- [ ] Contact details modal opens
- [ ] Admin notes textarea visible
- [ ] Save button triggers mutation
- [ ] Toast success message appears
- [ ] Notes persist in database
- [ ] Status field unchanged
- [ ] No console errors
- [ ] React Query DevTools shows successful mutation

### Database Tests
- [ ] `adminNotes` field updated in MongoDB
- [ ] `status` field unchanged
- [ ] `updatedAt` timestamp updated

---

## Troubleshooting

**Issue**: 404 endpoint not found
**Fix**: Restart API server (`docker compose restart nail-api`)

**Issue**: Validation error not showing
**Fix**: Check ValidationPipe in `main.ts` is configured

**Issue**: Admin UI hook fails
**Fix**: Verify admin service URL matches API port (3000)

---

## Final Verification

**All tests passing?** ✅ Implementation complete, ready for commit.

**Any test failing?** ❌ Debug issue, rerun tests.

---

## Next Step

Git commit:
```bash
git add .
git commit -m "feat(api): add PATCH /contacts/:id/notes endpoint for granular notes update

- Add UpdateContactNotesDto with validation
- Add ContactsService.updateNotes() method
- Add controller endpoint with Swagger docs
- Update API documentation
- Tested: API manually, admin UI integration, database persistence"
```
