# System Architecture

Pink Nail Salon — Turborepo Monorepo Architecture

---

## High-Level Overview

**Monorepo**: Turborepo with 3 apps + 7 shared packages
**Architecture**: Client (5173) + Admin (5174) → API (3000) → MongoDB / Redis / Cloudinary
**Build System**: Turborepo 2.3 (7s full / 89ms cached, 79x faster)

**Production routing** (Nginx reverse proxy):
- `/` → apps/client (customer site)
- `/admin` → apps/admin (dashboard)
- `/api` → apps/api (NestJS backend)

---

## Detailed Documentation (modular files)

| Concern | File |
|---|---|
| Components, monorepo structure, shared packages, external services | [architecture-components.md](./architecture-components.md) |
| Network topology, Docker dev/prod, container communication | [architecture-network-deployment.md](./architecture-network-deployment.md) |
| Data flows (booking, gallery, auth), security model | [architecture-data-flows.md](./architecture-data-flows.md) |
| Turborepo build config, performance, caching, monitoring | [architecture-build-system.md](./architecture-build-system.md) |

---

## Database Collections (MongoDB)

| Collection | Purpose |
|---|---|
| `services` | Salon service catalog |
| `gallery` | Gallery items (images, metadata) |
| `bookings` | Customer appointment bookings |
| `users` | Admin user accounts |
| `business_info` | Business hours, contact details |
| `contacts` | Customer contact inquiries |
| `nail_shapes` | Admin-managed nail shape lookup (value, label, labelVi, isActive, sortIndex) |
| `nail_styles` | Admin-managed nail style lookup (same schema as nail_shapes) |

`nail_shapes` and `nail_styles` were added to support the dynamic gallery filter system (replaces hard-coded enums).

---

**Last Updated**: 2026-02-19
**Architecture Version**: 0.1.1
**Status**: Production-ready
**Changes**: Added nail_shapes / nail_styles collections; gallery category filter removed (2026-02-19)
