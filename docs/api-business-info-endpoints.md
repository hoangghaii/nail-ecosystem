# API Endpoints — Business Info

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## Get Business Information
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
    { "day": "monday",    "openTime": "09:00", "closeTime": "19:00", "closed": false },
    { "day": "tuesday",   "openTime": "09:00", "closeTime": "19:00", "closed": false },
    { "day": "wednesday", "openTime": "09:00", "closeTime": "19:00", "closed": false },
    { "day": "thursday",  "openTime": "09:00", "closeTime": "20:00", "closed": false },
    { "day": "friday",    "openTime": "09:00", "closeTime": "20:00", "closed": false },
    { "day": "saturday",  "openTime": "10:00", "closeTime": "18:00", "closed": false },
    { "day": "sunday",    "openTime": "00:00", "closeTime": "00:00", "closed": true  }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## Update Business Information
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
    { "day": "monday", "openTime": "10:00", "closeTime": "20:00", "closed": false }
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
- **Client (read-only)**: ContactPage, Footer
- **Admin (CRUD)**: BusinessInfoForm
