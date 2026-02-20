# Phase 06 — Client: Dynamic Gallery Filters

**Date:** 2026-02-19
**Status:** pending — depends on Phase 03
**Sub-phases:** [06a — service/hook layer](./phase-06a-client-services-hooks.md) | [06b — UI components](./phase-06b-client-ui-updates.md)

---

## Objective

Replace hardcoded `NAIL_SHAPES`/`NAIL_STYLES` with API-fetched data. Move filtering server-side. Delete `filter-config.ts`.

---

## Files to Delete

| File | Reason |
|---|---|
| `apps/client/src/data/filter-config.ts` | Replaced by API fetch |

---

## Files to Create

| File | Purpose |
|---|---|
| `apps/client/src/hooks/api/useNailOptions.ts` | Fetch shapes + styles from API |

---

## Files to Modify

| File | Change |
|---|---|
| `packages/utils/src/api/queryKeys.ts` | Add `nailShape`/`nailStyle` to gallery.list filter type |
| `apps/client/src/services/gallery.service.ts` | Add `nailShape`/`nailStyle` to `GalleryQueryParams` |
| `apps/client/src/hooks/useGalleryPage.ts` | Add shape/style state, pass to API query |
| `apps/client/src/pages/GalleryPage.tsx` | Dynamic filter pills, remove client-side filter logic |

---

## Key Decision

Client `GalleryPage` has category filter buttons + shape/style pills. Since `categoryId` is removed from gallery items, category buttons become useless. **Recommendation: remove category filter buttons from client gallery page.**

---

## Todo List

- [ ] Update `queryKeys.gallery.list` filter type (see [06a](./phase-06a-client-services-hooks.md))
- [ ] Create `useNailOptions.ts` hooks (see [06a](./phase-06a-client-services-hooks.md))
- [ ] Update `gallery.service.ts` query params (see [06a](./phase-06a-client-services-hooks.md))
- [ ] Update `useGalleryPage.ts` (see [06a](./phase-06a-client-services-hooks.md))
- [ ] Update `GalleryPage.tsx` UI (see [06b](./phase-06b-client-ui-updates.md))
- [ ] Delete `filter-config.ts` (see [06b](./phase-06b-client-ui-updates.md))
- [ ] Run `npm run type-check`
- [ ] Manual test: shape pill → API call with `?nailShape=almond`

---

## Success Criteria

- Filter pills load from API
- Selecting shape/style triggers server-side filtered API call
- Infinite scroll works with active filters
- No `filter-config.ts` remains
- No client-side filtering logic for shape/style
