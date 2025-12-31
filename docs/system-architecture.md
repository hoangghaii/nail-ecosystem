# System Architecture

Pink Nail Salon - Complete Business Management Ecosystem

---

## High-Level Overview

**Architecture**: Client (5173) + Admin (5174) → API (3000) → MongoDB/Redis/Cloudinary

**Production**: Nginx reverse proxy routing:
- `/` → nail-client
- `/admin` → nail-admin
- `/api` → nail-api

---

## Component Architecture

### Frontend Layer

**nail-client** (Customer-facing)
- Port: 5173 (dev) / served from / (prod)
- React 19 + Vite + TypeScript
- Tailwind CSS v4, Radix UI
- TanStack Query for data fetching

**nail-admin** (Admin dashboard)
- Port: 5174 (dev) / served from /admin (prod)
- React 19 + Vite + TypeScript
- Shadcn/ui components
- TanStack Query + Zustand

### Backend Layer

**nail-api** (REST API)
- Port: 3000
- NestJS 11 + TypeScript
- MongoDB (Mongoose) for data
- Redis (ioredis) for caching
- JWT authentication (access + refresh tokens)
- Argon2 password hashing
- Cloudinary image storage

### External Services

**MongoDB Atlas**
- Primary database
- Document storage for services, gallery, bookings, users

**Redis Cloud**
- Session caching
- Rate limiting storage
- Query result caching

**Cloudinary**
- Image upload and storage
- Image transformations
- CDN delivery

---

## Network Architecture

### Development Mode

```
┌─────────────────────────────────────────┐
│  Developer Machine                      │
│  ├─ nail-client:5173                   │
│  ├─ nail-admin:5174                    │
│  └─ nail-api:3000                      │
│     └─ External services (cloud)       │
└─────────────────────────────────────────┘
```

**CORS**: Enabled for localhost ports
**Hot Reload**: Vite HMR, NestJS watch mode

### Production Mode

```
┌─────────────────────────────────────────┐
│  Nginx Reverse Proxy (80/443)          │
│  ├─ / → nail-client (static)           │
│  ├─ /admin → nail-admin (static)       │
│  └─ /api → nail-api:3000               │
│     └─ External services (cloud)       │
└─────────────────────────────────────────┘
```

**CORS**: Configured for same-origin
**SSL**: Nginx handles TLS termination
**Caching**: Nginx static file caching

---

## Data Flow

### Customer Booking Flow

```
Client → API → MongoDB
  ↓       ↓
  ↓    Cloudinary (if image upload)
  ↓       ↓
  ↓    Redis (cache invalidation)
  ↓       ↓
  ←───────┘
```

### Admin Management Flow

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

### Gallery Display Flow

```
Client → API
  ↓       ↓
  ↓    Check Redis cache
  ↓       ↓
  ↓    If miss: MongoDB
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

## Deployment Architecture

### Docker Compose Stack

**Development**:
```yaml
services:
  nail-client:  # Hot reload, port 5173
  nail-admin:   # Hot reload, port 5174
  nail-api:     # Watch mode, port 3000
```

**Production**:
```yaml
services:
  nail-client:  # Built static files
  nail-admin:   # Built static files
  nail-api:     # Production build
  nginx:        # Reverse proxy (port 80)
```

### Container Communication

- **Development**: Direct port access
- **Production**: Nginx proxy routing via internal network

---

## Scalability Considerations

### Current Architecture

- Single API instance
- External managed services (MongoDB Atlas, Redis Cloud)
- Stateless API design (JWT tokens)

### Future Scaling Path

1. **Horizontal API Scaling**
   - Add load balancer before API
   - Deploy multiple API instances
   - Session state in Redis (already implemented)

2. **Database Optimization**
   - MongoDB read replicas
   - Query optimization
   - Index tuning

3. **Caching Strategy**
   - Increase Redis usage
   - CDN for static assets (Cloudinary already provides this)
   - API response caching

4. **Microservices (if needed)**
   - Split services module
   - Split booking module
   - Split gallery module
   - Event-driven communication

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

- HTTP-only cookies (if using cookie strategy)
- XSS protection (React escaping)
- HTTPS enforcement (production)
- Content Security Policy (via Nginx)

### Infrastructure Security

- Nginx reverse proxy (hides internal services)
- No direct database access from frontend
- Cloudinary signed uploads (if needed)
- Regular dependency updates

---

## Monitoring & Observability

### Health Checks

- API: `GET /health` endpoint
- Docker: Container health checks
- Database: MongoDB Atlas monitoring
- Cache: Redis Cloud monitoring

### Logging

- API: NestJS built-in logger
- Nginx: Access + error logs
- Docker: Container logs via `docker compose logs`

### Metrics (Future)

- Request latency
- Error rates
- Cache hit rates
- Database query performance

---

**Last Updated**: 2025-12-31
**Architecture Version**: 0.1.0
**Status**: Production-ready
