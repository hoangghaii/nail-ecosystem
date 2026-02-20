# Gallery Constants & Filtering Implementation Scout Report
**Date**: 2026-02-19  
**Status**: Complete analysis

---

## Executive Summary

This report documents all occurrences of gallery constants (NAIL_SHAPES, NAIL_STYLES), category field usage, and current filter implementations across the Pink Nail Salon monorepo.

**Key Findings**:
- Hardcoded filter constants exist in client app with Vietnamese labels
- Gallery filtering uses multi-dimensional approach: backend categoryId + client-side shape/style filters
- Gallery categories are now managed via dedicated gallery-category module with MongoDB persistence
- Admin form currently allows category selection (with slug), but doesn't support nailShape/style editing
- API properly supports both legacy (category string) and new (categoryId) filtering

---

## 1. NAIL_SHAPES and NAIL_STYLES Constants

### Location
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/data/filter-config.ts`  
**Lines**: 1-15

### Full Content
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

### Usage in Client App

#### 1. GalleryPage.tsx
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Lines**: 15, 109, 121

```typescript
// Line 15: Import
import { NAIL_SHAPES, NAIL_STYLES } from "@/data/filter-config";

// Line 40-42: State management
const [selectedShape, setSelectedShape] = useState("all");
const [selectedStyle, setSelectedStyle] = useState("all");

// Line 44-53: Client-side multi-dimensional filtering
const filteredGallery = useMemo(() => {
  return galleryItems.filter((item: GalleryItem) => {
    const shapeMatch =
      selectedShape === "all" || item.nailShape === selectedShape;
    const styleMatch =
      selectedStyle === "all" || item.style === selectedStyle;
    return shapeMatch && styleMatch;
  });
}, [galleryItems, selectedShape, selectedStyle]);

// Line 108-112: Nail Shapes filter pills
<FilterPills
  filters={NAIL_SHAPES}
  selected={selectedShape}
  onSelect={setSelectedShape}
/>

// Line 120-124: Nail Styles filter pills
<FilterPills
  filters={NAIL_STYLES}
  selected={selectedStyle}
  onSelect={setSelectedStyle}
/>

// Line 128-140: Reset filters button (shows when filters active)
{(selectedShape !== "all" || selectedStyle !== "all") && (
  <div className="text-center">
    <button
      onClick={() => {
        setSelectedShape("all");
        setSelectedStyle("all");
      }}
      className="font-sans text-sm font-medium text-primary hover:underline"
    >
      Xóa Bộ Lọc
    </button>
  </div>
)}
```

---

## 2. Gallery Type Definitions (Shared)

### File: `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery.ts`

**Full Content**:
```typescript
export type GalleryItem = {
  category: string; // Changed from enum to string for dynamic categories (category slug)
  createdAt?: Date;
  description?: string;
  duration?: string; // e.g., "45 min", "1.5 hrs"
  featured?: boolean;
  _id: string;
  imageUrl: string;
  nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto'; // Nail shape for filtering
  price?: string; // e.g., "$45", "$60-80"
  style?: '3d' | 'mirror' | 'gem' | 'ombre'; // Nail style for filtering
  title: string;
};

export const GalleryCategory = {
  ALL: 'all',
  EXTENSIONS: 'extensions',
  MANICURE: 'manicure',
  NAIL_ART: 'nail-art',
  PEDICURE: 'pedicure',
  SEASONAL: 'seasonal',
} as const;

export type GalleryCategory =
  (typeof GalleryCategory)[keyof typeof GalleryCategory];

export type GalleryFilterProps = {
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
};
```

**Key Notes**:
- Line 2: `category` field is a string (category slug from database)
- Line 9: `nailShape` is optional, typed as literal union
- Line 11: `style` is optional, typed as literal union
- Lines 15-22: `GalleryCategory` constants match backend categories

---

## 3. Gallery Category Type Definitions (Shared)

### File: `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery-category.ts`

**Full Content**:
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

export type CreateGalleryCategoryDto = {
  name: string;
  slug?: string;
  description?: string;
  sortIndex?: number;
  isActive?: boolean;
};

export type UpdateGalleryCategoryDto = Partial<CreateGalleryCategoryDto>;
```

---

## 4. MongoDB Schema - Gallery

### File: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`

