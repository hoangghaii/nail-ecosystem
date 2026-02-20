# Phase 02 — API: Update Gallery Module

**Date:** 2026-02-19
**Status:** pending — depends on Phase 01

---

## Objective

Remove `categoryId`/`category` from gallery schema. Remove hardcoded `nailShape`/`style` enums. Add `nailShape`/`nailStyle` as free strings. Add server-side filtering by `nailShape` and `nailStyle` in query DTO and service.

---

## Files to Modify

| File | Action | Change |
|---|---|---|
| `apps/api/src/modules/gallery/schemas/gallery.schema.ts` | modify | Remove `categoryId`, `category`; remove enums from `nailShape`/`style` |
| `apps/api/src/modules/gallery/dto/create-gallery.dto.ts` | modify | Remove `GalleryCategory`/`NailShape`/`NailStyle` enums; use `@IsString()` for `nailShape`/`style` |
| `apps/api/src/modules/gallery/dto/query-gallery.dto.ts` | modify | Remove `categoryId`/`category`; add `nailShape`/`nailStyle` string filters |
| `apps/api/src/modules/gallery/dto/upload-gallery.dto.ts` | modify | Remove `categoryId`/`category` references |
| `apps/api/src/modules/gallery/gallery.service.ts` | modify | Remove category logic; add `nailShape`/`nailStyle` filter |
| `apps/api/src/modules/gallery/gallery.module.ts` | modify | Remove `GalleryCategoryModule` import |
| `apps/api/src/modules/gallery/gallery.controller.ts` | modify | Remove `categoryId`/`category` from Swagger `@ApiBody` |
| `apps/api/src/seeds/seeders/gallery.seeder.ts` | modify | Remove category refs; keep `nailShape`/`style` as string values |

---

## Schema Changes

`apps/api/src/modules/gallery/schemas/gallery.schema.ts`

Remove:
```typescript
// DELETE these fields:
@Prop({ type: Types.ObjectId, ref: 'GalleryCategory', default: null })
categoryId: Types.ObjectId | null;

@Prop({ required: false })
category?: string; // DEPRECATED
```

Change (remove enum constraint):
```typescript
// BEFORE:
@Prop({ type: String, enum: ['almond', 'coffin', 'square', 'stiletto'], required: false })
nailShape?: string;

@Prop({ type: String, enum: ['3d', 'mirror', 'gem', 'ombre'], required: false })
style?: string;

// AFTER:
@Prop({ required: false })
nailShape?: string;

@Prop({ required: false })
nailStyle?: string;  // renamed from 'style' for clarity
```

Remove indexes: `categoryId: 1`, `category: 1`.

> Note: field rename `style` → `nailStyle` requires a MongoDB migration script or use `$rename` on existing docs. See Risk section.

---

## DTO Changes

`create-gallery.dto.ts`:
- Delete `GalleryCategory`, `NailShape`, `NailStyle` enum declarations
- Replace `@IsEnum(NailShape)` with `@IsString() @IsOptional()` for `nailShape`
- Replace `@IsEnum(NailStyle)` with `@IsString() @IsOptional()` for `nailStyle` (renamed from `style`)
- Remove `categoryId` and `category` fields entirely

`query-gallery.dto.ts`:
- Remove `categoryId`, `category` params
- Add:
```typescript
@IsOptional() @IsString()
nailShape?: string;

@IsOptional() @IsString()
nailStyle?: string;
```

---

## Service Changes

`gallery.service.ts`:
- Remove `GalleryCategoryService` constructor injection
- Remove `categoryId`/`category` filter logic in `findAll()`
- Add to `findAll()`:
```typescript
if (query.nailShape) filter.nailShape = query.nailShape;
if (query.nailStyle) filter.nailStyle = query.nailStyle;
```
- Remove `.populate('categoryId', ...)` from all queries
- Remove auto-assign 'all' category logic from `create()`

---

## Module Changes

`gallery.module.ts` — remove `GalleryCategoryModule` from imports (decouple).

---

## Seeder Changes

`gallery.seeder.ts`:
- Remove `categoryId` from item data construction
- Keep `nailShape`/`nailStyle` as plain strings (values from Phase 01 seed data)
- Simplify item structure without category dependency

---

## Risk Assessment

**Field rename `style` → `nailStyle`**: existing MongoDB documents use `style`. Two options:
1. **Simple (recommended)**: keep field name as `style` in schema but update DTO/query param names to `nailStyle` at API layer only — no DB migration needed
2. **Clean**: rename DB field via migration script — more work, fully clean

Plan recommends **Option 1** (keep `style` in schema, expose as `nailStyle` in DTOs/API params) to avoid migration complexity. Add a comment in schema noting the discrepancy.

**GalleryCategory module**: still exists for the categories management tab in admin. Do NOT delete it. Only decouple it from gallery items.

**`gallery.service.ts`** will grow if we add nailStyle — keep under 200 lines. Current file is 185 lines; removal of category code will shrink it.

---

## Todo List

- [ ] Update `gallery.schema.ts` — remove `categoryId`/`category`, remove enums on `nailShape`/`style`
- [ ] Update `create-gallery.dto.ts` — remove enums, remove category fields
- [ ] Update `update-gallery.dto.ts` — inherits from create, verify no issues
- [ ] Update `query-gallery.dto.ts` — remove category params, add `nailShape`/`nailStyle`
- [ ] Update `upload-gallery.dto.ts` — remove category fields
- [ ] Update `gallery.service.ts` — remove category logic, add nailShape/nailStyle filter
- [ ] Update `gallery.module.ts` — remove GalleryCategoryModule import
- [ ] Update `gallery.controller.ts` — remove category from Swagger docs
- [ ] Update `gallery.seeder.ts` — remove categoryId from seed items

---

## Success Criteria

- `GET /gallery?nailShape=almond` filters correctly
- `GET /gallery?nailStyle=3d` filters correctly
- `POST /gallery` no longer accepts/requires `categoryId`
- No TypeScript errors in gallery module
- Seeder runs without errors
