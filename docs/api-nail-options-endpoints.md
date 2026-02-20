# API Endpoints — Nail Options (Shapes & Styles)

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

These endpoints provide the lookup lists used to populate nail shape and nail style filters on the gallery. Values are dynamic (admin-managed) rather than hard-coded enums.

---

## Nail Shapes (`/nail-shapes`)

### List Nail Shapes
```
GET /nail-shapes?isActive=true
Public endpoint (no authentication required)

Query Parameters (all optional):
- isActive: Filter active shapes only (true/false)

Response: 200 OK
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "value": "almond",
      "label": "Almond",
      "labelVi": "Hình Hạnh Nhân",
      "isActive": true,
      "sortIndex": 0
    }
  ]
}
```

### Create Nail Shape (Admin)
```
POST /nail-shapes
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "value": "almond",       // Required — URL-safe slug, must match /^[a-z0-9-]+$/
  "label": "Almond",       // Required — English display label
  "labelVi": "Hình Hạnh Nhân", // Required — Vietnamese display label
  "isActive": true,        // Optional (default: true)
  "sortIndex": 0           // Optional (default: 0) — display order
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "value": "almond",
  "label": "Almond",
  "labelVi": "Hình Hạnh Nhân",
  "isActive": true,
  "sortIndex": 0
}
```

### Update Nail Shape (Admin)
```
PATCH /nail-shapes/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: (all fields optional — partial update)
{
  "label": "Almond Shape",
  "isActive": false
}

Response: 200 OK
```

### Delete Nail Shape (Admin)
```
DELETE /nail-shapes/:id
Authorization: Bearer {accessToken}

Response: 204 No Content
```

---

## Nail Styles (`/nail-styles`)

Same endpoint shape as `/nail-shapes` but at `/nail-styles`.

### List Nail Styles
```
GET /nail-styles?isActive=true
Public endpoint (no authentication required)

Response: 200 OK
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "value": "3d",
      "label": "3D Art",
      "labelVi": "Nghệ Thuật 3D",
      "isActive": true,
      "sortIndex": 0
    }
  ]
}
```

### Create Nail Style (Admin)
```
POST /nail-styles
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "value": "3d",           // Required — URL-safe slug, must match /^[a-z0-9-]+$/
  "label": "3D Art",       // Required — English display label
  "labelVi": "Nghệ Thuật 3D", // Required — Vietnamese display label
  "isActive": true,        // Optional (default: true)
  "sortIndex": 0           // Optional (default: 0)
}

Response: 201 Created
```

### Update Nail Style (Admin)
```
PATCH /nail-styles/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: (partial update)
{
  "label": "3D Nail Art",
  "sortIndex": 1
}

Response: 200 OK
```

### Delete Nail Style (Admin)
```
DELETE /nail-styles/:id
Authorization: Bearer {accessToken}

Response: 204 No Content
```

---

**Notes**:
- `value` is the slug used in gallery filter params (`nailShape`, `nailStyle`)
- `value` must be unique and match `/^[a-z0-9-]+$/`
- Both collections are seeded with default values; admin can extend them
- Changes take effect immediately on the gallery filter UI
