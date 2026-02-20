# API Endpoints — Upload & Health

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

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
