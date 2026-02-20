# Dynamic Gallery Filters — Implementation Plan

**Date:** 2026-02-19
**Status:** ✅ COMPLETE (2026-02-19)
**Priority:** High

---

## Objective

Replace hardcoded `NAIL_SHAPES`/`NAIL_STYLES` enums and gallery `category` system with fully dynamic, DB-driven nail shape and nail style collections. Remove the gallery category system entirely.

---

## Scope Summary

| Area | Change |
|---|---|
| MongoDB | New `NailShape` + `NailStyle` collections; gallery schema drops `categoryId`/`category` |
| API | New `nail-options` module (shapes + styles CRUD); gallery filtering updated |
| Shared Types | New `NailShapeItem`/`NailStyleItem` interfaces; `GalleryItem` updated |
| Admin | New management pages + updated gallery form |
| Client | Dynamic filter pills; remove hardcoded arrays; server-side filtering |

---

## Phases

| Phase | File | Status |
|---|---|---|
| 1 — API: nail-options module | [phase-01-api-nail-options.md](./phase-01-api-nail-options.md) | ✅ Complete |
| 2 — API: update gallery module | [phase-02-api-gallery-update.md](./phase-02-api-gallery-update.md) | ✅ Complete |
| 3 — Shared types | [phase-03-shared-types.md](./phase-03-shared-types.md) | ✅ Complete |
| 4 — Admin: nail options pages | [phase-04-admin-nail-options.md](./phase-04-admin-nail-options.md) | ✅ Complete |
| 5 — Admin: gallery form update | [phase-05-admin-gallery-form.md](./phase-05-admin-gallery-form.md) | ✅ Complete |
| 6 — Client: dynamic filters | [phase-06-client-dynamic-filters.md](./phase-06-client-dynamic-filters.md) | ✅ Complete |
| 6a — Client: services/hooks | [phase-06a-client-services-hooks.md](./phase-06a-client-services-hooks.md) | ✅ Complete |
| 6b — Client: UI components | [phase-06b-client-ui-updates.md](./phase-06b-client-ui-updates.md) | ✅ Complete |

---

## Key Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

Phases 1+2 must complete before updating shared types (Phase 3).
Phases 4+5 depend on shared types (Phase 3).
Phase 6 depends on shared types (Phase 3).

---

## Risk Register

- **Breaking change**: removing `categoryId`/`category` from gallery breaks admin `GalleryItemsTab` category filter — must update in Phase 5
- **Seeder**: existing seed data uses hardcoded `nailShapes`/`nailStyles` arrays — update in Phase 2
- **queryKeys**: `gallery.list` filter type must be updated to include `nailShape`/`nailStyle` in `packages/utils/src/api/queryKeys.ts`
- **GalleryCategoryModule**: still needed for gallery-category pages; do NOT remove — only decouple from gallery items

---

## Unresolved Questions

1. Should `GalleryCategory` (categories tab) be kept as-is for future use, or also removed? Plan assumes it stays (decouple only).
2. Should `labelVi` (Vietnamese label) be stored in DB or computed client-side? Plan stores in DB for consistency.
3. Delete protection on nail shapes/styles: prevent deletion if any gallery item references the value?
