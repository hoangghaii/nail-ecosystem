import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  GalleryItem,
  GalleryCategory as GalleryCategoryType,
} from "@/types/gallery.types";

import {
  CategoryFilter,
  DeleteGalleryDialog,
  FeaturedBadge,
  GalleryFormModal,
} from "@/components/gallery";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { galleryService } from "@/services/gallery.service";
import { useGalleryStore } from "@/store/galleryStore";
import { GalleryCategory } from "@/types/gallery.types";

export function GalleryPage() {
  const galleryItems = useGalleryStore((state) => state.galleryItems);
  const initializeGallery = useGalleryStore((state) => state.initializeGallery);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | undefined>();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryType>(
    GalleryCategory.ALL,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const data = await galleryService.getAll();
      useGalleryStore.getState().setGalleryItems(data);
    } catch (error) {
      console.error("Error loading gallery:", error);
      toast.error("Failed to load gallery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeGallery();
    loadGallery();
  }, [initializeGallery]);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleDelete = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleFeatured = async (item: GalleryItem) => {
    try {
      await galleryService.toggleFeatured(item.id);
      toast.success(
        item.featured
          ? "Removed from featured items"
          : "Added to featured items",
      );
      loadGallery();
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Failed to update featured status. Please try again.");
    }
  };

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let items = galleryItems;

    // Filter by category
    if (activeCategory !== GalleryCategory.ALL) {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      );
    }

    return items;
  }, [galleryItems, activeCategory, debouncedSearch]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<GalleryCategoryType, number> = {
      [GalleryCategory.ALL]: galleryItems.length,
      [GalleryCategory.EXTENSIONS]: 0,
      [GalleryCategory.MANICURE]: 0,
      [GalleryCategory.NAIL_ART]: 0,
      [GalleryCategory.PEDICURE]: 0,
      [GalleryCategory.SEASONAL]: 0,
    };

    galleryItems.forEach((item) => {
      counts[item.category as GalleryCategoryType]++;
    });

    return counts;
  }, [galleryItems]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Manage your nail art gallery and showcase your work
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Filter gallery items by category</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryFilter
            activeCategory={activeCategory}
            itemCounts={categoryCounts}
            onCategoryChange={setActiveCategory}
          />
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gallery Items</CardTitle>
              <CardDescription>
                {filteredItems.length} of {galleryItems.length} items
              </CardDescription>
            </div>
            <div className="w-full max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading gallery...
                </p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery || activeCategory !== GalleryCategory.ALL
                    ? "No items found matching your filters"
                    : "No gallery items found"}
                </p>
                {galleryItems.length === 0 && (
                  <Button className="mt-4" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first item
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {item.featured && (
                      <div className="absolute right-2 top-2">
                        <FeaturedBadge />
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(item)}
                          >
                            {item.featured ? (
                              <>
                                <StarOff className="mr-2 h-4 w-4" />
                                Unfeature
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                Feature
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      {item.price && <span>{item.price}</span>}
                      {item.price && item.duration && (
                        <span className="text-border">•</span>
                      )}
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <GalleryFormModal
        galleryItem={selectedItem}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSuccess={loadGallery}
      />

      <DeleteGalleryDialog
        galleryItem={selectedItem}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={loadGallery}
      />
    </div>
  );
}
