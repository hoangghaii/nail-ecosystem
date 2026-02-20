# Detailed Line-by-Line Occurrences

## 1. NAIL_SHAPES Constant

### Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/data/filter-config.ts`  
**Lines**: 1-7

```typescript
1 │ export const NAIL_SHAPES = [
2 │   { label: "Tất Cả", slug: "all" },
3 │   { label: "Almond", slug: "almond" },
4 │   { label: "Coffin", slug: "coffin" },
5 │   { label: "Square", slug: "square" },
6 │   { label: "Stiletto", slug: "stiletto" },
7 │ ];
```

### Usages

#### Usage 1: Import in GalleryPage
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Line**: 15

```typescript
15 │ import { NAIL_SHAPES, NAIL_STYLES } from "@/data/filter-config";
```

#### Usage 2: Filter Pills Rendering
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Lines**: 108-112

```typescript
108 │           <FilterPills
109 │             filters={NAIL_SHAPES}
110 │             selected={selectedShape}
111 │             onSelect={setSelectedShape}
112 │           />
```

---

## 2. NAIL_STYLES Constant

### Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/data/filter-config.ts`  
**Lines**: 9-15

```typescript
9  │ export const NAIL_STYLES = [
10 │   { label: "Tất Cả", slug: "all" },
11 │   { label: "Vẽ 3D", slug: "3d" },
12 │   { label: "Tráng Gương", slug: "mirror" },
13 │   { label: "Đính Đá", slug: "gem" },
14 │   { label: "Ombre", slug: "ombre" },
15 │ ];
```

### Usages

#### Usage 1: Import in GalleryPage
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Line**: 15

```typescript
15 │ import { NAIL_SHAPES, NAIL_STYLES } from "@/data/filter-config";
```

#### Usage 2: Filter Pills Rendering
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Lines**: 120-124

```typescript
120 │           <FilterPills
121 │             filters={NAIL_STYLES}
122 │             selected={selectedStyle}
123 │             onSelect={setSelectedStyle}
124 │           />
```

---

## 3. Gallery "category" Field Usage

### Type Definition
**File**: `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery.ts`  
**Line**: 2

```typescript
1  │ export type GalleryItem = {
2  │   category: string; // Changed from enum to string for dynamic categories (category slug)
3  │   createdAt?: Date;
```

### Schema Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Lines**: 20-21

```typescript
20 │   @Prop({ required: false })
21 │   category?: string; // DEPRECATED: all, extensions, manicure, nail-art, pedicure, seasonal
```

### API DTO Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 71-79

```typescript
71 │   @ApiPropertyOptional({
72 │     description: 'DEPRECATED: Use categoryId instead. Gallery category enum',
73 │     enum: GalleryCategory,
74 │     example: GalleryCategory.NAIL_ART,
75 │     deprecated: true,
76 │   })
77 │   @IsEnum(GalleryCategory)
78 │   @IsOptional()
79 │   category?: GalleryCategory;
```

