import type { GalleryItem } from "@repo/types/gallery";

import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryCategory } from "@repo/types/gallery";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  useCreateGalleryItem,
  useUpdateGalleryItem,
} from "@/hooks/api/useGallery";

const gallerySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less"),
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
  price: z.string().max(20, "Price must be 20 characters or less").optional(),
  duration: z
    .string()
    .max(20, "Duration must be 20 characters or less")
    .optional(),
  featured: z.boolean(),
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const isEditMode = !!galleryItem;

  const createGalleryItem = useCreateGalleryItem();
  const updateGalleryItem = useUpdateGalleryItem();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<GalleryFormData>({
    defaultValues: {
      title: "",
      category: "manicure",
      description: "",
      price: "",
      duration: "",
      featured: false,
    },
    resolver: zodResolver(gallerySchema),
  });

  const category = watch("category");
  const featured = watch("featured");

  useEffect(() => {
    if (galleryItem) {
      reset({
        title: galleryItem.title,
        category: galleryItem.category as GalleryFormData["category"],
        description: galleryItem.description || "",
        price: galleryItem.price || "",
        duration: galleryItem.duration || "",
        featured: galleryItem.featured || false,
      });
      setImagePreview(galleryItem.imageUrl);
    } else {
      reset({
        title: "",
        category: "manicure",
        description: "",
        price: "",
        duration: "",
        featured: false,
      });
      setImageFile(null);
      setImagePreview("");
    }
  }, [galleryItem, reset]);

  // Cleanup form data when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        title: "",
        category: "manicure",
        description: "",
        price: "",
        duration: "",
        featured: false,
      });
      setImageFile(null);
      setImagePreview("");
    }
  }, [open, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: GalleryFormData) => {
    // Validate image required for create mode
    if (!isEditMode && !imageFile) {
      toast.error("Image is required");
      return;
    }

    if (isEditMode) {
      // Edit mode - use update mutation with JSON
      updateGalleryItem.mutate(
        {
          id: galleryItem._id,
          data: {
            title: data.title,
            category: data.category,
            description: data.description || undefined,
            price: data.price || undefined,
            duration: data.duration || undefined,
            featured: data.featured,
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
            reset();
            setImageFile(null);
            setImagePreview("");
          },
        },
      );
    } else {
      // Create mode - use create mutation with FormData
      const formData = new FormData();

      // File
      formData.append("image", imageFile!);

      // Metadata
      formData.append("title", data.title);
      formData.append("category", data.category);
      if (data.description) formData.append("description", data.description);
      if (data.price) formData.append("price", data.price);
      if (data.duration) formData.append("duration", data.duration);
      formData.append("featured", String(data.featured));
      formData.append("isActive", "true");
      formData.append("sortIndex", "0");

      createGalleryItem.mutate(formData, {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
          reset();
          setImageFile(null);
          setImagePreview("");
        },
      });
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
                disabled={isEditMode}
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
              <Label htmlFor="image">
                Image {!isEditMode && <span className="text-destructive">*</span>}
              </Label>
              {isEditMode && imagePreview && (
                <div className="mb-2 rounded-lg border border-border overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Current gallery image"
                    className="w-full h-48 object-cover"
                  />
                  <p className="text-xs text-muted-foreground p-2 bg-muted">
                    Current image. To change image, please delete and create a new item.
                  </p>
                </div>
              )}
              {!isEditMode && (
                <>
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2 rounded-lg border border-border overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max 10MB, formats: JPG, PNG, WebP
                  </p>
                </>
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
              disabled={createGalleryItem.isPending || updateGalleryItem.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGalleryItem.isPending || updateGalleryItem.isPending}
            >
              {createGalleryItem.isPending || updateGalleryItem.isPending
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
