/**
 * React Query hooks for gallery categories
 *
 * Provides hooks for CRUD operations with optimistic updates
 */

import type {
  CreateGalleryCategoryDto,
  GalleryCategoryItem,
  UpdateGalleryCategoryDto,
} from "@repo/types/gallery-category";
import type { PaginationResponse } from "@repo/types/pagination";

import { queryKeys } from "@repo/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/types/api";

import { galleryCategoryService } from "@/services/galleryCategory.service";
import { storage } from "@/services/storage.service";

// Query hook - Fetch all categories
export function useGalleryCategories() {
  return useQuery({
    enabled: !!storage.get("auth_token", ""),
    queryFn: () => galleryCategoryService.getAll(),
    queryKey: queryKeys.galleryCategories.lists(),
  });
}

// Create mutation
export function useCreateGalleryCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGalleryCategoryDto) =>
      galleryCategoryService.create(data),
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to create category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.galleryCategories.all,
      });
      toast.success("Category created successfully");
    },
  });
}

// Update mutation
export function useUpdateGalleryCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: UpdateGalleryCategoryDto;
      id: string;
    }) => galleryCategoryService.update(id, data),
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update category");
    },
    onSuccess: (updatedCategory) => {
      // Optimistically update the cache
      queryClient.setQueryData<PaginationResponse<GalleryCategoryItem>>(
        queryKeys.galleryCategories.lists(),
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((cat) =>
              cat._id === updatedCategory._id ? updatedCategory : cat,
            ),
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.galleryCategories.all,
      });
      toast.success("Category updated successfully");
    },
  });
}

// Delete mutation
export function useDeleteGalleryCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => galleryCategoryService.delete(id),
    onError: (error: ApiError) => {
      const message = error.message || "Failed to delete category";
      // Show specific error if category is in use
      if (message.includes("protection") || message.includes("in use")) {
        toast.error("Cannot delete category: It has associated gallery items");
      } else {
        toast.error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.galleryCategories.all,
      });
      toast.success("Category deleted successfully");
    },
  });
}

// Toggle active mutation with optimistic update
export function useToggleCategoryActive() {
  const queryClient = useQueryClient();

  return useMutation<
    GalleryCategoryItem,
    ApiError,
    { id: string; isActive: boolean },
    { previousCategories: PaginationResponse<GalleryCategoryItem> | undefined }
  >({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      galleryCategoryService.update(id, { isActive }),

    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(
          queryKeys.galleryCategories.lists(),
          context.previousCategories,
        );
      }
      toast.error("Failed to update category status");
    },

    // Optimistic update
    onMutate: async ({ id, isActive }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.galleryCategories.all,
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<
        PaginationResponse<GalleryCategoryItem>
      >(queryKeys.galleryCategories.lists());

      // Optimistically update to the new value
      if (previousData?.data) {
        queryClient.setQueryData<PaginationResponse<GalleryCategoryItem>>(
          queryKeys.galleryCategories.lists(),
          {
            ...previousData,
            data: previousData.data.map((cat) =>
              cat._id === id ? { ...cat, isActive } : cat,
            ),
          },
        );
      }

      // Return context with snapshot value
      return { previousCategories: previousData };
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.galleryCategories.all,
      });
    },
  });
}
