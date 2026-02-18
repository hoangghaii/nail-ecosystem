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

## Business Info

### Get Business Information
```
GET /business-info
Public endpoint (no authentication required)

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "phone": "(555) 123-4567",
  "email": "hello@pinknail.com",
  "address": "123 Beauty Lane, San Francisco, CA 94102",
  "businessHours": [
    {
      "day": "monday",
      "openTime": "09:00",
      "closeTime": "19:00",
      "closed": false
    },
    {
      "day": "tuesday",
      "openTime": "09:00",
      "closeTime": "19:00",
      "closed": false
    },
    {
      "day": "wednesday",
      "openTime": "09:00",
      "closeTime": "19:00",
      "closed": false
    },
    {
      "day": "thursday",
      "openTime": "09:00",
      "closeTime": "20:00",
      "closed": false
    },
    {
      "day": "friday",
      "openTime": "09:00",
      "closeTime": "20:00",
      "closed": false
    },
    {
      "day": "saturday",
      "openTime": "10:00",
      "closeTime": "18:00",
      "closed": false
    },
    {
      "day": "sunday",
      "openTime": "00:00",
      "closeTime": "00:00",
      "closed": true
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Update Business Information
```
PATCH /business-info
Authorization: Bearer {accessToken}
Content-Type: application/json

Body (all fields optional):
{
  "phone": "(555) 987-6543",
  "email": "newemail@pinknail.com",
  "address": "456 New St, City, ST 12345",
  "businessHours": [
    {
      "day": "monday",
      "openTime": "10:00",
      "closeTime": "20:00",
      "closed": false
    }
    // ... (must provide all 7 days if updating)
  ]
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "phone": "(555) 987-6543",
  "email": "newemail@pinknail.com",
  "address": "456 New St, City, ST 12345",
  "businessHours": [ ... ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-16T12:00:00.000Z"
}

Response: 401 Unauthorized (if not authenticated)
Response: 404 Not Found (if business info doesn't exist)
Response: 400 Bad Request (if validation fails)
```

**Notes**:
- GET endpoint is public (used by client ContactPage + Footer)
- PATCH endpoint requires admin authentication (used by admin BusinessInfoForm)
- Business hours must include all 7 days if provided
- Times in 24-hour format (HH:MM)
- Auto-creates default data if not exists

**Apps Using Business Info API**:
- **Client (read-only)**: ContactPage, Footer - Display business hours and contact information
- **Admin (CRUD)**: BusinessInfoForm - Full edit capability with form validation

---

## Services

### List All Services
```
GET /services

Query Parameters (all optional):
- category: Filter by category (manicure, pedicure, spa-treatment, nail-art, waxing)
- featured: Filter featured services (true/false)
- isActive: Filter active services (true/false)
- page: Page number (default: 1, min: 1)
- limit: Items per page (default: 10, min: 1, max: 100)

Examples:
GET /services?category=manicure&isActive=true
GET /services?featured=true
GET /services?category=pedicure&page=2&limit=20

Response: 200 OK
{
  "data": [
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
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
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

Query Parameters (all optional):
- categoryId: Filter by category ID (string, MongoDB ObjectId)
- category: DEPRECATED - Filter by category enum (use categoryId instead)
- featured: Filter featured items (true/false)
- isActive: Filter active items (true/false)
- nailShape: Filter by nail shape (almond, coffin, square, stiletto)
- style: Filter by nail style (3d, mirror, gem, ombre)
- search: Search across title, description, and price
- page: Page number (default: 1, min: 1)
- limit: Items per page (default: 10, min: 1, max: 100)

Examples:
GET /gallery?categoryId=507f1f77bcf86cd799439011&isActive=true
GET /gallery?featured=true
GET /gallery?nailShape=almond&style=3d
GET /gallery?categoryId=507f1f77bcf86cd799439011&page=2&limit=20
GET /gallery?search=summer

Response: 200 OK
{
  "data": [
    {
      "id": "gallery_id",
      "title": "Elegant Nail Art",
      "imageUrl": "https://...",
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Nail Art",
        "slug": "nail-art"
      },
      "description": "Custom design",
      "featured": true,
      "nailShape": "almond",
      "style": "3d",
      "price": "$45",
      "duration": "60 minutes",
      "createdAt": "2025-12-31T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
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
Content-Type: multipart/form-data

Body:
{
  "image": <binary>,
  "title": "Elegant Nail Art",
  "categoryId": "507f1f77bcf86cd799439011",
  "description": "Custom design",
  "price": "$45",
  "duration": "60 minutes",
  "featured": true,
  "nailShape": "almond",  // Optional: almond, coffin, square, stiletto
  "style": "3d"           // Optional: 3d, mirror, gem, ombre
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

Query Parameters (all optional):
- status: Filter by status (pending, confirmed, completed, cancelled)
- serviceId: Filter by service ID (MongoDB ObjectId)
- date: Filter by booking date (ISO 8601 format: YYYY-MM-DD)
- search: Search across customer name, email, and phone
- sortBy: Sort field (date, createdAt, customerName) (default: date)
- sortOrder: Sort order (asc, desc) (default: desc)
- page: Page number (default: 1, min: 1)
- limit: Items per page (default: 10, min: 1, max: 100)

Examples:
GET /bookings?status=pending&search=john
GET /bookings?sortBy=date&sortOrder=desc
GET /bookings?status=confirmed&date=2025-12-31
GET /bookings?search=jane@example.com&page=1&limit=20

Response: 200 OK
{
  "data": [
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
  ],
  "pagination": {
    "total": 75,
    "page": 1,
    "limit": 10,
    "totalPages": 8
  }
}
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

**Last Updated**: 2026-02-18
**API Version**: 0.1.5
**Latest Addition**: Gallery filtering by nail shape and style (Phase 5) (2026-02-18)
