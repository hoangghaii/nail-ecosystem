# API Endpoints — Bookings

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## List Bookings (Admin)
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

## Get Booking by ID
```
GET /bookings/:id

Response: 200 OK
```

## Create Booking (Customer)
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

## Update Booking (Admin)
```
PATCH /bookings/:id
Authorization: Bearer {accessToken}

Body:
{
  "status": "confirmed"
}

Response: 200 OK
```

## Cancel Booking
```
DELETE /bookings/:id

Response: 204 No Content
```
