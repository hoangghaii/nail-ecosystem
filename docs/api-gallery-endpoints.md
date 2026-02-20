# API Endpoints — Gallery

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## List Gallery Items
```
GET /gallery

Query Parameters (all optional):
- featured: Filter featured items (true/false)
- isActive: Filter active items (true/false)
- nailShape: Filter by nail shape slug (e.g. almond, coffin, square, stiletto)
- nailStyle: Filter by nail style slug (e.g. 3d, mirror, gem, ombre)
         Note: API maps nailStyle query param → style field in DB (backward compat)
- search: Search across title, description, and price
- page: Page number (default: 1, min: 1)
- limit: Items per page (default: 10, min: 1, max: 100)

Examples:
GET /gallery?isActive=true
GET /gallery?featured=true
GET /gallery?nailShape=almond&nailStyle=3d
GET /gallery?page=2&limit=20
GET /gallery?search=summer

Response: 200 OK
{
  "data": [
    {
      "id": "gallery_id",
      "title": "Elegant Nail Art",
      "imageUrl": "https://...",
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

**Notes**:
- `categoryId` and `category` query params have been removed; filter by `nailShape`/`nailStyle` instead
- Response items no longer include a `category` field
- `nailStyle` is the query param name; the stored DB field is `style` (backward compat alias)

## Get Gallery Item by ID
```
GET /gallery/:id

Response: 200 OK
```

## Create Gallery Item (Admin)
```
POST /gallery
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Body:
{
  "image": <binary>,
  "title": "Elegant Nail Art",
  "description": "Custom design",
  "price": "$45",
  "duration": "60 minutes",
  "featured": true,
  "nailShape": "almond",  // Optional — slug from /nail-shapes
  "style": "3d"           // Optional — slug from /nail-styles
}

Response: 201 Created
```

## Update Gallery Item (Admin)
```
PATCH /gallery/:id
Authorization: Bearer {accessToken}

Response: 200 OK
```

## Delete Gallery Item (Admin)
```
DELETE /gallery/:id
Authorization: Bearer {accessToken}

Response: 204 No Content
```
