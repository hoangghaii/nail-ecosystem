# Architecture — Data Flows & Authentication

---

## Customer Booking Flow

```
Client → API → MongoDB
  ↓       ↓
  ↓    Cloudinary (if image upload)
  ↓       ↓
  ↓    Redis (cache invalidation)
  ↓       ↓
  ←───────┘
```

---

## Admin Management Flow

```
Admin → API → MongoDB
  ↓      ↓
  ↓   Validation + Auth check
  ↓      ↓
  ↓   Update data
  ↓      ↓
  ↓   Clear Redis cache
  ↓      ↓
  ←──────┘
```

---

## Gallery Display Flow

```
Client → API
  ↓       ↓
  ↓    Check Redis cache
  ↓       ↓
  ↓    If miss: MongoDB query (with nailShape / nailStyle filters)
  ↓       ↓
  ↓    Cache result
  ↓       ↓
  ←───────┘
  ↓
Display (Cloudinary CDN URLs)
```

---

## Authentication Flow

```
1. Login Request
   Client/Admin → POST /auth/login
                    ↓
              Validate credentials (Argon2)
                    ↓
              Generate tokens (JWT)
                    ↓
              Store refresh token (MongoDB)
                    ↓
              Return access + refresh tokens

2. Authenticated Request
   Client/Admin → GET /api/resource (Bearer token)
                    ↓
              Verify access token
                    ↓
              Execute request
                    ↓
              Return response

3. Token Refresh
   Client/Admin → POST /auth/refresh (refresh token)
                    ↓
              Validate refresh token (MongoDB)
                    ↓
              Generate new access token
                    ↓
              Return new access token
```

---

## Security Architecture

### API Security
- JWT authentication (RS256)
- Argon2 password hashing
- Rate limiting (@nestjs/throttler + Redis)
- Input validation (class-validator)
- CORS configuration
- Environment variable secrets

### Frontend Security
- XSS protection (React escaping)
- HTTPS enforcement (production)
- Content Security Policy (via Nginx)

### Infrastructure Security
- Nginx reverse proxy (hides internal services)
- No direct database access from frontend
- Cloudinary signed uploads (if needed)
- Regular dependency updates
