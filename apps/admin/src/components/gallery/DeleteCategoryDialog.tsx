/**
 * Delete Category Dialog
 *
 * Confirmation dialog for deleting gallery categories
 */

import { AlertTriangle } from "lucide-react";

import type { GalleryCategoryItem } from "@repo/types/gallery-category";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteGalleryCategory } from "@/hooks/api/useGalleryCategory";

export type DeleteCategoryDialogProps = {
  category?: GalleryCategoryItem;
  onConfirm?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteCategoryDialog({
  category,
  onConfirm,
  onOpenChange,
  open,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteGalleryCategory();

  const handleDelete = () => {
    if (!category) return;

    deleteCategory.mutate(category._id, {
      onSuccess: () => {
        onConfirm?.();
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Category
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>

            {category && (
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="font-medium">{category.name}</p>
                {category.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Slug: <span className="font-mono">{category.slug}</span>
                </p>
              </div>
            )}

            <div className="rounded-lg border-l-4 border-destructive bg-destructive/10 p-3">
              <p className="text-sm font-medium text-destructive">
                ⚠️ Warning
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                If this category is assigned to any gallery items, deletion will
                fail. Make sure to reassign items to another category first.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
          >
            {deleteCategory.isPending ? "Deleting..." : "Delete Category"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
