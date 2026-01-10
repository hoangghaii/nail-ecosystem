/**
 * Category Form Modal
 *
 * Modal for creating and editing gallery categories
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { GalleryCategoryItem } from "@repo/types/gallery-category";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateGalleryCategory,
  useUpdateGalleryCategory,
} from "@/hooks/api/useGalleryCategory";

// Form schema
const categorySchema = z.object({
  description: z.string().optional(),
  isActive: z.boolean(),
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export type CategoryFormModalProps = {
  category?: GalleryCategoryItem;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
};

export function CategoryFormModal({
  category,
  onOpenChange,
  onSuccess,
  open,
}: CategoryFormModalProps) {
  const isEditMode = !!category;
  const createCategory = useCreateGalleryCategory();
  const updateCategory = useUpdateGalleryCategory();

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      description: "",
      isActive: true,
      name: "",
    },
    resolver: zodResolver(categorySchema),
  });

  // Preset form in edit mode
  useEffect(() => {
    if (category && open) {
      form.reset({
        description: category.description || "",
        isActive: category.isActive,
        name: category.name,
      });
    } else if (!open) {
      form.reset();
    }
  }, [category, open, form]);

  // Auto-generate slug preview
  const slugPreview = useMemo(() => {
    const name = form.watch("name");
    if (!name) return "";
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [form.watch("name")]);

  const onSubmit = (data: CategoryFormValues) => {
    if (isEditMode) {
      updateCategory.mutate(
        { data, id: category._id },
        {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
          },
        },
      );
    } else {
      createCategory.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update category details below"
              : "Add a new gallery category"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nail Art" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug Preview (read-only) */}
            {!isEditMode && slugPreview && (
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  URL Slug (auto-generated)
                </p>
                <p className="mt-1 font-mono text-sm">{slugPreview}</p>
              </div>
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Creative nail designs and artwork..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Toggle */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Inactive categories are hidden from users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
