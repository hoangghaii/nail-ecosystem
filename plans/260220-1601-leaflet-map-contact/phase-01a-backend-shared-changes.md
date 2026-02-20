# Phase 01a — Backend & Shared Layer Changes

**Parent**: [Phase 01 Index](./phase-01-leaflet-map-integration.md)
**Continues in**: [Phase 01b — Client Changes](./phase-01b-client-changes.md)

---

## Step 1 — Install Dependencies (client only)

```bash
# from repo root
pnpm add --filter client react-leaflet leaflet
pnpm add --filter client -D @types/leaflet
```

Verify `apps/client/package.json` contains:
- `"leaflet": "^1.x"` (latest stable)
- `"react-leaflet": "^4.x"` (v4 supports React 18/19)
- `"@types/leaflet"` in devDependencies

---

## Step 2 — Update Shared Types

File: `packages/types/src/business-info.ts`

```typescript
export type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;
  latitude?: number;    // WGS84 decimal degrees
  longitude?: number;   // WGS84 decimal degrees
  businessHours: DaySchedule[];
  createdAt: string;
  updatedAt: string;
};
```

Optional fields — no breaking change. Run `pnpm run type-check` to confirm all apps pass.

---

## Step 3 — Update API Mongoose Schema

File: `apps/api/src/modules/business-info/schemas/business-info.schema.ts`

Add inside the `BusinessInfo` class, after `address`:

```typescript
@Prop({ required: false, type: Number })
latitude?: number;

@Prop({ required: false, type: Number })
longitude?: number;
```

---

## Step 4 — Update API DTO

File: `apps/api/src/modules/business-info/dto/update-business-info.dto.ts`

Add after the `address` field in `UpdateBusinessInfoDto`. Import `Min`, `Max` from `class-validator`.

```typescript
@ApiPropertyOptional({ description: 'Latitude (WGS84)', example: 37.7749 })
@IsNumber()
@Min(-90)
@Max(90)
@IsOptional()
latitude?: number;

@ApiPropertyOptional({ description: 'Longitude (WGS84)', example: -122.4194 })
@IsNumber()
@Min(-180)
@Max(180)
@IsOptional()
longitude?: number;
```

---

## Step 5 — Update Admin Zod Validation

File: `apps/admin/src/lib/validations/businessInfo.validation.ts`

Add to `businessInfoSchema`:

```typescript
latitude: z.number().min(-90).max(90).optional(),
longitude: z.number().min(-180).max(180).optional(),
```

---

## Step 6 — Update Admin BusinessInfoForm

File: `apps/admin/src/components/contacts/BusinessInfoForm.tsx`

Add lat/lng inputs below the `address` field in the Contact Information section:

```tsx
<div className="grid gap-4 md:grid-cols-2">
  <div className="space-y-2">
    <Label htmlFor="latitude">Latitude (optional)</Label>
    <Input
      id="latitude"
      type="number"
      step="any"
      placeholder="e.g. 37.7749"
      disabled={!isEditing}
      {...register("latitude", { valueAsNumber: true })}
    />
    {errors.latitude && (
      <p className="text-destructive text-sm">{errors.latitude.message}</p>
    )}
  </div>
  <div className="space-y-2">
    <Label htmlFor="longitude">Longitude (optional)</Label>
    <Input
      id="longitude"
      type="number"
      step="any"
      placeholder="e.g. -122.4194"
      disabled={!isEditing}
      {...register("longitude", { valueAsNumber: true })}
    />
    {errors.longitude && (
      <p className="text-destructive text-sm">{errors.longitude.message}</p>
    )}
  </div>
</div>
```

Also update both `reset()` calls (initial load + cancel) to include:

```typescript
latitude: businessInfo.latitude,
longitude: businessInfo.longitude,
```
