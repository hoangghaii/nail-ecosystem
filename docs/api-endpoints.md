# API Endpoints Reference

Pink Nail Salon REST API (NestJS)

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## Quick Reference

| Resource | Method | Path | Auth |
|---|---|---|---|
| **Auth** | POST | /auth/register | — |
| | POST | /auth/login | — |
| | POST | /auth/refresh | — |
| | POST | /auth/logout | JWT |
| **Business Info** | GET | /business-info | — |
| | PATCH | /business-info | JWT |
| **Services** | GET | /services | — |
| | GET | /services/:id | — |
| | POST | /services | JWT |
| | PATCH | /services/:id | JWT |
| | DELETE | /services/:id | JWT |
| **Gallery** | GET | /gallery | — |
| | GET | /gallery/:id | — |
| | POST | /gallery | JWT |
| | PATCH | /gallery/:id | JWT |
| | DELETE | /gallery/:id | JWT |
| **Nail Shapes** | GET | /nail-shapes | — |
| | POST | /nail-shapes | JWT |
| | PATCH | /nail-shapes/:id | JWT |
| | DELETE | /nail-shapes/:id | JWT |
| **Nail Styles** | GET | /nail-styles | — |
| | POST | /nail-styles | JWT |
| | PATCH | /nail-styles/:id | JWT |
| | DELETE | /nail-styles/:id | JWT |
| **Bookings** | GET | /bookings | JWT |
| | GET | /bookings/:id | — |
| | POST | /bookings | — |
| | PATCH | /bookings/:id | JWT |
| | DELETE | /bookings/:id | — |
| **Contacts** | POST | /contacts | — |
| | GET | /contacts | JWT |
| | GET | /contacts/:id | JWT |
| | PATCH | /contacts/:id/status | JWT |
| | PATCH | /contacts/:id/notes | JWT |
| **Upload** | POST | /upload | JWT |
| **Health** | GET | /health | — |

---

## Detailed Documentation (modular files)

- [Authentication](./api-auth-endpoints.md) — register, login, refresh, logout
- [Business Info](./api-business-info-endpoints.md) — GET/PATCH /business-info
- [Services](./api-services-endpoints.md) — CRUD /services
- [Gallery](./api-gallery-endpoints.md) — CRUD /gallery, filter by nailShape/nailStyle
- [Nail Options](./api-nail-options-endpoints.md) — CRUD /nail-shapes and /nail-styles
- [Bookings](./api-bookings-endpoints.md) — CRUD /bookings
- [Contacts](./api-contacts-endpoints.md) — CRUD /contacts, status management
- [Upload & Health](./api-upload-health-endpoints.md) — /upload, /health, error shapes

---

## Notable Conventions

- All list endpoints return `{ data: T[], pagination: { total, page, limit, totalPages } }`
- Nail options list endpoints return `{ data: T[] }` (no pagination)
- JWT auth uses `Authorization: Bearer {accessToken}` header
- Gallery `nailStyle` query param maps to `style` field in DB (backward compat)
- Nail option `value` slugs must match `/^[a-z0-9-]+$/`

---

**Last Updated**: 2026-02-19
**API Version**: 0.1.6
**Latest Addition**: Nail Shapes and Nail Styles endpoints; gallery category filter removed (2026-02-19)
