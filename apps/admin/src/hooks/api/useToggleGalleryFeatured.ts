import type { GalleryItem } from "@repo/types/gallery";

import { queryKeys } from "@repo/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { galleryService } from "@/services/gallery.service";

/** Mutation: Toggle gallery item featured status with optimistic update */
export function useToggleGalleryFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ featured, id }: { featured: boolean; id: string }) =>
      galleryService.update(id, { featured }),

    onError: (
      _err,
      _variables,
      context: { previousItems?: GalleryItem[] } | undefined,
    ) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.gallery.lists(), context.previousItems);
      }
      toast.error("Failed to update gallery item");
    },

    onMutate: async ({ featured, id }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.gallery.all });
      const previousItems = queryClient.getQueryData<GalleryItem[]>(queryKeys.gallery.lists());
      if (previousItems) {
        queryClient.setQueryData<GalleryItem[]>(
          queryKeys.gallery.lists(),
          previousItems.map((item) => item._id === id ? { ...item, featured } : item),
        );
      }
      return { previousItems };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
