# API Endpoints Reference

Pink Nail Salon REST API (NestJS)

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## Authentication

### Register
```
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "accessToken": "jwt_token",
  "refreshToken": "nail_admin_refresh_token"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "accessToken": "jwt_token",
  "refreshToken": "nail_admin_refresh_token"
}
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Body:
{
  "refreshToken": "nail_admin_refresh_token"
}

Response: 200 OK
{
  "accessToken": "new_jwt_token"
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {accessToken}

Response: 200 OK
```

---

## Services

### List All Services
```
GET /services
Query params: ?category={category}&featured={true|false}

Response: 200 OK
[
  {
    "id": "service_id",
    "name": "Gel Manicure",
    "description": "Long-lasting gel polish",
    "category": "manicure",
    "price": 35,
    "duration": 45,
    "imageUrl": "https://...",
    "featured": true
  }
]
```

### Get Service by ID
```
GET /services/:id

Response: 200 OK
{
  "id": "service_id",
  "name": "Gel Manicure",
  ...
}
```

### Create Service (Admin)
```
POST /services
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "name": "Gel Manicure",
  "description": "Long-lasting gel polish",
  "category": "manicure",
  "price": 35,
  "duration": 45,
  "imageUrl": "https://...",
  "featured": true
}

Response: 201 Created
```

### Update Service (Admin)
```
PATCH /services/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: (partial update)
{
  "price": 40
}

Response: 200 OK
```

### Delete Service (Admin)
```
DELETE /services/:id
Authorization: Bearer {accessToken}

Response: 204 No Content
```

---

## Gallery

### List Gallery Items
```
GET /gallery
Query params: ?category={category}&featured={true|false}

Response: 200 OK
[
  {
    "id": "gallery_id",
    "title": "Elegant Nail Art",
    "imageUrl": "https://...",
    "category": "nail-art",
    "description": "Custom design",
    "featured": true,
    "createdAt": "2025-12-31T00:00:00Z"
  }
]
```

### Get Gallery Item by ID
```
GET /gallery/:id

Response: 200 OK
```

### Create Gallery Item (Admin)
```
POST /gallery
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "title": "Elegant Nail Art",
  "imageUrl": "https://...",
  "category": "nail-art",
  "description": "Custom design",
  "featured": true
}

Response: 201 Created
```

### Update Gallery Item (Admin)
```
PATCH /gallery/:id
Authorization: Bearer {accessToken}

Response: 200 OK
```

### Delete Gallery Item (Admin)
```
DELETE /gallery/:id
Authorization: Bearer {accessToken}

Response: 204 No Content
```

---

## Bookings

### List Bookings (Admin)
```
GET /bookings
Authorization: Bearer {accessToken}
Query params: ?status={pending|confirmed|completed|cancelled}&date={YYYY-MM-DD}

Response: 200 OK
[
  {
    "id": "booking_id",
    "serviceId": "service_id",
    "date": "2025-12-31",
    "timeSlot": "10:00",
    "customerInfo": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "+1234567890"
    },
    "notes": "Prefer natural colors",
    "status": "pending"
  }
]
```

### Get Booking by ID
```
GET /bookings/:id

Response: 200 OK
```

### Create Booking (Customer)
```
POST /bookings
Content-Type: application/json

Body:
{
  "serviceId": "service_id",
  "date": "2025-12-31",
  "timeSlot": "10:00",
  "customerInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+1234567890"
  },
  "notes": "Prefer natural colors"
}

Response: 201 Created
```

### Update Booking (Admin)
```
PATCH /bookings/:id
Authorization: Bearer {accessToken}

Body:
{
  "status": "confirmed"
}

Response: 200 OK
```

### Cancel Booking
```
DELETE /bookings/:id

Response: 204 No Content
```

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

---

## Image Upload

### Upload Image to Cloudinary
```
POST /upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Body:
file: <binary>

Response: 200 OK
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "cloudinary_public_id"
}
```

---

## Health Check

### API Health
```
GET /health

Response: 200 OK
{
  "status": "ok",
  "timestamp": "2025-12-31T00:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error details"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

**Last Updated**: 2026-01-12
**API Version**: 0.1.2
**Latest Addition**: PATCH /contacts/:id/notes (2026-01-12)
