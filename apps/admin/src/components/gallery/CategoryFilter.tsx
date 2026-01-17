import type { GalleryCategoryItem } from "@repo/types/gallery-category";

import { Button } from "@/components/ui/button";

export type CategoryFilterProps = {
  activeCategory: string;
  categories: GalleryCategoryItem[];
  itemCounts?: Record<string, number>;
  onCategoryChange: (category: string) => void;
};

export function CategoryFilter({
  activeCategory,
  categories,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = activeCategory === category._id;

        return (
          <Button
            key={category._id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category._id)}
            className="gap-2"
          >
            {category.name}
          </Button>
        );
      })}
    </div>
  );
}
