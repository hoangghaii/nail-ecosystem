# API Endpoints — Services

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## List All Services
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

## Get Service by ID
```
GET /services/:id

Response: 200 OK
{
  "id": "service_id",
  "name": "Gel Manicure",
  ...
}
```

## Create Service (Admin)
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

## Update Service (Admin)
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

## Delete Service (Admin)
```
DELETE /services/:id
Authorization: Bearer {accessToken}

Response: 204 No Content
```
