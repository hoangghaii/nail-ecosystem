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

**Last Updated**: 2025-12-31
**API Version**: 0.1.0
