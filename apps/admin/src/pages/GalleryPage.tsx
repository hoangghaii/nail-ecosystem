import type { GalleryItem } from "@repo/types/gallery";
import type { GalleryCategoryItem } from "@repo/types/gallery-category";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CategoryFormModal,
  DeleteCategoryDialog,
  DeleteGalleryDialog,
  GalleryCategoriesTab,
  GalleryFormModal,
  GalleryItemsTab,
} from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGalleryCategories } from "@/hooks/api/useGalleryCategory";

export function GalleryPage() {
  // Gallery items state
  const [selectedItem, setSelectedItem] = useState<GalleryItem | undefined>();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Gallery item handlers
  const handleCreateItem = () => {
    setSelectedItem(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleDeleteItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Category handlers
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
          <Button onClick={handleCreateItem}>
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
        onValueChange={(v: string) => setActiveTab(v as "items" | "categories")}
      >
        <TabsList>
          <TabsTrigger value="items">Gallery Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Tab 1: Gallery Items */}
        <TabsContent value="items" className="space-y-6">
          <GalleryItemsTab
            categories={categories}
            onCreateItem={handleCreateItem}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
          />
        </TabsContent>

        {/* Tab 2: Categories */}
        <TabsContent value="categories" className="space-y-6">
          <GalleryCategoriesTab
            categories={categories}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
          />
        </TabsContent>
      </Tabs>

      {/* Gallery Modals */}
      <GalleryFormModal
        categories={categories}
        galleryItem={selectedItem}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
      />

      <DeleteGalleryDialog
        galleryItem={selectedItem}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      {/* Category Modals */}
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
}
