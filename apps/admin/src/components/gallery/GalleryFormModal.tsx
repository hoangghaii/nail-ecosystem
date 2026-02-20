import type { GalleryItem } from "@repo/types/gallery";
import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateGalleryItem,
  useUpdateGalleryItem,
} from "@/hooks/api/useGallery";
import { galleryFormDefaults, gallerySchema, type GalleryFormData } from "./gallery-form-schema";
import { GalleryImageField } from "./GalleryImageField";
import { GalleryNailOptionsFields } from "./GalleryNailOptionsFields";

export type GalleryFormModalProps = {
  galleryItem?: GalleryItem;
  nailShapes: NailShapeItem[];
  nailStyles: NailStyleItem[];
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
};

export function GalleryFormModal({
  galleryItem,
  nailShapes,
  nailStyles,
  onOpenChange,
  onSuccess,
  open,
}: GalleryFormModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const isEditMode = !!galleryItem;

  const createGalleryItem = useCreateGalleryItem();
  const updateGalleryItem = useUpdateGalleryItem();

  const { formState: { errors }, handleSubmit, register, reset, setValue, watch } =
    useForm<GalleryFormData>({ defaultValues: galleryFormDefaults, resolver: zodResolver(gallerySchema) });

  const featured = watch("featured");
  const nailShape = watch("nailShape");
  const nailStyle = watch("nailStyle");

  useEffect(() => {
    if (galleryItem) {
      reset({
        description: galleryItem.description || "",
        duration: galleryItem.duration || "",
        featured: galleryItem.featured || false,
        nailShape: galleryItem.nailShape || "",
        nailStyle: galleryItem.style || "",
        price: galleryItem.price || "",
        title: galleryItem.title,
      });
      setImagePreview(galleryItem.imageUrl);
    } else {
      reset(galleryFormDefaults);
      setImageFile(null);
      setImagePreview("");
    }
  }, [galleryItem, reset]);

  useEffect(() => {
    if (!open) {
      reset(galleryFormDefaults);
      setImageFile(null);
      setImagePreview("");
    }
  }, [open, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: GalleryFormData) => {
    if (!isEditMode && !imageFile) { toast.error("Image is required"); return; }
    const closeAndReset = () => { onSuccess?.(); onOpenChange(false); reset(); setImageFile(null); setImagePreview(""); };

    if (isEditMode) {
      updateGalleryItem.mutate({
        data: {
          description: data.description || undefined,
          duration: data.duration || undefined,
          featured: data.featured,
          nailShape: data.nailShape || undefined,
          price: data.price || undefined,
          style: data.nailStyle || undefined,
          title: data.title,
        },
        id: galleryItem._id,
      }, { onSuccess: closeAndReset });
    } else {
      const fd = new FormData();
      fd.append("image", imageFile!);
      fd.append("title", data.title);
      fd.append("featured", String(data.featured));
      fd.append("isActive", "true");
      fd.append("sortIndex", "0");
      if (data.description) fd.append("description", data.description);
      if (data.price) fd.append("price", data.price);
      if (data.duration) fd.append("duration", data.duration);
      if (data.nailShape) fd.append("nailShape", data.nailShape);
      if (data.nailStyle) fd.append("style", data.nailStyle);
      createGalleryItem.mutate(fd, { onSuccess: closeAndReset });
    }
  };

  const activeShapes = nailShapes.filter((s) => s.isActive);
  const activeStyles = nailStyles.filter((s) => s.isActive);
  const isPending = createGalleryItem.isPending || updateGalleryItem.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Lookbook Item" : "Create New Lookbook Item"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the lookbook item information below." : "Fill in the details to create a new lookbook item."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input id="title" placeholder="Enter item title..." {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <GalleryImageField isEditMode={isEditMode} imagePreview={imagePreview} onFileChange={handleImageChange} />

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" placeholder="Enter item description..." rows={3} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (Optional)</Label>
              <Input placeholder="e.g., $45" {...register("price")} />
            </div>
            <div className="space-y-2">
              <Label>Duration (Optional)</Label>
              <Input placeholder="e.g., 45 min" {...register("duration")} />
            </div>
          </div>

          <GalleryNailOptionsFields
            nailShape={nailShape}
            nailStyle={nailStyle}
            shapes={activeShapes}
            styles={activeStyles}
            onShapeChange={(v) => setValue("nailShape", v)}
            onStyleChange={(v) => setValue("nailStyle", v)}
          />

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Featured</Label>
              <p className="text-xs text-muted-foreground">Highlight this item in the gallery</p>
            </div>
            <Switch id="featured" checked={featured} onCheckedChange={(v) => setValue("featured", v)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Item" : "Create Item")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
