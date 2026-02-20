# Codebase Analysis — Leaflet Map Contact Page

**Date**: 2026-02-20
**Scope**: `apps/client` contact page + supporting layers

---

## 1. BusinessInfo Type — No lat/lng

`packages/types/src/business-info.ts`:

```typescript
export type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;          // single string, e.g. "123 Beauty Lane, SF, CA 94102"
  businessHours: DaySchedule[];
  createdAt: string;
  updatedAt: string;
};
```

**Finding**: NO `latitude`/`longitude` fields. Address is a single unstructured string.

---

## 2. API Layer — No Geocoords

`apps/api/src/modules/business-info/schemas/business-info.schema.ts`: schema mirrors the type — `phone`, `email`, `address`, `businessHours` only.

`apps/api/src/modules/business-info/dto/update-business-info.dto.ts`: DTO has same fields — no lat/lng.

`GET /business-info` (public, no auth) → returns `BusinessInfoResponse`.

---

## 3. Admin UI — Address-Only Input

`apps/admin/src/components/contacts/BusinessInfoForm.tsx`: renders a plain `<Input type="text">` for `address`. No lat/lng fields.

`apps/admin/src/lib/validations/businessInfo.validation.ts`: Zod schema validates `address: z.string().min(1)` only.

---

## 4. Client ContactPage — Current State

`apps/client/src/pages/ContactPage.tsx`:
- Fetches via `useBusinessInfo()` → `businessInfoService.get()` → `GET /business-info`
- Transforms with `transformBusinessInfo()` (in `src/utils/businessInfo.ts`)
- Renders `<ContactInfoDisplay>` (left col) + `<ContactForm>` (right col)
- Layout: `grid grid-cols-1 lg:grid-cols-2 gap-12`

`apps/client/src/components/contact/contact-info-display.tsx`:
- Displays phone, email, address (with `parseAddress()` heuristic), business hours
- No map — only `<MapPin>` icon from lucide-react
- Card style: `rounded-[24px] border border-border bg-card p-8` (border-based, no shadow)

`apps/client/src/utils/businessInfo.ts`:
- `parseAddress(addressString)` — splits on comma, tries to extract street/city/state/zip

---

## 5. Existing Hooks/Services (Client)

- `src/hooks/api/useBusinessInfo.ts` — TanStack Query, staleTime 1h, gcTime 24h, 3 retries
- `src/services/business-info.service.ts` — `BusinessInfoService.get()` → `apiClient.get('/business-info')`

Both are already in place. No new hook/service needed for the map; re-use existing data.

---

## 6. Client Dependencies — No Leaflet

`apps/client/package.json` current dependencies (relevant):
- `react`, `react-dom` 19.2
- `motion` (Framer Motion v12) — for animations
- `@tanstack/react-query` 5.x
- No `leaflet`, no `react-leaflet`

**Must install**: `react-leaflet` + `leaflet` + `@types/leaflet`

---

## 7. Design System Constraints

From `docs/design-guidelines.md` and `docs/code-standards.md`:
- **NO shadows** on cards (border-based design)
- Borders: `border border-border`
- Border radius cards: `rounded-[24px]`
- Primary color: dusty rose `oklch(0.7236 0.0755 28.44)` (#D1948B)
- Map tile layer must be customized or use neutral tile (avoid heavy blue default)
- Leaflet default CSS overrides needed to match theme

---

## 8. Decision: Geocoding Strategy

**Options evaluated**:

| Option | Pros | Cons |
|---|---|---|
| A. Add lat/lng to schema | Accurate, explicit | Schema change across all layers (types, API schema, DTO, admin form, validation) |
| B. Nominatim geocoding at runtime | No schema change, zero cost | Rate limit (1 req/s), privacy, slow on cold load |
| C. Add lat/lng to admin form only (optional fields) | Admin sets exact coords; client reads them | Still requires schema update in all 3 layers |

**Recommendation: Option A** — Add `latitude?: number` and `longitude?: number` as optional fields to:
1. `packages/types/src/business-info.ts`
2. `apps/api/src/modules/business-info/schemas/business-info.schema.ts`
3. `apps/api/src/modules/business-info/dto/update-business-info.dto.ts`
4. `apps/admin/src/components/contacts/BusinessInfoForm.tsx`
5. `apps/admin/src/lib/validations/businessInfo.validation.ts`

Client fallback when coords absent: show static map placeholder or text-only address block. Avoid Nominatim to prevent rate-limit dependency in production.

---

## 9. Files Touched (Estimate)

| Layer | File | Change |
|---|---|---|
| Shared types | `packages/types/src/business-info.ts` | Add optional `latitude?`, `longitude?` |
| API schema | `apps/api/.../business-info.schema.ts` | Add optional Mongoose props |
| API DTO | `apps/api/.../update-business-info.dto.ts` | Add optional DTO fields |
| Admin form | `apps/admin/.../BusinessInfoForm.tsx` | Add lat/lng inputs |
| Admin validation | `apps/admin/.../businessInfo.validation.ts` | Add optional number fields to Zod schema |
| Client (new) | `apps/client/src/components/contact/salon-map.tsx` | New Leaflet map component |
| Client page | `apps/client/src/pages/ContactPage.tsx` | Add map below contact grid |

---

## 10. Risks

- **Leaflet SSR**: Leaflet accesses `window` directly — not an issue (Vite CSR only, no SSR)
- **Leaflet CSS conflict**: Must import `leaflet/dist/leaflet.css` — may override Tailwind resets
- **Missing coords**: Admin hasn't set lat/lng yet → need graceful fallback (hide map or show placeholder)
- **Bundle size**: `leaflet` ≈ 150KB gzip. Acceptable; component can be lazy-loaded
- **Marker icon**: Leaflet default marker uses absolute asset paths that break with Vite — must fix icon config
- **Tile attribution**: OSM tiles require attribution display — must keep visible

---

## 11. Unresolved Questions

- Should map appear above or below the contact info / form grid? (UX decision — recommend below, full width)
- Should admin be required to enter lat/lng before map shows, or should map auto-geocode once as fallback? (recommendation: required, no geocoding in prod)
- Is a tile theme (e.g. CartoDB Positron — light, minimal) preferred over default OSM blue tiles?
