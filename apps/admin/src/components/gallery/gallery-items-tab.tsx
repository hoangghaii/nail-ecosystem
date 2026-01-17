import type { GalleryItem } from "@repo/types/gallery";
import type { GalleryCategoryItem } from "@repo/types/gallery-category";

import { queryKeys } from "@repo/utils/api";
import { useQueryClient } from "@tanstack/react-query";
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

import { CategoryFilter, FeaturedBadge } from "@/components/gallery";
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
import {
  useGalleryItems,
  useToggleGalleryFeatured,
} from "@/hooks/api/useGallery";
import { galleryService } from "@/services/gallery.service";

export type GalleryItemsTabProps = {
  categories: GalleryCategoryItem[];
  onCreateItem: () => void;
  onDeleteItem: (item: GalleryItem) => void;
  onEditItem: (item: GalleryItem) => void;
};

export function GalleryItemsTab({
  categories,
  onCreateItem,
  onDeleteItem,
  onEditItem,
}: GalleryItemsTabProps) {
  const queryClient = useQueryClient();

  const [activeCategory, setActiveCategory] = useState<string>(
    categories?.[0]?._id,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useGalleryItems({
    categoryId: activeCategory,
    limit: 100,
  });

  const galleryItems = useMemo(() => data?.data ?? [], [data]);

  const toggleFeatured = useToggleGalleryFeatured();

  // Prefetch gallery item details on hover
  const handleItemHover = (item: GalleryItem) => {
    queryClient.prefetchQuery({
      queryFn: () => galleryService.getById(item._id),
      queryKey: queryKeys.gallery.detail(item._id),
      staleTime: 60_000,
    });
  };

  const handleToggleFeatured = (item: GalleryItem) => {
    toggleFeatured.mutate({ featured: !item.featured, id: item._id });
  };

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: galleryItems.length,
    };

    categories.forEach((cat) => {
      counts[cat.slug] = galleryItems.filter(
        (item) => item.category === cat.slug,
      ).length;
    });

    return counts;
  }, [galleryItems, categories]);

  useEffect(() => {
    if (categories.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(categories[0]._id);
    }
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Filter gallery items by category</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryFilter
            activeCategory={activeCategory}
            categories={categories}
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
                {galleryItems.length} of {galleryItems.length} items
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
          ) : galleryItems.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery || activeCategory !== "all"
                    ? "No items found matching your filters"
                    : "No gallery items found"}
                </p>
                {galleryItems.length === 0 && (
                  <Button className="mt-4" onClick={onCreateItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first item
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                  onMouseEnter={() => handleItemHover(item)}
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
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
                          <DropdownMenuItem onClick={() => onEditItem(item)}>
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
                            onClick={() => onDeleteItem(item)}
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
    </div>
  );
}
