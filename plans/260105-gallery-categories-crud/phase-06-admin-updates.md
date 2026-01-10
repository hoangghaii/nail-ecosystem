# Phase 6: Update Existing Admin Components

## 🎯 Goal
Migrate `CategoryFilter` and `GalleryFormModal` from hardcoded enum to dynamic API-driven categories.

## 📦 Tasks

### 6.1 Update CategoryFilter Component

**File**: `apps/admin/src/components/gallery/CategoryFilter.tsx`

**Changes**:

1. **Update Props**:
```typescript
// Before
export type CategoryFilterProps = {
  activeCategory: GalleryCategoryType;
  itemCounts: Record<GalleryCategoryType, number>;
  onCategoryChange: (category: GalleryCategoryType) => void;
};

// After
export type CategoryFilterProps = {
  activeCategory: string;
  categories: GalleryCategoryItem[];  // NEW PROP
  itemCounts: Record<string, number>;
  onCategoryChange: (category: string) => void;
};
```

2. **Remove Hardcoded Labels**:
```typescript
// Remove this
const CATEGORY_LABELS: Record<GalleryCategoryType, string> = {
  [GalleryCategory.ALL]: "All",
  // ...
};
```

3. **Dynamic Category List**:
```typescript
// Add "All" filter at the beginning
const allCategories = [
  { _id: "all", name: "All", slug: "all", isActive: true },
  ...categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.name.localeCompare(b.name)),
];
```

4. **Update Render Logic**:
```typescript
return (
  <div className="flex flex-wrap gap-2">
    {allCategories.map((category) => {
      const count = itemCounts[category.slug] || 0;
      const isActive = activeCategory === category.slug;

      return (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category.slug)}
          className={...}
        >
          <span>{category.name}</span>
          <span className={...}>{count}</span>
        </button>
      );
    })}
  </div>
);
```

### 6.2 Update GalleryPage Category Counts

**File**: `apps/admin/src/pages/GalleryPage.tsx`

Update `categoryCounts` useMemo:

```typescript
// Before: Hardcoded record
const categoryCounts = useMemo(() => {
  const counts: Record<GalleryCategoryType, number> = {
    [GalleryCategory.ALL]: galleryItems.length,
    [GalleryCategory.EXTENSIONS]: 0,
    // ...
  };
  return counts;
}, [galleryItems]);

// After: Dynamic counts
const categoryCounts = useMemo(() => {
  const counts: Record<string, number> = {
    all: galleryItems.length,
  };

  // Count items per category
  categories.forEach((cat) => {
    counts[cat.slug] = galleryItems.filter(
      (item) => item.category === cat.slug
    ).length;
  });

  return counts;
}, [galleryItems, categories]);
```

Update `CategoryFilter` usage:
```typescript
<CategoryFilter
  activeCategory={activeCategory}
  categories={categories}  // NEW PROP
  itemCounts={categoryCounts}
  onCategoryChange={setActiveCategory}
/>
```

### 6.3 Update GalleryFormModal Component

**File**: `apps/admin/src/components/gallery/GalleryFormModal.tsx`

**Changes**:

1. **Add Categories Prop**:
```typescript
export type GalleryFormModalProps = {
  categories: GalleryCategoryItem[];  // NEW PROP
  item?: GalleryItem;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
};
```

2. **Update Zod Schema**:
```typescript
// Before: Hardcoded enum
category: z.enum([
  "extensions",
  "manicure",
  "nail-art",
  "pedicure",
  "seasonal",
]),

// After: String validation
category: z.string().min(1, "Category is required"),
```

3. **Dynamic SelectContent**:
```typescript
{/* Before: Hardcoded */}
<SelectContent>
  <SelectItem value={GalleryCategory.EXTENSIONS}>Extensions</SelectItem>
  <SelectItem value={GalleryCategory.MANICURE}>Manicure</SelectItem>
  {/* ... */}
</SelectContent>

{/* After: Dynamic */}
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
```

4. **Update GalleryPage Usage**:
```typescript
<GalleryFormModal
  categories={categories}  // NEW PROP
  item={selectedItem}
  open={isFormModalOpen}
  onOpenChange={setIsFormModalOpen}
/>
```

## 🔑 Key Changes

- **CategoryFilter**: Now receives categories as prop, builds list dynamically
- **GalleryFormModal**: Category dropdown populated from API
- **GalleryPage**: Passes categories to both components
- **Type Safety**: All components use `string` instead of enum type

## ✅ Verification

1. Type-check:
```bash
cd apps/admin
npm run type-check
```

2. Visual verification:
- CategoryFilter shows all active categories + "All"
- Category counts display correctly
- GalleryFormModal dropdown shows active categories
- Creating/editing gallery items works with new categories

## 📁 Files Modified

- `apps/admin/src/components/gallery/CategoryFilter.tsx` (UPDATED)
- `apps/admin/src/components/gallery/GalleryFormModal.tsx` (UPDATED)
- `apps/admin/src/pages/GalleryPage.tsx` (UPDATED)

## ⏭️ Next Phase

Phase 7: Client App Migration
