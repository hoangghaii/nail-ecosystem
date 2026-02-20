# API Endpoints — Contacts

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## Submit Contact Inquiry (Public)
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

## List Contacts (Admin)
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

## Get Contact by ID (Admin)
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

## Update Contact Status (Admin)
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

## Update Admin Notes Only (Admin)
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
