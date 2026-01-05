import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Banner, BannerType } from "@/types/banner.types";

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
import { useCreateBanner, useUpdateBanner } from "@/hooks/api/useBanners";
import { cn } from "@/lib/utils";

const bannerSchema = z.object({
  active: z.boolean(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less"),
  type: z.enum(["image", "video"]),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export type BannerFormModalProps = {
  banner?: Banner;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
};

export function BannerFormModal({
  banner,
  onOpenChange,
  onSuccess,
  open,
}: BannerFormModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");

  const isEditMode = !!banner;

  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<BannerFormData>({
    defaultValues: {
      active: true,
      title: "",
      type: "image",
    },
    resolver: zodResolver(bannerSchema),
  });

  const type = watch("type");
  const active = watch("active");

  useEffect(() => {
    if (banner) {
      reset({
        active: banner.active,
        title: banner.title,
        type: banner.type,
      });
      setImagePreview(banner.imageUrl);
      setVideoPreview(banner.videoUrl || "");
    } else {
      reset({
        active: true,
        title: "",
        type: "image",
      });
      setImageFile(null);
      setVideoFile(null);
      setImagePreview("");
      setVideoPreview("");
    }
  }, [banner, reset]);

  // Cleanup form data when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        active: true,
        title: "",
        type: "image",
      });
      setImageFile(null);
      setVideoFile(null);
      setImagePreview("");
      setVideoPreview("");
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: BannerFormData) => {
    // Validate image required for create mode
    if (!isEditMode && !imageFile) {
      toast.error("Image is required");
      return;
    }

    if (isEditMode) {
      // Edit mode - use update mutation with JSON
      updateBanner.mutate(
        {
          data: {
            active: data.active,
            title: data.title,
            type: data.type,
          },
          id: banner._id,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
            reset();
            setImageFile(null);
            setVideoFile(null);
            setImagePreview("");
            setVideoPreview("");
          },
        },
      );
    } else {
      // Create mode - use create mutation with FormData
      const formData = new FormData();

      // Files
      formData.append("image", imageFile!);
      if (data.type === "video" && videoFile) {
        formData.append("video", videoFile);
      }

      // Metadata
      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("active", String(data.active));
      formData.append("sortIndex", "0");
      formData.append("isPrimary", "false");

      createBanner.mutate(formData, {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
          reset();
          setImageFile(null);
          setVideoFile(null);
          setImagePreview("");
          setVideoPreview("");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the banner information below."
              : "Fill in the details to create a new banner."}
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
                placeholder="Enter banner title..."
                className={cn(errors.title && "border-destructive")}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Banner Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Banner Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={type}
                onValueChange={(value) => setValue("type", value as BannerType)}
                disabled={isEditMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select banner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image Banner</SelectItem>
                  <SelectItem value="video">Video Banner</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-destructive">
                  {errors.type.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Choose "Image" for static image banners or "Video" for video
                background banners
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">
                Banner Image{" "}
                {!isEditMode && <span className="text-destructive">*</span>}
              </Label>
              {isEditMode && imagePreview && (
                <div className="mb-2 rounded-lg border border-border overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Current banner"
                    className="w-full h-48 object-cover"
                  />
                  <p className="text-xs text-muted-foreground p-2 bg-muted">
                    Current image. To change image/video, please delete and
                    create a new banner.
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

            {/* Video Upload */}
            {type === "video" && !isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="video">Banner Video (Optional)</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoChange}
                  className="cursor-pointer"
                />
                {videoPreview && (
                  <div className="mt-2 rounded-lg border border-border overflow-hidden">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Max 100MB, formats: MP4, WebM
                </p>
              </div>
            )}
            {type === "video" && isEditMode && videoPreview && (
              <div className="space-y-2">
                <Label>Current Video</Label>
                <div className="rounded-lg border border-border overflow-hidden">
                  <video
                    src={videoPreview}
                    className="w-full h-48 object-cover"
                    controls
                  />
                </div>
              </div>
            )}

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Show this banner on the website
                </p>
              </div>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={(checked) => setValue("active", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createBanner.isPending || updateBanner.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBanner.isPending || updateBanner.isPending}
            >
              {createBanner.isPending || updateBanner.isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Banner"
                  : "Create Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
