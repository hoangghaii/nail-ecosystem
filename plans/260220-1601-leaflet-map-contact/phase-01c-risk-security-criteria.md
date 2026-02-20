# Phase 01c — Risk, Security & Success Criteria

**Parent**: [Phase 01 Index](./phase-01-leaflet-map-integration.md)

---

## Success Criteria

1. Map renders at coordinates set by admin in BusinessInfoForm
2. Marker popup shows salon name + address + "Get directions" link
3. Tile layer is CartoDB Positron (light/neutral), not default OSM blue
4. Container matches card design: `rounded-[24px] border border-border`, no shadow
5. When lat/lng absent: placeholder renders, no JS error
6. Page scroll not captured by map (`scrollWheelZoom={false}`)
7. `pnpm run type-check` passes across all 3 apps
8. `pnpm run build` succeeds, no bundle errors
9. Leaflet marker icon renders correctly (no broken image)
10. OSM + CARTO attribution visible on map

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Leaflet CSS overrides Tailwind resets | Medium | Medium | Import `leaflet.css` inside component file (lazy chunk scope); add `.leaflet-container` overrides if needed |
| Marker icon broken under Vite | High (known issue) | High | `leaflet-icon-fix.ts` utility resolves this (Step 7) |
| `window` access during non-browser import | Low (CSR only) | Low | `React.lazy` defers import; add `typeof window !== 'undefined'` guard if needed |
| Admin enters out-of-range coordinates | Low | Low | Zod: `z.number().min(-90).max(90)`; DTO: `@Min(-90) @Max(90)` |
| Leaflet adds ~150 KB to bundle | Medium | Low | `React.lazy` defers load; only fetched when ContactPage mounts |
| CartoDB tile CDN unavailable | Very Low | Low | Fallback tile URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |

---

## Security Considerations

- Tile requests go browser → CartoDB/OSM CDN directly — no API key, no server credentials exposed
- `target="_blank"` on directions link includes `rel="noopener noreferrer"` (prevents tab-napping)
- Coordinates validated in DTO (`@Min`/`@Max`) before storage — prevents obviously invalid data
- Map popup renders only admin-controlled API data — not user-supplied input; no XSS vector
- No new auth surface introduced — `GET /business-info` is already public

---

## Next Steps

- Update `docs/shared-types-business-info.md` to document `latitude?`/`longitude?` fields
- Update `docs/api-business-info-endpoints.md` PATCH body with new optional fields
- Optional future: custom pink SVG `DivIcon` marker matching brand primary color
- Optional future: admin lat/lng map picker (click-to-place marker in an admin-side map widget)
