import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@repo/utils/api';
import type { GalleryItem } from '@repo/types/gallery';
import { galleryService } from '@/services/gallery.service';

/**
 * Query: Get all gallery items
 */
export function useGalleryItems() {
  return useQuery({
    queryKey: queryKeys.gallery.lists(),
    queryFn: () => galleryService.getAll(),
  });
}

/**
 * Query: Get gallery item by ID
 */
export function useGalleryItem(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.gallery.detail(id!),
    queryFn: () => galleryService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Mutation: Create gallery item
 */
export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<GalleryItem, 'id' | 'createdAt'>) =>
      galleryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      toast.success('Gallery item created successfully');
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
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<GalleryItem, 'id' | 'createdAt'>>;
    }) => galleryService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.lists() });
      queryClient.setQueryData(queryKeys.gallery.detail(updated.id), updated);
      toast.success('Gallery item updated successfully');
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
      toast.success('Gallery item deleted successfully');
    },
  });
}

/**
 * Mutation: Toggle gallery item featured status (optimistic update)
 */
export function useToggleGalleryFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      galleryService.update(id, { featured }),

    // Optimistic update
    onMutate: async ({ id, featured }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.gallery.all });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<GalleryItem[]>(
        queryKeys.gallery.lists()
      );

      // Optimistically update cache
      if (previousItems) {
        queryClient.setQueryData<GalleryItem[]>(
          queryKeys.gallery.lists(),
          previousItems.map((item) => (item.id === id ? { ...item, featured } : item))
        );
      }

      return { previousItems };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.gallery.lists(), context.previousItems);
      }
      toast.error('Failed to update gallery item');
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
