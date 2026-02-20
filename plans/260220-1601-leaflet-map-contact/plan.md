# Plan — Leaflet Map on Contact Page

**Created**: 2026-02-20
**Scope**: `apps/client` contact page + shared types + API + admin settings
**Status**: Ready for implementation

---

## Problem

The contact page has no map. Salon coordinates are absent from `BusinessInfo` — only a free-text `address` string exists across all layers (shared type, API schema, admin form).

---

## Approach

Add optional `latitude?`/`longitude?` fields to `BusinessInfo` across all layers (shared types → API → admin). In the client, lazy-load a `SalonMap` component (`react-leaflet`) below the existing contact grid. When coords are absent, a styled placeholder renders instead.

No runtime geocoding (rejects Nominatim: rate limits, privacy risk). Tile layer: CartoDB Positron (light/neutral, no API key). No new data-fetching hook — reuses existing `useBusinessInfo()`.

---

## Phases

| # | Phase | Status | Doc |
|---|---|---|---|
| 01 | Leaflet Map Integration | ✅ Complete | [phase-01-leaflet-map-integration.md](./phase-01-leaflet-map-integration.md) |

---

## Phase 01 sub-documents

| Doc | Content |
|---|---|
| [reports/01-codebase-analysis.md](./reports/01-codebase-analysis.md) | Full codebase analysis, geocoding decision, file impact list |
| [phase-01a-backend-shared-changes.md](./phase-01a-backend-shared-changes.md) | Steps 1–6: install deps, shared types, API schema, API DTO, admin Zod, admin form |
| [phase-01b-client-changes.md](./phase-01b-client-changes.md) | Steps 7–10: icon-fix utility, SalonMap component, ContactPage integration, todo list |
| [phase-01c-risk-security-criteria.md](./phase-01c-risk-security-criteria.md) | Risk table, security notes, success criteria, next steps |

---

## Files Changed

| Layer | File |
|---|---|
| Shared types | `packages/types/src/business-info.ts` |
| API schema | `apps/api/src/modules/business-info/schemas/business-info.schema.ts` |
| API DTO | `apps/api/src/modules/business-info/dto/update-business-info.dto.ts` |
| Admin validation | `apps/admin/src/lib/validations/businessInfo.validation.ts` |
| Admin form | `apps/admin/src/components/contacts/BusinessInfoForm.tsx` |
| Client page | `apps/client/src/pages/ContactPage.tsx` |
| Client (new) | `apps/client/src/components/contact/salon-map.tsx` |
| Client (new) | `apps/client/src/utils/leaflet-icon-fix.ts` |
| Client deps | `apps/client/package.json` |

---

## Unresolved Questions

- CartoDB Positron vs plain OSM tiles — confirm with designer before implementation.
- Map section heading ("Tìm Chúng Tôi" / "Find Us") — copy TBD.
