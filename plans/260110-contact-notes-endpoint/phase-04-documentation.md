# Phase 4: API Documentation

**Duration**: 3 minutes
**Files**: 1 modified

---

## Objective

Add new endpoint to API documentation for developer reference.

---

## Implementation

### File: `docs/api-endpoints.md`

**Add after Bookings section (after line 291), before Image Upload section**:

```markdown
---

## Contacts

### Submit Contact Inquiry (Public)
```
POST /contacts
Content-Type: application/json

Body:
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "subject": "Booking inquiry",
  "message": "I'd like to book an appointment for..."
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "subject": "Booking inquiry",
  "message": "I'd like to book...",
  "status": "new",
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-10T10:00:00.000Z"
}
```

### List Contacts (Admin)
```
GET /contacts
Authorization: Bearer {accessToken}
Query params: ?status={new|read|responded|archived}&page={number}&limit={number}

Response: 200 OK
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "subject": "Booking inquiry",
      "message": "I'd like to book...",
      "status": "new",
      "adminNotes": "Followed up via email",
      "createdAt": "2026-01-10T10:00:00.000Z",
      "updatedAt": "2026-01-10T10:15:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Get Contact by ID (Admin)
```
GET /contacts/:id
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Jane",
  ...
}
```

### Update Contact Status (Admin)
```
PATCH /contacts/:id/status
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "status": "responded",
  "adminNotes": "Customer called back and booked appointment"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "responded",
  "adminNotes": "Customer called back and booked appointment",
  "respondedAt": "2026-01-10T10:15:00.000Z",
  ...
}
```

### Update Admin Notes Only (Admin)
```
PATCH /contacts/:id/notes
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "adminNotes": "Followed up via email"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "new",  // ← Status unchanged
  "adminNotes": "Followed up via email",  // ← Updated
  ...
}

Note: Use this endpoint to update notes without changing status.
To update both status and notes, use PATCH /contacts/:id/status.
```

```

---

## Documentation Structure

**Contacts Section includes**:
1. ✅ Submit inquiry (public, POST)
2. ✅ List all (admin, GET with pagination)
3. ✅ Get by ID (admin, GET)
4. ✅ Update status (admin, PATCH)
5. ✅ **Update notes only** (admin, PATCH) ← NEW

---

## Key Points Highlighted

**In the "Update Admin Notes Only" section**:

1. **Purpose**: Clearly states "update notes without changing status"
2. **Status behavior**: Example shows `status: "new"` unchanged
3. **Notes updated**: Example shows `adminNotes` modified
4. **Usage note**: Explains when to use this vs `/status` endpoint

---

## Success Criteria

- [x] Contacts section added to docs
- [x] All 5 endpoints documented
- [x] Request/response examples provided
- [x] Query parameters documented
- [x] Auth requirements noted
- [x] Usage notes included
- [x] Markdown formatting correct

---

## Next Phase

Phase 5: Testing & Verification (manual API test + admin UI integration)
