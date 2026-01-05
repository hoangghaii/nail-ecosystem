import type { GalleryItem } from "@repo/types/gallery";

import { queryKeys } from "@repo/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { galleryService } from "@/services/gallery.service";
import { storage } from "@/services/storage.service";

/**
 * Query: Get all gallery items
 */
export function useGalleryItems() {
  return useQuery({
    // Don't run query if no auth token (prevents 401 errors on mount)
    enabled: !!storage.get("auth_token", ""),
    queryFn: () => galleryService.getAll(),
    queryKey: queryKeys.gallery.lists(),
  });
}

/**
 * Query: Get gallery item by ID
 */
export function useGalleryItem(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => galleryService.getById(id!),
    queryKey: queryKeys.gallery.detail(id!),
  });
}

/**
 * Mutation: Create gallery item
 */
export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => galleryService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      toast.success("Gallery item created successfully");
    },
  });
}

/**
 * Mutation: Update gallery item
 */
export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: Partial<Omit<GalleryItem, "id" | "createdAt">>;
      id: string;
    }) => galleryService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.lists() });
      queryClient.setQueryData(queryKeys.gallery.detail(updated._id), updated);
      toast.success("Gallery item updated successfully");
    },
  });
}

/**
 * Mutation: Delete gallery item
 */
export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => galleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      toast.success("Gallery item deleted successfully");
    },
  });
}

/**
 * Mutation: Toggle gallery item featured status (optimistic update)
 */
export function useToggleGalleryFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ featured, id }: { featured: boolean; id: string }) =>
      galleryService.update(id, { featured }),

    // Rollback on error
    onError: (
      _err,
      _variables,
      context: { previousItems?: GalleryItem[] } | undefined,
    ) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          queryKeys.gallery.lists(),
          context.previousItems,
        );
      }
      toast.error("Failed to update gallery item");
    },

    // Optimistic update
    onMutate: async ({ featured, id }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.gallery.all });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<GalleryItem[]>(
        queryKeys.gallery.lists(),
      );

      // Optimistically update cache
      if (previousItems) {
        queryClient.setQueryData<GalleryItem[]>(
          queryKeys.gallery.lists(),
          previousItems.map((item) =>
            item._id === id ? { ...item, featured } : item,
          ),
        );
      }

      return { previousItems };
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