### Service Filtering
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/gallery.service.ts`  
**Lines**: 71-74

```typescript
71 │   // DEPRECATED: Filter by category string (backward compat)
72 │   if (category) {
73 │     filter.category = category;
74 │   }
```

### Admin Form Handling
**File**: `/Users/hainguyen/Documents/nail-project/apps/admin/src/components/gallery/GalleryFormModal.tsx`  
**Line**: 36

```typescript
35 │ const gallerySchema = z.object({
36 │   category: z.string().min(1, "Category is required"),
```

**Lines**: 103-109 (in edit form setup)

```typescript
103 │       reset({
104 │         category: galleryItem.category as GalleryFormData["category"],
105 │         description: galleryItem.description || "",
106 │         duration: galleryItem.duration || "",
107 │         featured: galleryItem.featured || false,
108 │         price: galleryItem.price || "",
109 │         title: galleryItem.title,
```

**Lines**: 164-166 (sending to API on edit)

```typescript
164 │         data: {
165 │           category: data.category,
166 │           description: data.description || undefined,
```

**Lines**: 192-193 (sending to API on create)

```typescript
192 │       // Metadata
193 │       formData.append("category", data.category);
```

---

## 4. nailShape Field Usage

### Type Definition
**File**: `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery.ts`  
**Line**: 9

```typescript
9  │   nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto'; // Nail shape for filtering
```

### Schema Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Lines**: 38-43

```typescript
38 │   @Prop({
39 │     type: String,
40 │     enum: ['almond', 'coffin', 'square', 'stiletto'],
41 │     required: false,
42 │   })
43 │   nailShape?: string; // Nail shape for filtering
```

### Schema Index
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Line**: 60

```typescript
60 │ GallerySchema.index({ nailShape: 1 }); // For filtering
```

### DTO Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 123-130

```typescript
123 │   @ApiPropertyOptional({
124 │     description: 'Nail shape for filtering',
125 │     enum: NailShape,
126 │     example: NailShape.ALMOND,
127 │   })
128 │   @IsEnum(NailShape)
129 │   @IsOptional()
130 │   nailShape?: NailShape;
```

### Client Filtering
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Line**: 41

```typescript
41 │   const [selectedShape, setSelectedShape] = useState("all");
```

**Lines**: 47-48 (filtering logic)

```typescript
47 │       const shapeMatch =
48 │         selectedShape === "all" || item.nailShape === selectedShape;
```

---

## 5. style Field Usage

### Type Definition
**File**: `/Users/hainguyen/Documents/nail-project/packages/types/src/gallery.ts`  
**Line**: 11

```typescript
11 │   style?: '3d' | 'mirror' | 'gem' | 'ombre'; // Nail style for filtering
```

### Schema Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Lines**: 45-50

```typescript
45 │   @Prop({
46 │     type: String,
47 │     enum: ['3d', 'mirror', 'gem', 'ombre'],
48 │     required: false,
49 │   })
50 │   style?: string; // Nail style for filtering
```

### Schema Index
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Line**: 61

```typescript
61 │ GallerySchema.index({ style: 1 }); // For filtering
```

### DTO Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 132-139

```typescript
132 │   @ApiPropertyOptional({
133 │     description: 'Nail style for filtering',
134 │     enum: NailStyle,
135 │     example: NailStyle.THREE_D,
136 │   })
137 │   @IsEnum(NailStyle)
138 │   @IsOptional()
139 │   style?: NailStyle;
```

### Client Filtering
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`  
**Line**: 42

```typescript
42 │   const [selectedStyle, setSelectedStyle] = useState("all");
```

**Lines**: 49-50 (filtering logic)

```typescript
49 │       const styleMatch =
50 │         selectedStyle === "all" || item.style === selectedStyle;
```

---

## 6. categoryId Field Usage

### Schema Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Lines**: 17-18

```typescript
17 │   @Prop({ type: Types.ObjectId, ref: 'GalleryCategory', default: null })
18 │   categoryId: Types.ObjectId | null;
```

### Schema Index
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/schemas/gallery.schema.ts`  
**Line**: 56

```typescript
56 │ GallerySchema.index({ categoryId: 1, sortIndex: 1 });
```

### DTO Definition
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 62-69

```typescript
62 │   @ApiPropertyOptional({
63 │     description: 'Gallery category ID (defaults to "all" category if not provided)',
64 │     example: '507f1f77bcf86cd799439011',
65 │   })
66 │   @IsString()
67 │   @IsOptional()
68 │   categoryId?: string;
```

### Query DTO
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/query-gallery.dto.ts`  
**Lines**: 14-20

```typescript
14 │   @ApiPropertyOptional({
15 │     description: 'Filter by gallery category ID',
16 │     example: '507f1f77bcf86cd799439011',
17 │   })
18 │   @IsOptional()
19 │   @IsString()
20 │   categoryId?: string;
```

### Service Logic - Create
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/gallery.service.ts`  
**Lines**: 24-39

```typescript
24 │   async create(createGalleryDto: CreateGalleryDto): Promise<Gallery> {
25 │     let categoryId = createGalleryDto.categoryId;
26 │
27 │     // Auto-assign 'all' category if not provided
28 │     if (!categoryId) {
29 │       const allCategory = await this.galleryCategoryService.findBySlug('all');
30 │       categoryId = allCategory._id.toString();
31 │     } else {
32 │       // Validate categoryId exists
33 │       await this.galleryCategoryService.findOne(categoryId);
34 │     }
35 │
36 │     const gallery = new this.galleryModel({
37 │       ...createGalleryDto,
38 │       categoryId: new Types.ObjectId(categoryId),
39 │     });
```

### Service Logic - Query
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/gallery.service.ts`  
**Lines**: 63-69

```typescript
63 │   // NEW: Filter by categoryId
64 │   if (categoryId) {
65 │     if (!Types.ObjectId.isValid(categoryId)) {
66 │       throw new BadRequestException('Invalid category ID');
67 │     }
68 │     filter.categoryId = new Types.ObjectId(categoryId);
69 │   }
```

### Client Hook - Category Conversion
**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/hooks/useGalleryPage.ts`  
**Lines**: 18-22

```typescript
18 │   // Find categoryId from slug
19 │   const categoryId = useMemo(() => {
20 │     if (selectedCategory === "all") return undefined;
21 │     const category = categories.find((c) => c.slug === selectedCategory);
22 │     return category?._id;
```

**Lines**: 34-35 (passed to API)

```typescript
34 │   } = useInfiniteGalleryItems({
35 │     categoryId,
36 │     isActive: true,
```

---

## 7. GalleryCategory Enum - API DTO

**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 12-19

```typescript
12 │ export enum GalleryCategory {
13 │   ALL = 'all',
14 │   EXTENSIONS = 'extensions',
15 │   MANICURE = 'manicure',
16 │   NAIL_ART = 'nail-art',
17 │   PEDICURE = 'pedicure',
18 │   SEASONAL = 'seasonal',
19 │ }
```

### Export in Query DTO
**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/query-gallery.dto.ts`  
**Line**: 11

```typescript
11 │ import { GalleryCategory } from './create-gallery.dto';
```

---

## 8. NailShape Enum - API DTO

**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 21-26

```typescript
21 │ export enum NailShape {
22 │   ALMOND = 'almond',
23 │   COFFIN = 'coffin',
24 │   SQUARE = 'square',
25 │   STILETTO = 'stiletto',
26 │ }
```

---

## 9. NailStyle Enum - API DTO

**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`  
**Lines**: 28-33

```typescript
28 │ export enum NailStyle {
29 │   THREE_D = '3d',
30 │   MIRROR = 'mirror',
31 │   GEM = 'gem',
32 │   OMBRE = 'ombre',
33 │ }
```

---

## 10. Gallery Categories Seed Data

**File**: `/Users/hainguyen/Documents/nail-project/apps/api/src/seeds/data/gallery-categories.data.ts`  
**Lines**: 1-46

```typescript
1  │ export const galleryCategoriesData = [
2  │   {
3  │     name: 'Manicure',
4  │     slug: 'manicure',
5  │     description: 'Classic and gel manicure designs showcasing elegant nail styles',
6  │     sortIndex: 0,
7  │     isActive: true,
8  │   },
9  │   {
10 │     name: 'Pedicure',
11 │     slug: 'pedicure',
12 │     description: 'Spa and luxury pedicure treatments with beautiful finishes',
13 │     sortIndex: 1,
14 │     isActive: true,
15 │   },
16 │   {
17 │     name: 'Nail Art',
18 │     slug: 'nail-art',
19 │     description: 'Creative and artistic nail designs for unique expressions',
20 │     sortIndex: 2,
21 │     isActive: true,
22 │   },
23 │   {
24 │     name: 'Extensions',
25 │     slug: 'extensions',
26 │     description: 'Acrylic and dip powder nail extensions for length and strength',
27 │     sortIndex: 3,
28 │     isActive: true,
29 │   },
30 │   {
31 │     name: 'Special Occasions',
32 │     slug: 'special-occasions',
33 │     description: 'Perfect nails for weddings, parties, and memorable events',
34 │     sortIndex: 4,
35 │     isActive: true,
36 │   },
37 │   {
38 │     name: 'Seasonal Collections',
39 │     slug: 'seasonal',
40 │     description: 'Holiday and seasonal themed nail art designs',
41 │     sortIndex: 5,
42 │     isActive: true,
43 │   },
44 │ ];
```

---

## Summary Table

| Entity | File | Line(s) | Type |
|--------|------|---------|------|
| NAIL_SHAPES | filter-config.ts | 1-7 | Constant |
| NAIL_STYLES | filter-config.ts | 9-15 | Constant |
| GalleryItem.category | gallery.ts | 2 | Type field |
| GalleryItem.nailShape | gallery.ts | 9 | Type field |
| GalleryItem.style | gallery.ts | 11 | Type field |
| Gallery.categoryId | gallery.schema.ts | 17-18 | Schema field |
| Gallery.category | gallery.schema.ts | 20-21 | Schema field |
| Gallery.nailShape | gallery.schema.ts | 38-43 | Schema field |
| Gallery.style | gallery.schema.ts | 45-50 | Schema field |
| GalleryCategory enum (DTO) | create-gallery.dto.ts | 12-19 | Enum |
| NailShape enum | create-gallery.dto.ts | 21-26 | Enum |
| NailStyle enum | create-gallery.dto.ts | 28-33 | Enum |
| categoryId query param | query-gallery.dto.ts | 14-20 | DTO field |
| galleryCategoriesData | gallery-categories.data.ts | 1-46 | Seed data |

