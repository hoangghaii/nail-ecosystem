import { AlertTriangle } from "lucide-react";
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
import { useDeleteBanner } from "@/hooks/api/useBanners";

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
  const deleteBanner = useDeleteBanner();

  const handleDelete = () => {
    if (!banner) return;

    deleteBanner.mutate(banner._id, {
      onError: () => {
        toast.error("Failed to delete banner. Please try again.");
      },
      onSuccess: () => {
        onConfirm?.();
        onOpenChange(false);
      },
    });
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
            disabled={deleteBanner.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBanner.isPending}
          >
            {deleteBanner.isPending ? "Deleting..." : "Delete Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
