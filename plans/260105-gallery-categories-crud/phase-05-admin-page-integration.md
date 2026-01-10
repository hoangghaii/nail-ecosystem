# Phase 5: Admin GalleryPage Integration (Tabs UI)

## 🎯 Goal
Integrate category management into GalleryPage with tabs UI (Gallery Items | Categories).

## 📦 Tasks

### 5.1 Add Imports

**File**: `apps/admin/src/pages/GalleryPage.tsx`

Add imports at top:
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CategoryFormModal,
  DeleteCategoryDialog,
} from "@/components/gallery";
import { useGalleryCategories } from "@/hooks/api/useGalleryCategory";
import type { GalleryCategoryItem } from "@repo/types/gallery-category";
import { DropdownMenu, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
```

### 5.2 Add State Variables

After existing state declarations, add:
```typescript
// Category management state
const [activeTab, setActiveTab] = useState<"items" | "categories">("items");
const [selectedCategory, setSelectedCategory] = useState<
  GalleryCategoryItem | undefined
>();
const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);

// Fetch categories
const { data: categoriesData } = useGalleryCategories();
const categories = useMemo(() => categoriesData?.data ?? [], [categoriesData]);
```

### 5.3 Add Category Handlers

After existing gallery handlers:
```typescript
const handleCreateCategory = () => {
  setSelectedCategory(undefined);
  setIsCategoryFormOpen(true);
};

const handleEditCategory = (category: GalleryCategoryItem) => {
  setSelectedCategory(category);
  setIsCategoryFormOpen(true);
};

const handleDeleteCategory = (category: GalleryCategoryItem) => {
  setSelectedCategory(category);
  setIsDeleteCategoryOpen(true);
};
```

### 5.4 Update JSX with Tabs Layout

Replace existing return JSX:

```tsx
return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
        <p className="text-muted-foreground">
          Manage your nail art gallery and categories
        </p>
      </div>

      {/* Conditional Add Button */}
      {activeTab === "items" ? (
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      ) : (
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      )}
    </div>

    {/* Tabs */}
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as "items" | "categories")}
    >
      <TabsList>
        <TabsTrigger value="items">Gallery Items</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>

      {/* Tab 1: Gallery Items (EXISTING CONTENT) */}
      <TabsContent value="items" className="space-y-6">
        {/* Keep all existing Category Filter Card */}
        {/* Keep all existing Gallery Grid */}
      </TabsContent>

      {/* Tab 2: Categories (NEW) */}
      <TabsContent value="categories" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
            <CardDescription>
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              {/* Empty State */}
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">No categories found</p>
                  <Button onClick={handleCreateCategory} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Category
                  </Button>
                </div>
              </div>
            ) : (
              {/* Category List */}
              <div className="space-y-2">
                {categories
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{category.name}</h3>
                          {!category.isActive && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                              Inactive
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {category.slug}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Existing Gallery Modals */}
    <GalleryFormModal ... />
    <DeleteGalleryDialog ... />

    {/* NEW Category Modals */}
    <CategoryFormModal
      category={selectedCategory}
      open={isCategoryFormOpen}
      onOpenChange={setIsCategoryFormOpen}
    />
    <DeleteCategoryDialog
      category={selectedCategory}
      open={isDeleteCategoryOpen}
      onOpenChange={setIsDeleteCategoryOpen}
    />
  </div>
);
```

## 🔑 Key Features

- **Tabs Component**: Switches between Gallery Items and Categories
- **Conditional Add Button**: Changes based on active tab
- **Alphabetical Sorting**: Categories sorted by name
- **Simple List View**: No DataTable (simpler than BannersPage)
- **Empty State**: CTA to create first category
- **Inactive Badge**: Visual indicator for inactive categories
- **Actions Dropdown**: Edit and Delete per category

## ✅ Verification

1. Type-check:
```bash
cd apps/admin
npm run type-check
```

2. Visual verification:
- Both tabs render correctly
- Add button changes label based on tab
- Category list shows all categories
- Actions dropdown works
- Modals open/close correctly

## 📁 Files Modified

- `apps/admin/src/pages/GalleryPage.tsx` (MAJOR UPDATE)

## ⏭️ Next Phase

Phase 6: Update Existing Admin Components
