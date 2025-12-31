import type { GalleryCategory as GalleryCategoryType } from "@/types/gallery.types";

import { Button } from "@/components/ui/button";
import { GalleryCategory } from "@/types/gallery.types";

export type CategoryFilterProps = {
  activeCategory: GalleryCategoryType;
  itemCounts?: Record<GalleryCategoryType, number>;
  onCategoryChange: (category: GalleryCategoryType) => void;
};

const CATEGORY_LABELS: Record<GalleryCategoryType, string> = {
  [GalleryCategory.ALL]: "All",
  [GalleryCategory.EXTENSIONS]: "Extensions",
  [GalleryCategory.MANICURE]: "Manicure",
  [GalleryCategory.NAIL_ART]: "Nail Art",
  [GalleryCategory.PEDICURE]: "Pedicure",
  [GalleryCategory.SEASONAL]: "Seasonal",
};

export function CategoryFilter({
  activeCategory,
  itemCounts,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = Object.values(GalleryCategory) as GalleryCategoryType[];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const count = itemCounts?.[category];

        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="gap-2"
          >
            {CATEGORY_LABELS[category]}
            {count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
