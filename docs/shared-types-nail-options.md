# Shared Types — Nail Options

**Package**: `@repo/types/nail-options`

These types represent the admin-managed lookup lists for nail shapes and nail styles used as gallery filter dimensions.

---

```typescript
interface NailShapeItem {
  _id: string
  value: string      // URL-safe slug, must match /^[a-z0-9-]+$/ (e.g. "almond")
  label: string      // English display label (e.g. "Almond")
  labelVi: string    // Vietnamese display label (e.g. "Hình Hạnh Nhân")
  isActive: boolean
  sortIndex: number  // Display order (ascending)
}

// NailStyleItem — identical shape to NailShapeItem
type NailStyleItem = NailShapeItem
```

**Usage**:
```typescript
import type { NailShapeItem, NailStyleItem } from '@repo/types/nail-options';
```

**Notes**:
- `value` is the slug passed as `nailShape` / `nailStyle` query params to `GET /gallery`
- Both types share the same interface shape; kept as separate named types for semantic clarity
- Lists are fetched from `GET /nail-shapes?isActive=true` and `GET /nail-styles?isActive=true`
- Admin can add/remove options; changes are immediately reflected in gallery filters

**MongoDB collections**: `nail_shapes`, `nail_styles`

**Apps**:
- **Client**: GalleryPage filter UI (read-only, active items only)
- **Admin**: NailOptionsPage (full CRUD — future), GalleryFormModal dropdowns
- **API**: `apps/api/src/modules/nail-shapes/`, `apps/api/src/modules/nail-styles/`
