import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Banner } from "@/types/banner.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bannersService } from "@/services/banners.service";

export type DeleteBannerDialogProps = {
  banner?: Banner;
  onConfirm?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteBannerDialog({
  banner,
  onConfirm,
  onOpenChange,
  open,
}: DeleteBannerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!banner) return;

    setIsDeleting(true);
    try {
      await bannersService.delete(banner.id);
      toast.success("Banner deleted successfully!");
      onConfirm?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner. Please try again.");
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
            <DialogTitle>Delete Banner</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {banner && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              {banner.imageUrl && (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-16 w-24 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{banner.title}</p>
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
            {isDeleting ? "Deleting..." : "Delete Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
