import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { GalleryItem } from "@/types/gallery.types";

import { ImageUpload } from "@/components/layout/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { galleryService } from "@/services/gallery.service";
import { GalleryCategory } from "@/types/gallery.types";

const gallerySchema = z.object({
  category: z.enum([
    "extensions",
    "manicure",
    "nail-art",
    "pedicure",
    "seasonal",
  ]),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  duration: z
    .string()
    .max(20, "Duration must be 20 characters or less")
    .optional(),
  featured: z.boolean(),
  imageUrl: z.string().min(1, "Image is required"),
  price: z.string().max(20, "Price must be 20 characters or less").optional(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less"),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

export type GalleryFormModalProps = {
  galleryItem?: GalleryItem;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
};

export function GalleryFormModal({
  galleryItem,
  onOpenChange,
  onSuccess,
  open,
}: GalleryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!galleryItem;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<GalleryFormData>({
    defaultValues: {
      category: "manicure",
      description: "",
      duration: "",
      featured: false,
      imageUrl: "",
      price: "",
      title: "",
    },
    resolver: zodResolver(gallerySchema),
  });

  const imageUrl = watch("imageUrl");
  const category = watch("category");
  const featured = watch("featured");

  useEffect(() => {
    if (galleryItem) {
      reset({
        category: galleryItem.category as GalleryFormData["category"],
        description: galleryItem.description || "",
        duration: galleryItem.duration || "",
        featured: galleryItem.featured || false,
        imageUrl: galleryItem.imageUrl,
        price: galleryItem.price || "",
        title: galleryItem.title,
      });
    } else {
      reset({
        category: "manicure",
        description: "",
        duration: "",
        featured: false,
        imageUrl: "",
        price: "",
        title: "",
      });
    }
  }, [galleryItem, reset]);

  const onSubmit = async (data: GalleryFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await galleryService.update(galleryItem.id, {
          category: data.category,
          description: data.description || undefined,
          duration: data.duration || undefined,
          featured: data.featured,
          imageUrl: data.imageUrl,
          price: data.price || undefined,
          title: data.title,
        });
        toast.success("Gallery item updated successfully!");
      } else {
        await galleryService.create({
          category: data.category,
          description: data.description || undefined,
          duration: data.duration || undefined,
          featured: data.featured,
          imageUrl: data.imageUrl,
          price: data.price || undefined,
          title: data.title,
        });
        toast.success("Gallery item created successfully!");
      }

      onSuccess?.();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error saving gallery item:", error);
      toast.error(
        isEditMode
          ? "Failed to update gallery item. Please try again."
          : "Failed to create gallery item. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Gallery Item" : "Create New Gallery Item"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the gallery item information below."
              : "Fill in the details to create a new gallery item."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter item title..."
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setValue("category", value as GalleryFormData["category"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GalleryCategory.EXTENSIONS}>
                    Extensions
                  </SelectItem>
                  <SelectItem value={GalleryCategory.MANICURE}>
                    Manicure
                  </SelectItem>
                  <SelectItem value={GalleryCategory.NAIL_ART}>
                    Nail Art
                  </SelectItem>
                  <SelectItem value={GalleryCategory.PEDICURE}>
                    Pedicure
                  </SelectItem>
                  <SelectItem value={GalleryCategory.SEASONAL}>
                    Seasonal
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>
                Image <span className="text-destructive">*</span>
              </Label>
              <ImageUpload
                folder="gallery"
                value={imageUrl}
                onChange={(url) => setValue("imageUrl", url)}
              />
              {errors.imageUrl && (
                <p className="text-xs text-destructive">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter item description..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Optional)</Label>
                <Input
                  id="price"
                  placeholder="e.g., $45, $60-80"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 45 min, 1.5 hrs"
                  {...register("duration")}
                />
                {errors.duration && (
                  <p className="text-xs text-destructive">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured</Label>
                <p className="text-xs text-muted-foreground">
                  Highlight this item in the gallery
                </p>
              </div>
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Item"
                  : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