**Full Content**:
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({ timestamps: true })
export class Gallery extends Document {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'GalleryCategory', default: null })
  categoryId: Types.ObjectId | null;

  @Prop({ required: false })
  category?: string; // DEPRECATED: all, extensions, manicure, nail-art, pedicure, seasonal

  @Prop()
  price?: string; // e.g., "$45", "$60-80"

  @Prop()
  duration?: string; // e.g., "45 min", "1.5 hrs"

  @Prop({ default: false })
  featured?: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortIndex: number;

  @Prop({
    type: String,
    enum: ['almond', 'coffin', 'square', 'stiletto'],
    required: false,
  })
  nailShape?: string; // Nail shape for filtering

  @Prop({
    type: String,
    enum: ['3d', 'mirror', 'gem', 'ombre'],
    required: false,
  })
  style?: string; // Nail style for filtering
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

// Indexes
GallerySchema.index({ categoryId: 1, sortIndex: 1 });
GallerySchema.index({ category: 1, sortIndex: 1 }); // DEPRECATED: Keep for backward compat
GallerySchema.index({ isActive: 1 });
GallerySchema.index({ featured: 1 });
GallerySchema.index({ nailShape: 1 }); // For filtering
GallerySchema.index({ style: 1 }); // For filtering
```

**Key Notes**:
- Line 18: `categoryId` references GalleryCategory via ObjectId (NEW)
- Line 21: `category` string field (DEPRECATED) - legacy backward compatibility
- Lines 38-50: Enum constraints for nailShape and style
- Lines 56-61: Database indexes for filtering performance

---

## 5. API DTOs

### CreateGalleryDto
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`

**Lines 12-33: Enums**
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

**Lines 35-140: CreateGalleryDto**
- Line 68: `categoryId?: string` - NEW way to assign categories
- Lines 72-79: `category?: GalleryCategory` - DEPRECATED
- Lines 123-130: `nailShape?: NailShape` - Optional
- Lines 132-139: `style?: NailStyle` - Optional

