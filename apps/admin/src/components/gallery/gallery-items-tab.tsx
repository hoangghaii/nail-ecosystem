import type { GalleryItem } from "@repo/types/gallery";
import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";

import { queryKeys } from "@repo/utils/api";
import { useDebounce } from "@repo/utils/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, MoreVertical, Plus, Search, Star, StarOff, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { FeaturedBadge } from "@/components/gallery";
import { InfiniteScrollTrigger } from "@/components/layout/shared/infinite-scroll-trigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useInfiniteGalleryItems, useToggleGalleryFeatured } from "@/hooks/api/useGallery";
import { galleryService } from "@/services/gallery.service";

export type GalleryItemsTabProps = {
  nailShapes: NailShapeItem[];
  nailStyles: NailStyleItem[];
  onCreateItem: () => void;
  onDeleteItem: (item: GalleryItem) => void;
  onEditItem: (item: GalleryItem) => void;
};

export function GalleryItemsTab({
  nailShapes,
  nailStyles,
  onCreateItem,
  onDeleteItem,
  onEditItem,
}: GalleryItemsTabProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteGalleryItems({ search: debouncedSearch || undefined });

  const galleryItems = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const toggleFeatured = useToggleGalleryFeatured();

  const handleItemHover = (item: GalleryItem) => {
    queryClient.prefetchQuery({
      queryFn: () => galleryService.getById(item._id),
      queryKey: queryKeys.gallery.detail(item._id),
      staleTime: 60_000,
    });
  };

  // Lookup label helpers
  const shapeLabel = (value?: string) =>
    nailShapes.find((s) => s.value === value)?.labelVi ?? value;
  const styleLabel = (value?: string) =>
    nailStyles.find((s) => s.value === value)?.labelVi ?? value;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lookbook Items</CardTitle>
            <CardDescription>{galleryItems.length} items</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={onCreateItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No items matching your search" : "No gallery items found"}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={onCreateItem}>
                  <Plus className="mr-2 h-4 w-4" />Create your first item
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryItems.map((item: GalleryItem) => (
              <div key={item._id}
                className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                onMouseEnter={() => handleItemHover(item)}
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img src={item.imageUrl} alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  {item.featured && <div className="absolute right-2 top-2"><FeaturedBadge /></div>}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-10 w-10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditItem(item)}>
                          <Edit className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured.mutate({ featured: !item.featured, id: item._id })}>
                          {item.featured ? <><StarOff className="mr-2 h-4 w-4" />Unfeature</> : <><Star className="mr-2 h-4 w-4" />Feature</>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteItem(item)}>
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.nailShape && <Badge variant="outline" className="text-xs">{shapeLabel(item.nailShape)}</Badge>}
                    {item.style && <Badge variant="outline" className="text-xs">{styleLabel(item.style)}</Badge>}
                  </div>
                  {(item.price || item.duration) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[item.price, item.duration].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && galleryItems.length > 0 && (
          <InfiniteScrollTrigger
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={fetchNextPage}
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>
  );
}
