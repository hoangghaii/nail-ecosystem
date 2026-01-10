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
  itemCounts,
  onCategoryChange,
}: CategoryFilterProps) {
  // Add "All" filter at the beginning
  const allCategories = [
    { _id: "all", isActive: true, name: "All", slug: "all", sortIndex: 0 },
    ...categories.filter((c) => c.isActive).sort((a, b) => a.name.localeCompare(b.name)),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const isActive = activeCategory === category.slug;
        const count = itemCounts?.[category.slug];

        return (
          <Button
            key={category._id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.slug)}
            className="gap-2"
          >
            {category.name}
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
