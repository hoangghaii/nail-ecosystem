# Shared Type System

**CRITICAL**: All apps share type definitions via `@repo/types`. Types MUST remain compatible across client, admin, and API.

**Rule**: Never modify shared types without verifying all three apps compile cleanly.

---

## Type Modules

| Module | Package | Detail doc |
|---|---|---|
| Service | `@repo/types/service` | [shared-types-service.md](./shared-types-service.md) |
| Gallery + NailShape/Style enums | `@repo/types/gallery` | [shared-types-gallery.md](./shared-types-gallery.md) |
| Nail Options (dynamic lookup) | `@repo/types/nail-options` | [shared-types-nail-options.md](./shared-types-nail-options.md) |
| Booking | `@repo/types/booking` | [shared-types-booking.md](./shared-types-booking.md) |
| Business Info | `@repo/types/business-info` | [shared-types-business-info.md](./shared-types-business-info.md) |

---

## Type Location Reference

### packages/types (source of truth)
```
packages/types/
├── service.ts
├── gallery.ts
├── nail-options.ts   ← new
├── booking.ts
└── business-info.ts
```

### Client / Admin (consumers)
```
src/types/
├── service.types.ts
├── gallery.types.ts
├── nail-options.types.ts  ← new
└── booking.types.ts
```

### API (consumers)
```
apps/api/src/modules/
├── services/dto/
├── gallery/dto/
├── nail-shapes/dto/   ← new
├── nail-styles/dto/   ← new
└── bookings/dto/
```

---

## Sync Checklist

When modifying shared types:

- [ ] Update `packages/types/` definition
- [ ] Update client `src/types/` mirror
- [ ] Update admin `src/types/` mirror
- [ ] Update API DTOs if applicable
- [ ] Run `npm run type-check` (all apps in parallel)
- [ ] Document breaking changes here

---

**Last Updated**: 2026-02-19
**Latest**: Added `NailShapeItem`/`NailStyleItem` types; removed `GalleryItem.category` field (2026-02-19)
