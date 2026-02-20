# Shared Types — Gallery

**Package**: `@repo/types/gallery`

---

## GalleryItem

```typescript
interface GalleryItem {
  _id: string
  title: string
  imageUrl: string
  // Note: category field removed — no longer returned by API
  description?: string
  duration?: string  // e.g., "45 min", "1.5 hrs"
  price?: string     // e.g., "$45", "$60-80"
  featured: boolean
  nailShape?: string // slug — matches NailShapeItem.value
  style?: string     // slug — matches NailStyleItem.value (DB field name)
  createdAt?: Date
}

type GalleryCategory = "all" | "extensions" | "manicure" | "nail-art" | "pedicure" | "seasonal"

// Legacy static enums — still valid slugs, but the authoritative list
// is now dynamic via GET /nail-shapes and GET /nail-styles
type NailShape = "almond" | "coffin" | "square" | "stiletto"
type NailStyle = "3d" | "mirror" | "gem" | "ombre"
```

**Usage**:
```typescript
import type { GalleryItem, NailShape, NailStyle } from '@repo/types/gallery';
```

**Breaking change note**:
- `GalleryItem.category` field was removed from the API response
- Filter params `categoryId` and `category` removed from `GET /gallery`
- Use `nailShape` and `nailStyle` query params instead (see [api-gallery-endpoints.md](./api-gallery-endpoints.md))

**Apps**:
- **Client**: GalleryPage, FeaturedGallery, GalleryCard (read-only display + filtering)
- **Admin**: GalleryPage, GalleryFormModal (full CRUD)
- **API**: `apps/api/src/modules/gallery/dto/`