### QueryGalleryDto
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/query-gallery.dto.ts`

**Lines 13-82**:
```typescript
export class QueryGalleryDto {
  @ApiPropertyOptional({
    description: 'Filter by gallery category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;  // NEW

  @ApiPropertyOptional({
    description: 'DEPRECATED: Use categoryId instead. Filter by gallery category enum',
    enum: GalleryCategory,
    example: GalleryCategory.NAIL_ART,
    deprecated: true,
  })
  @IsOptional()
  @IsEnum(GalleryCategory)
  category?: GalleryCategory;  // DEPRECATED

  // ... other fields (featured, isActive, search, page, limit)
}
```

---

## 6. API Service - Gallery Filtering Logic

### File: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/gallery.service.ts`

**Lines 50-110 (findAll method)**:
```typescript
async findAll(query: QueryGalleryDto) {
  const {
    categoryId,      // NEW: ObjectId reference
    category,        // DEPRECATED: category string
    featured,
    isActive,
    search,
    page = 1,
    limit = 10,
  } = query;

  const filter: any = {};

  // NEW: Filter by categoryId
  if (categoryId) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException('Invalid category ID');
    }
    filter.categoryId = new Types.ObjectId(categoryId);
  }

  // DEPRECATED: Filter by category string (backward compat)
  if (category) {
    filter.category = category;
  }

  if (featured !== undefined) filter.featured = featured;
  if (isActive !== undefined) filter.isActive = isActive;

  // Text search
  if (search && search.trim()) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i');

    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { price: searchRegex },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.galleryModel
      .find(filter)
      .populate('categoryId', 'name slug description')
      .sort({ sortIndex: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      // ... rest of query
  ]);
}
```

**Key Notes**:
- Backend supports both categoryId (new) and category (deprecated) filtering
- No server-side filtering for nailShape/style - these are client-side only
- API populates categoryId reference before returning

---

## 7. Client-Side Hook - Gallery Page Hook

### File: `/Users/hainguyen/Documents/nail-project/apps/client/src/hooks/useGalleryPage.ts`

**Lines 1-87**:
```typescript
export function useGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch categories from backend
  const { categories, isLoading: isLoadingCategories } = useGalleryCategories();

  // Find categoryId from slug
  const categoryId = useMemo(() => {
    if (selectedCategory === "all") return undefined;
    const category = categories.find((c) => c.slug === selectedCategory);
    return category?._id;
  }, [selectedCategory, categories]);

  // Backend filtering by categoryId (infinite scroll)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading: isLoadingItems,
    refetch,
  } = useInfiniteGalleryItems({
    categoryId,  // Passed to API query
    isActive: true,
  });

  const galleryItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  // ... image click, next/prev handlers
  
  return {
    categories,
    closeLightbox,
    currentIndex,
    fetchNextPage,
    filteredGallery: galleryItems,  // Already filtered by backend (categoryId)
    handleImageClick,
    handleNext,
    handlePrevious,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading: isLoadingItems || isLoadingCategories,
    isLoadingItems,
    lightboxOpen,
    refetch,
    selectedCategory,
    selectedImage,
    setSelectedCategory
  };
}
```

**Key Notes**:
- Line 9: Fetches GalleryCategory items from API
- Lines 18-22: Converts category slug to categoryId for backend query
- Lines 25-36: Uses infinite scroll with categoryId filter
- Line 40: Returns "already filtered" gallery items (by backend)
- Client does NOT filter by nailShape/style here - that happens in GalleryPage component

---

## 8. Admin Gallery Form

### File: `/Users/hainguyen/Documents/nail-project/apps/admin/src/components/gallery/GalleryFormModal.tsx`

**Current Implementation (Lines 1-416)**:

#### Form Schema (Lines 35-51)
```typescript
const gallerySchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional(),
  duration: z.string().max(20).optional(),
  featured: z.boolean(),
  price: z.string().max(20).optional(),
  title: z.string().min(3).max(100),
});
```

**Note**: Schema does NOT include nailShape or style fields.

#### Form Fields Rendered (Lines 229-383)
1. **Title** (required) - Line 231-244
2. **Category** (required, select dropdown) - Line 247-277
3. **Image Upload** (required for create, read-only for edit) - Line 280-321
4. **Description** (optional) - Line 324-337
5. **Price** (optional) - Line 341-353
6. **Duration** (optional) - Line 356-368
7. **Featured** (toggle switch) - Line 371-383

**Missing Fields**:
- `nailShape` - NOT in form
- `style` - NOT in form

#### Category Selection Implementation (Lines 246-277)
```typescript
{/* Category */}
<div className="space-y-2">
  <Label htmlFor="category">
    Category <span className="text-destructive">*</span>
  </Label>
  <Select
    value={category}
    onValueChange={(value) =>
      setValue("category", value as GalleryFormData["category"])
    }
    disabled={isEditMode}  // DISABLED IN EDIT MODE
  >
    <SelectTrigger>
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      {categories
        .filter((c) => c.isActive)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => (
          <SelectItem key={category._id} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
  {errors.category && (
    <p className="text-xs text-destructive">
      {errors.category.message}
    </p>
  )}
</div>
```

**Key Notes**:
- Category dropdown pulls from backend categories (passed as prop)
- Uses `category.slug` as select value (not categoryId)
- Form is DISABLED in edit mode (prevents changing category after creation)
- Form sends `category` string (slug) to API

---

## 9. Gallery Categories Seeder Data

### File: `/Users/hainguyen/Documents/nail-project/apps/api/src/seeds/data/gallery-categories.data.ts`

**Full Content (Lines 1-46)**:
```typescript
export const galleryCategoriesData = [
  {
    name: 'Manicure',
    slug: 'manicure',
    description: 'Classic and gel manicure designs showcasing elegant nail styles',
    sortIndex: 0,
    isActive: true,
  },
  {
    name: 'Pedicure',
    slug: 'pedicure',
    description: 'Spa and luxury pedicure treatments with beautiful finishes',
    sortIndex: 1,
    isActive: true,
  },
  {
    name: 'Nail Art',
    slug: 'nail-art',
    description: 'Creative and artistic nail designs for unique expressions',
    sortIndex: 2,
    isActive: true,
  },
  {
    name: 'Extensions',
    slug: 'extensions',
    description: 'Acrylic and dip powder nail extensions for length and strength',
    sortIndex: 3,
    isActive: true,
  },
  {
    name: 'Special Occasions',
    slug: 'special-occasions',
    description: 'Perfect nails for weddings, parties, and memorable events',
    sortIndex: 4,
    isActive: true,
  },
  {
    name: 'Seasonal Collections',
    slug: 'seasonal',
    description: 'Holiday and seasonal themed nail art designs',
    sortIndex: 5,
    isActive: true,
  },
];
```

**Note**: No "All" category in seed data - "all" is a special filter value, not a real category.

---

## 10. Filter Pills Component

### File: `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/FilterPills.tsx`

**Full Content (Lines 1-32)**:
```typescript
import { cn } from "@repo/utils/cn";
import { motion } from "motion/react";

interface FilterPillsProps {
  filters: Array<{ label: string; slug: string; }>;
  onSelect: (slug: string) => void;
  selected: string;
}

export function FilterPills({ filters, onSelect, selected }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map((filter) => (
        <motion.button
          key={filter.slug}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ damping: 30, stiffness: 300, type: "spring" }}
          onClick={() => onSelect(filter.slug)}
          className={cn(
            "min-h-[48px] rounded-full px-6 py-2.5 font-sans text-sm font-medium transition-all duration-200",
            selected === filter.slug
              ? "bg-primary text-primary-foreground shadow-md"
              : "border-2 border-border bg-card text-foreground shadow-sm hover:border-primary hover:shadow-md"
          )}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
}
```

**Generic reusable component** - used for both nailShape and nailStyle filters on client gallery page.

---

## 11. File Usage Summary Table

| File | Purpose | Contains | Lines |
|------|---------|----------|-------|
| **Client** | | | |
| `/apps/client/src/data/filter-config.ts` | Filter constants | NAIL_SHAPES, NAIL_STYLES | 1-15 |
| `/apps/client/src/pages/GalleryPage.tsx` | Gallery display page | Filter UI, client-side filtering | 1-213 |
| `/apps/client/src/hooks/useGalleryPage.ts` | Gallery hook | Backend category query | 1-87 |
| `/apps/client/src/components/gallery/FilterPills.tsx` | Filter component | Reusable filter button UI | 1-32 |
| **Admin** | | | |
| `/apps/admin/src/components/gallery/GalleryFormModal.tsx` | Form modal | Category select (only) | 1-416 |
| **Shared Types** | | | |
| `/packages/types/src/gallery.ts` | Gallery types | GalleryItem, GalleryCategory | 1-30 |
| `/packages/types/src/gallery-category.ts` | Category types | GalleryCategoryItem | 1-20 |
| **API - Schema** | | | |
| `/apps/api/src/modules/gallery/schemas/gallery.schema.ts` | Mongoose schema | Gallery document + indexes | 1-62 |
| **API - DTOs** | | | |
| `/apps/api/src/modules/gallery/dto/create-gallery.dto.ts` | Create DTO | Enums: GalleryCategory, NailShape, NailStyle | 1-140 |
| `/apps/api/src/modules/gallery/dto/query-gallery.dto.ts` | Query DTO | Filter params | 1-82 |
| **API - Logic** | | | |
| `/apps/api/src/modules/gallery/gallery.service.ts` | Service | findAll filtering | 50-110 |
| `/apps/api/src/modules/gallery/gallery.controller.ts` | Controller | Endpoints, validation | 1-226 |
| **API - Seed** | | | |
| `/apps/api/src/seeds/data/gallery-categories.data.ts` | Category seed | Initial categories | 1-46 |

---

## 12. Current Filtering Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              CLIENT - GalleryPage Component                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Category Filter (Backend)                               │
│     ┌──────────────────────────────────────────────────┐    │
│     │ Selected: "manicure"                             │    │
│     │ Categories fetched from: useGalleryCategories() │    │
│     │ Converted to categoryId for API query            │    │
│     └──────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  2. Infinite Scroll Query to Backend                        │
│     useInfiniteGalleryItems({ categoryId, isActive: true }) │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ GET /api/gallery?categoryId=507f...&isActive=true   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  3. Receive Paginated Items (shape/style populated)         │
│     galleryItems = [                                        │
│       {                                                      │
│         _id, title, imageUrl, category,                    │
│         nailShape: "almond",  ← Populated from DB          │
│         style: "3d",           ← Populated from DB          │
│         ...                                                  │
│       },                                                     │
│       ...                                                    │
│     ]                                                        │
│                           ↓                                   │
│  4. Client-Side Filtering (useMemo)                         │
│     ┌──────────────────────────────────────────────────┐    │
│     │ State:                                           │    │
│     │   selectedShape = "almond"  (from NAIL_SHAPES)   │    │
│     │   selectedStyle = "3d"      (from NAIL_STYLES)   │    │
│     │                                                  │    │
│     │ Filter: item.nailShape === selectedShape AND     │    │
│     │         item.style === selectedStyle             │    │
│     └──────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  5. Render Filtered Gallery (Masonry)                       │
│     {filteredGallery.map(item => <GalleryCard />)}         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. API Filtering Flow

```
┌──────────────────────────────────────────────────┐
│   Client Sends Query                             │
│   GET /api/gallery?categoryId=507f&isActive=true│
└──────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│  GalleryController.findAll(query)                │
│  - Receives QueryGalleryDto                      │
└──────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│  GalleryService.findAll(query)                   │
│  - Builds MongoDB filter object                  │
│                                                  │
│  Filter Logic:                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ if categoryId:                           │   │
│  │   filter.categoryId = ObjectId(categoryId)│  │
│  │                                          │   │
│  │ if category (deprecated):                │   │
│  │   filter.category = category             │   │
│  │                                          │   │
│  │ if featured !== undefined:               │   │
│  │   filter.featured = featured             │   │
│  │                                          │   │
│  │ if isActive !== undefined:               │   │
│  │   filter.isActive = isActive             │   │
│  │                                          │   │
│  │ if search:                               │   │
│  │   filter.$or = [title, description, price] │
│  │   (case-insensitive regex)               │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│  MongoDB Query                                   │
│  .find(filter)                                   │
│  .populate('categoryId', 'name slug description')│
│  .sort({ sortIndex: 1, createdAt: -1 })         │
│  .skip((page-1) * limit)                        │
│  .limit(limit)                                   │
│                                                  │
│  Database Indexes Used:                         │
│  - { categoryId: 1, sortIndex: 1 }             │
│  - { isActive: 1 }                             │
│  - { featured: 1 }                             │
│  - { nailShape: 1 } (NOT USED SERVER-SIDE)     │
│  - { style: 1 } (NOT USED SERVER-SIDE)         │
└──────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│  Response: Paginated Gallery Items               │
│  {                                               │
│    data: [                                       │
│      {                                           │
│        _id: "...",                              │
│        title: "...",                            │
│        imageUrl: "...",                         │
│        category: "manicure",  (slug)            │
│        categoryId: { (populated object)         │
│          _id: "507f...",                       │
│          name: "Manicure",                     │
│          slug: "manicure",                     │
│          description: "..."                    │
│        },                                       │
│        nailShape: "almond",   (for client use) │
│        style: "3d",            (for client use) │
│        ...                                      │
│      },                                         │
│      ...                                        │
│    ],                                           │
│    total: 150,                                  │
│    page: 1,                                     │
│    limit: 10                                    │
│  }                                              │
└──────────────────────────────────────────────────┘
```

**Important Note**: `nailShape` and `style` are NOT filtered on the backend - they're only used for client-side filtering.

---

## 14. Admin Form Data Flow

When creating a gallery item in admin:

```
GalleryFormModal (React Hook Form)
├─ Form Values:
│  ├─ title: "Summer Floral"
│  ├─ category: "manicure"  (slug, from dropdown)
│  ├─ description: "..."
│  ├─ price: "$45"
│  ├─ duration: "60 min"
│  ├─ featured: false
│  └─ image: File
│
└─ On Submit:
   ├─ Create Mode:
   │  └─ FormData {
   │     image: File
   │     title: "Summer Floral"
   │     category: "manicure"  ← Sent as string
   │     description: "..."
   │     price: "$45"
   │     duration: "60 min"
   │     featured: "false"
   │     isActive: "true"
   │     sortIndex: "0"
   │  }
   │  └─ POST /api/gallery (multipart/form-data)
   │
   └─ Edit Mode:
      └─ JSON {
         title: "Summer Floral"
         category: "manicure"  ← Sent as string
         description: "..."
         price: "$45"
         duration: "60 min"
         featured: false
      }
      └─ PATCH /api/gallery/:id (application/json)

API Processing:
├─ CreateGalleryDto validates:
│  ├─ category: GalleryCategory (enum) OR
│  └─ categoryId: string (ObjectId)
│
└─ GalleryService.create():
   ├─ If categoryId provided: use it
   ├─ If only category: DEPRECATED - not recommended
   └─ If neither: auto-assign "all" category
```

**Problem**: Admin form sends `category` (string/slug), not `categoryId` (ObjectId).  
**Result**: API must accept category string for backward compatibility, then internally convert if needed.

---

## 15. Known Gaps & Issues

### Gap 1: Admin Form Missing nailShape/style
- **Location**: GalleryFormModal.tsx
- **Issue**: No form fields for nailShape or style
- **Impact**: Admin cannot set these values when creating/editing gallery items
- **Workaround**: None - values can only be set directly in database or via API

### Gap 2: Category Field in GalleryItem Type
- **Location**: packages/types/src/gallery.ts, line 2
- **Issue**: `category: string` is ambiguous - could be slug or full category name
- **Current Use**: Actually stores the slug (matches filter)
- **Better**: Consider renaming to `categorySlug` for clarity

### Gap 3: No Server-Side nailShape/style Filtering
- **Location**: API filters only categoryId, featured, isActive, search
- **Issue**: nailShape and style are only filtered client-side
- **Impact**: Initial API response contains all items regardless of shape/style
- **Note**: This is by design (client-side filtering matches UI pattern)

### Gap 4: Admin Form Disables Category in Edit Mode
- **Location**: GalleryFormModal.tsx line 256
- **Issue**: Category cannot be changed after creation
- **Rationale**: Category is used as part of sorting/organization
- **Workaround**: Delete and recreate item if category needs to change

### Gap 5: Deprecated category Field in Schema
- **Location**: Gallery schema, line 21 (DEPRECATED marker)
- **Issue**: Still exists for backward compatibility
- **Plan**: Should be removed in future migration
- **Current Status**: Both category and categoryId supported in queries

---

## 16. Implementation Pattern Analysis

### Backend (API)

**Filter Architecture**:
- Primary filter: `categoryId` (MongoDB ObjectId reference)
- Legacy filter: `category` (string enum, deprecated)
- Secondary filters: `featured`, `isActive`, `search` (text)
- Non-filtered attributes: `nailShape`, `style` (returned but not queried)

**Response Pattern**:
- Returns all shape/style data with items
- Client determines what to display based on shape/style

### Frontend (Client)

**Filter Architecture - Two-Tier**:
1. **Tier 1 - Backend**: Category selection → API query
2. **Tier 2 - Client**: Shape & Style selection → useMemo filter

**State Management**:
- Category: managed in useGalleryPage hook
- Shape/Style: managed directly in GalleryPage component
- Results: infinite scroll paginated from backend

### Admin

**Edit Flow**:
- Form reads from backend category list
- Form cannot modify category after creation
- nailShape/style cannot be set via UI

---

## 17. Constants Inventory

### Hard-Coded in Code

| Constant | Location | Values | Usage |
|----------|----------|--------|-------|
| `NAIL_SHAPES` | filter-config.ts:1 | almond, coffin, square, stiletto | GalleryPage filter UI |
| `NAIL_STYLES` | filter-config.ts:9 | 3d, mirror, gem, ombre | GalleryPage filter UI |
| `GalleryCategory` | gallery.ts:15 | all, extensions, manicure, nail-art, pedicure, seasonal | Type definitions |
| `NailShape` (DTO) | create-gallery.dto.ts:21 | almond, coffin, square, stiletto | API validation |
| `NailStyle` (DTO) | create-gallery.dto.ts:28 | 3d, mirror, gem, ombre | API validation |

### Stored in Database

| Entity | Location | Sample Data |
|--------|----------|-------------|
| Gallery Categories | gallery-categories.data.ts | 6 categories (manicure, pedicure, nail-art, extensions, special-occasions, seasonal) |
| Gallery Items | MongoDB | Individual items with optional nailShape/style |

---

## 18. Recommendations

### For Immediate Use
1. **Understand the dual-tier filter pattern**: Backend categories + client-side shape/style
2. **The NAIL_SHAPES/NAIL_STYLES constants are static** - changes require code updates and redeploy
3. **Admin cannot set shape/style** - only through database or direct API calls

### For Future Improvements
1. **Make shape/style filterable on backend** - add indexes and query support
2. **Add shape/style fields to admin form** - allow complete editing
3. **Make shape/style dynamic** - store in database instead of hard-coded
4. **Rename `category` field** - use `categorySlug` for clarity
5. **Remove deprecated `category` field** - migrate fully to `categoryId`
6. **Allow category changes in edit mode** - reconsider current restriction

---

## Files Checklist

- [x] `/Users/hainguyen/Documents/nail-project/apps/client/src/data/filter-config.ts`
- [x] `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery.ts`
- [x] `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery-category.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/query-gallery.dto.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/gallery.service.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/gallery.controller.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`
- [x] `/Users/hainguyen/Documents/nail-project/apps/client/src/hooks/useGalleryPage.ts`
- [x] `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/FilterPills.tsx`
- [x] `/Users/hainguyen/Documents/nail-project/apps/admin/src/components/gallery/GalleryFormModal.tsx`
- [x] `/Users/hainguyen/Documents/nail-project/apps/api/src/seeds/data/gallery-categories.data.ts`

---

**Report Generated**: 2026-02-19  
**Next Steps**: Review gallery enhancement plan based on these findings
