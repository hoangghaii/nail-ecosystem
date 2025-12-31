import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { GalleryItem } from "@/types/gallery.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { galleryService } from "@/services/gallery.service";

export type DeleteGalleryDialogProps = {
  galleryItem?: GalleryItem;
  onConfirm?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteGalleryDialog({
  galleryItem,
  onConfirm,
  onOpenChange,
  open,
}: DeleteGalleryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!galleryItem) return;

    setIsDeleting(true);
    try {
      await galleryService.delete(galleryItem.id);
      toast.success("Gallery item deleted successfully!");
      onConfirm?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast.error("Failed to delete gallery item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Gallery Item</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this gallery item? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {galleryItem && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              {galleryItem.imageUrl && (
                <img
                  src={galleryItem.imageUrl}
                  alt={galleryItem.title}
                  className="h-16 w-24 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{galleryItem.title}</p>
                {galleryItem.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {galleryItem.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
