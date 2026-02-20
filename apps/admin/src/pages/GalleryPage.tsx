import type { GalleryItem } from "@repo/types/gallery";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  DeleteGalleryDialog,
  GalleryCategoriesTab,
  GalleryFormModal,
  GalleryItemsTab,
  NailOptionsTab,
} from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNailShapes, useNailStyles } from "@/hooks/api/useNailOptions";

type TabValue = "items" | "nail-options" | "categories";

export function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | undefined>();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("items");

  const { data: shapesData } = useNailShapes();
  console.log("🚀 ~ GalleryPage ~ shapesData:", shapesData)
  const { data: stylesData } = useNailStyles();
  const nailShapes = useMemo(() => shapesData?.data ?? [], [shapesData]);
  const nailStyles = useMemo(() => stylesData?.data ?? [], [stylesData]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lookbook</h1>
          <p className="text-muted-foreground">
            Manage your nail art lookbook, shapes, and styles
          </p>
        </div>
        {activeTab === "items" && (
          <Button onClick={handleCreateItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="items">Lookbook Items</TabsTrigger>
          <TabsTrigger value="nail-options">Shapes & Styles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          <GalleryItemsTab
            nailShapes={nailShapes}
            nailStyles={nailStyles}
            onCreateItem={handleCreateItem}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
          />
        </TabsContent>

        <TabsContent value="nail-options" className="space-y-6">
          <NailOptionsTab />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <GalleryCategoriesTab
            categories={[]}
            onCreateCategory={() => {}}
            onDeleteCategory={() => {}}
            onEditCategory={() => {}}
          />
        </TabsContent>
      </Tabs>

      <GalleryFormModal
        galleryItem={selectedItem}
        nailShapes={nailShapes}
        nailStyles={nailStyles}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
      />

      <DeleteGalleryDialog
        galleryItem={selectedItem}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
