# Gallery Constants & Filtering - Quick Reference

## NAIL_SHAPES & NAIL_STYLES

**File**: `apps/client/src/data/filter-config.ts`

```typescript
export const NAIL_SHAPES = [
  { label: "Tất Cả", slug: "all" },
  { label: "Almond", slug: "almond" },
  { label: "Coffin", slug: "coffin" },
  { label: "Square", slug: "square" },
  { label: "Stiletto", slug: "stiletto" },
];

export const NAIL_STYLES = [
  { label: "Tất Cả", slug: "all" },
  { label: "Vẽ 3D", slug: "3d" },
  { label: "Tráng Gương", slug: "mirror" },
  { label: "Đính Đá", slug: "gem" },
  { label: "Ombre", slug: "ombre" },
];
```

---

## Gallery Type Definitions

### GalleryItem (packages/types/src/gallery.ts)
```typescript
export type GalleryItem = {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;  // category slug
  nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto';
  style?: '3d' | 'mirror' | 'gem' | 'ombre';
  description?: string;
  price?: string;
  duration?: string;
  featured?: boolean;
  createdAt?: Date;
};
```

### GalleryCategoryItem (packages/types/src/gallery-category.ts)
```typescript
export type GalleryCategoryItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortIndex: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
```

---

## MongoDB Schema

**File**: `apps/api/src/modules/gallery/schemas/gallery.schema.ts`

```typescript
@Schema({ timestamps: true })
export class Gallery extends Document {
  imageUrl: string;         // required
  title: string;            // required
  categoryId: ObjectId;     // NEW: Reference to GalleryCategory
  category?: string;        // DEPRECATED: Legacy category string
  nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto';
  style?: '3d' | 'mirror' | 'gem' | 'ombre';
  price?: string;
  duration?: string;
  featured?: boolean;
  isActive: boolean;
  sortIndex: number;
}

// Indexes
GallerySchema.index({ categoryId: 1, sortIndex: 1 });
GallerySchema.index({ nailShape: 1 });  // For filtering
GallerySchema.index({ style: 1 });      // For filtering
```

---

## Client Gallery Filtering

**File**: `apps/client/src/pages/GalleryPage.tsx`

**Two-tier filtering**:

1. **Backend (by categoryId)**
   ```typescript
   const categoryId = useMemo(() => {
     if (selectedCategory === "all") return undefined;
     const category = categories.find((c) => c.slug === selectedCategory);
     return category?._id;
   }, [selectedCategory, categories]);
   
   // Passed to API
   useInfiniteGalleryItems({ categoryId, isActive: true })
   ```

2. **Client-side (by nailShape & style)**
   ```typescript
   const filteredGallery = useMemo(() => {
     return galleryItems.filter((item: GalleryItem) => {
       const shapeMatch = selectedShape === "all" || item.nailShape === selectedShape;
       const styleMatch = selectedStyle === "all" || item.style === selectedStyle;
       return shapeMatch && styleMatch;
     });
   }, [galleryItems, selectedShape, selectedStyle]);
   ```

---

## API Endpoints

### Query Gallery Items
```http
GET /api/gallery?categoryId=507f1f77bcf86cd799439011&isActive=true&page=1&limit=10
```

**Query Parameters**:
- `categoryId` (string, ObjectId) - Filter by category reference (NEW)
- `category` (enum) - DEPRECATED: Filter by category string
- `featured` (boolean) - Filter featured items
- `isActive` (boolean) - Filter active items
- `search` (string) - Text search on title, description, price
- `page` (number) - Page number (default 1)
- `limit` (number) - Items per page (default 10, max 100)

**Note**: `nailShape` and `style` are NOT queryable - only returned in response.

---

## Admin Gallery Form

**File**: `apps/admin/src/components/gallery/GalleryFormModal.tsx`

### Current Fields:
✅ Title (required)
✅ Category (required, dropdown, disabled in edit mode)
✅ Image (required on create, read-only on edit)
✅ Description (optional)
✅ Price (optional)
✅ Duration (optional)
✅ Featured (toggle)

### Missing Fields:
❌ nailShape (not in form)
❌ style (not in form)

**Issue**: Admin cannot set shape/style values. These must be set via direct DB or API calls.

---

## Gallery Categories (Seeded)

**File**: `apps/api/src/seeds/data/gallery-categories.data.ts`

1. Manicure (slug: `manicure`)
2. Pedicure (slug: `pedicure`)
3. Nail Art (slug: `nail-art`)
4. Extensions (slug: `extensions`)
5. Special Occasions (slug: `special-occasions`)
6. Seasonal Collections (slug: `seasonal`)

**Note**: "all" is not a real category - it's a filter value in the UI.

---

## Filter Flow

```
GalleryPage User Action
    ↓
[Category Selected] → useGalleryPage: convert slug to categoryId
    ↓
[API Query] → GET /api/gallery?categoryId=...&isActive=true
    ↓
[Backend Filter] → MongoDB: filter by categoryId
    ↓
[Response] → Items with nailShape & style populated
    ↓
[Client Filter] → useMemo: filter by selectedShape & selectedStyle
    ↓
[Render] → <GalleryCard> for each filtered item
```

---

## API DTOs

### CreateGalleryDto (apps/api/src/modules/gallery/dto/create-gallery.dto.ts)
```typescript
export enum GalleryCategory {
  ALL = 'all',
  EXTENSIONS = 'extensions',
  MANICURE = 'manicure',
  NAIL_ART = 'nail-art',
  PEDICURE = 'pedicure',
  SEASONAL = 'seasonal',
}

export enum NailShape {
  ALMOND = 'almond',
  COFFIN = 'coffin',
  SQUARE = 'square',
  STILETTO = 'stiletto',
}

export enum NailStyle {
  THREE_D = '3d',
  MIRROR = 'mirror',
  GEM = 'gem',
  OMBRE = 'ombre',
}
```

---

## Key Implementation Details

### Filter Constants
- **Location**: `apps/client/src/data/filter-config.ts`
- **Type**: Static hardcoded arrays
- **Change Impact**: Requires code change + redeploy
- **Uses**: UI labels only (actual filtering is by slug)

### Database Indexing
- **categoryId + sortIndex**: For fast category-based queries
- **nailShape**: For potential future server-side filtering
- **style**: For potential future server-side filtering

### Backward Compatibility
- Old `category` string field still supported in schema
- API accepts both `category` (deprecated) and `categoryId` (new)
- Migration path: Continue supporting both until full migration

### Client-Side Filtering
- **NOT server-side**: nailShape and style are client-side only
- **Rationale**: All shapes/styles returned, client chooses what to display
- **Performance**: Uses useMemo to avoid unnecessary recalculations

---

## Related Files

| Purpose | File | Key Lines |
|---------|------|-----------|
| Filter Constants | `apps/client/src/data/filter-config.ts` | 1-15 |
| Gallery Page | `apps/client/src/pages/GalleryPage.tsx` | 40-53 (filtering logic) |
| Filter UI Component | `apps/client/src/components/gallery/FilterPills.tsx` | 10-32 |
| Gallery Hook | `apps/client/src/hooks/useGalleryPage.ts` | 18-22 (category conversion) |
| Admin Form | `apps/admin/src/components/gallery/GalleryFormModal.tsx` | 35-51 (schema), 247-277 (category select) |
| API Service | `apps/api/src/modules/gallery/gallery.service.ts` | 50-110 (findAll filtering) |
| API Schema | `apps/api/src/modules/gallery/schemas/gallery.schema.ts` | 38-50 (nailShape/style enums) |

---

**Full Report**: See `scout-report.md` for comprehensive documentation
