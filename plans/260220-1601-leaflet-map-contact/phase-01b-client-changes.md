# Phase 01b — Client-Side Changes

**Parent**: [Phase 01 Index](./phase-01-leaflet-map-integration.md)
**Preceded by**: [Phase 01a — Backend & Shared Changes](./phase-01a-backend-shared-changes.md)

---

## Step 7 — Create Leaflet Icon Fix Utility

File: `apps/client/src/utils/leaflet-icon-fix.ts`

Vite breaks Leaflet's default marker icon (webpack-specific URL resolution). Side-effect import — must run before any `Marker` renders:

```typescript
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's broken default icon path under Vite
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
```

---

## Step 8 — Create SalonMap Component

File: `apps/client/src/components/contact/salon-map.tsx`

Design decisions:
- Import `leaflet/dist/leaflet.css` at component top — limits CSS scope to lazy chunk
- Height: `h-80` mobile / `sm:h-96` desktop — explicit height required by Leaflet
- Container: `rounded-[24px] border border-border overflow-hidden` — card style, no shadow
- Tile: CartoDB Positron — light, neutral, fits warm client theme
- `scrollWheelZoom={false}` — prevents map capturing page scroll
- Fallback: same card shell, `MapPin` icon + address + directions link (no JS error when coords absent)

```tsx
import 'leaflet/dist/leaflet.css';
import '@/utils/leaflet-icon-fix';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';

interface SalonMapProps {
  address: string;
  latitude?: number;
  longitude?: number;
  salonName?: string;
}

function MapPlaceholder({ address }: { address: string }) {
  return (
    <div className="rounded-[24px] border border-border bg-card p-8 flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <MapPin className="h-5 w-5 text-primary" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-sans text-sm font-medium text-muted-foreground mb-1">Địa Chỉ</p>
        <address className="font-sans text-base text-foreground not-italic">{address}</address>
      </div>
    </div>
  );
}

export function SalonMap({
  address,
  latitude,
  longitude,
  salonName = 'Pink Nail Salon',
}: SalonMapProps) {
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number';

  if (!hasCoords) return <MapPlaceholder address={address} />;

  return (
    <div className="rounded-[24px] border border-border overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        className="h-80 sm:h-96 w-full"
        aria-label="Salon location map"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{salonName}</strong><br />
            {address}<br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
```

---

## Step 9 — Integrate SalonMap into ContactPage

File: `apps/client/src/pages/ContactPage.tsx`

Add lazy import at file top:

```tsx
import { lazy, Suspense } from 'react';

const SalonMap = lazy(() =>
  import('@/components/contact/salon-map').then((m) => ({ default: m.SalonMap }))
);
```

Add below the existing 2-col grid (after closing `</div>` of grid, inside the max-width container):

```tsx
<div className="mt-12">
  <Suspense
    fallback={
      <div className="rounded-[24px] border border-border bg-card h-80 sm:h-96 animate-pulse" />
    }
  >
    <SalonMap
      address={businessInfoData.address}
      latitude={businessInfoData.latitude}
      longitude={businessInfoData.longitude}
    />
  </Suspense>
</div>
```

Note: use `businessInfoData` (raw API response), not `displayData`, so lat/lng fields are present.

---

## Step 10 — Verify

```bash
pnpm run type-check   # All 3 apps must pass
pnpm run lint         # No new errors
pnpm run build        # Full build must succeed
```

---

## Todo List

- [ ] `pnpm add --filter client react-leaflet leaflet` + `-D @types/leaflet`
- [ ] Add `latitude?`, `longitude?` to `packages/types/src/business-info.ts`
- [ ] Add Mongoose props to `apps/api/.../business-info.schema.ts`
- [ ] Add DTO fields + `@Min`/`@Max` to `apps/api/.../update-business-info.dto.ts`
- [ ] Add Zod fields to `apps/admin/.../businessInfo.validation.ts`
- [ ] Add lat/lng inputs + update both `reset()` calls in `apps/admin/.../BusinessInfoForm.tsx`
- [ ] Create `apps/client/src/utils/leaflet-icon-fix.ts`
- [ ] Create `apps/client/src/components/contact/salon-map.tsx`
- [ ] Update `apps/client/src/pages/ContactPage.tsx` with lazy SalonMap
- [ ] `pnpm run type-check && pnpm run build` — must pass
- [ ] Manual: set lat/lng in admin → map renders on contact page
- [ ] Manual: clear lat/lng in admin → placeholder renders, no JS error
- [ ] Manual: page scroll does not zoom map
