import type { GalleryCategoryItem } from "@repo/types/gallery-category";

import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

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
import { Switch } from "@/components/ui/switch";
import { useToggleCategoryActive } from "@/hooks/api/useGalleryCategory";

export type GalleryCategoriesTabProps = {
  categories: GalleryCategoryItem[];
  onCreateCategory: () => void;
  onDeleteCategory: (category: GalleryCategoryItem) => void;
  onEditCategory: (category: GalleryCategoryItem) => void;
};

export function GalleryCategoriesTab({
  categories,
  onCreateCategory,
  onDeleteCategory,
  onEditCategory,
}: GalleryCategoriesTabProps) {
  const toggleCategoryActive = useToggleCategoryActive();

  const sortedCategories = useMemo(
    () => categories.sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  return (
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
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No categories found</p>
              <Button onClick={onCreateCategory} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create First Category
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedCategories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50"
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

                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={(checked) =>
                        toggleCategoryActive.mutate({
                          id: category._id,
                          isActive: checked,
                        })
                      }
                      disabled={toggleCategoryActive.isPending}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEditCategory(category)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeleteCategory(category)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
