# Phase 01 — Leaflet Map Integration (Index)

**Context**: [Codebase Analysis](./reports/01-codebase-analysis.md) | [Plan](./plan.md)
**Status**: Pending
**Estimate**: 1 day

---

## Overview

Add an interactive Leaflet map to `apps/client` ContactPage sourcing salon coordinates from admin's business info. Coordinates stored explicitly as optional `latitude?`/`longitude?` fields. When absent, a styled placeholder renders instead of the map.

---

## Key Insights

1. `BusinessInfo` has **no lat/lng** — single-string address only. Schema change required across 3 layers.
2. `useBusinessInfo()` hook + service already exist in client — reuse as-is, no new data fetching.
3. Client design is **border-based, no shadows** — Leaflet default shadow styles must be suppressed.
4. Leaflet default marker icon breaks under Vite (webpack asset paths) — one-time fix utility needed.
5. `leaflet` + `react-leaflet` not in `apps/client/package.json` — must be installed.
6. Nominatim runtime geocoding rejected: rate-limit dependency + privacy concerns in production.
7. OSM tile attribution is legally required and must remain visible.

---

## Architecture

```
ContactPage.tsx
├── (existing) ContactInfoDisplay + ContactForm  [2-col grid]
└── (new) SalonMap  [below grid, full-width, lazy-loaded]
    ├── hasCoords → <LeafletMap> (react-leaflet MapContainer)
    └── no coords → <MapPlaceholder> (address text + directions link)

Shared Types  packages/types/src/business-info.ts
              + latitude?: number, longitude?: number

API Schema    apps/api/.../business-info.schema.ts
              + @Prop({ required: false }) lat/lng

API DTO       apps/api/.../update-business-info.dto.ts
              + @IsOptional() @IsNumber() lat/lng

Admin Form    apps/admin/.../BusinessInfoForm.tsx
              + two optional number inputs

Admin Zod     apps/admin/.../businessInfo.validation.ts
              + latitude/longitude optional number fields

Client (new)  apps/client/src/components/contact/salon-map.tsx
Client (new)  apps/client/src/utils/leaflet-icon-fix.ts
```

---

## Related Code Files

| File | Role |
|---|---|
| `packages/types/src/business-info.ts` | Shared type — add lat/lng |
| `apps/api/src/modules/business-info/schemas/business-info.schema.ts` | Mongoose schema — add lat/lng |
| `apps/api/src/modules/business-info/dto/update-business-info.dto.ts` | DTO validation — add lat/lng |
| `apps/admin/src/lib/validations/businessInfo.validation.ts` | Zod schema — add lat/lng |
| `apps/admin/src/components/contacts/BusinessInfoForm.tsx` | Admin form — add lat/lng inputs |
| `apps/client/src/pages/ContactPage.tsx` | Page — insert lazy SalonMap |
| `apps/client/src/components/contact/salon-map.tsx` | New: Leaflet map component |
| `apps/client/src/utils/leaflet-icon-fix.ts` | New: Vite marker icon fix |
| `apps/client/package.json` | Add leaflet + react-leaflet deps |

---

## Sub-Documents

| Doc | Content |
|---|---|
| [phase-01a-backend-shared-changes.md](./phase-01a-backend-shared-changes.md) | Steps 1–6: deps, shared types, API schema/DTO, admin form/validation |
| [phase-01b-client-changes.md](./phase-01b-client-changes.md) | Steps 7–10: icon fix, SalonMap component, ContactPage integration, todo list |
| [phase-01c-risk-security-criteria.md](./phase-01c-risk-security-criteria.md) | Risk table, security notes, success criteria, next steps |
