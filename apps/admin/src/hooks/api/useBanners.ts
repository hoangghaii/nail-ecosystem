import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@repo/utils/api';
import type { Banner } from '@/types/banner.types';
import { bannersService } from '@/services/banners.service';
import type { ApiError } from '@repo/utils/api';

/**
 * Query: Get all banners
 */
export function useBanners(options?: Omit<UseQueryOptions<Banner[], ApiError>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.banners.lists(),
    queryFn: () => bannersService.getAll(),
    ...options,
  });
}

/**
 * Query: Get banner by ID
 */
export function useBanner(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.banners.detail(id!),
    queryFn: () => bannersService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Mutation: Create banner
 */
export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) =>
      bannersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      toast.success('Banner created successfully');
    },
  });
}

/**
 * Mutation: Update banner
 */
export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Banner, 'id' | 'createdAt'>>;
    }) => bannersService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.lists() });
      queryClient.setQueryData(queryKeys.banners.detail(updated.id), updated);
      toast.success('Banner updated successfully');
    },
  });
}

/**
 * Mutation: Delete banner
 */
export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      toast.success('Banner deleted successfully');
    },
  });
}

/**
 * Mutation: Toggle banner active status (optimistic update)
 */
export function useToggleBannerActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      bannersService.update(id, { active }),

    // Optimistic update
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.banners.all });

      const previousBanners = queryClient.getQueryData<Banner[]>(
        queryKeys.banners.lists()
      );

      if (previousBanners) {
        queryClient.setQueryData<Banner[]>(
          queryKeys.banners.lists(),
          previousBanners.map((banner) =>
            banner.id === id ? { ...banner, active } : banner
          )
        );
      }

      return { previousBanners };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousBanners) {
        queryClient.setQueryData(queryKeys.banners.lists(), context.previousBanners);
      }
      toast.error('Failed to update banner');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
    },
  });
}

/**
 * Mutation: Set banner as primary
 */
export function useSetPrimaryBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannersService.setPrimary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      toast.success('Primary banner updated successfully');
    },
  });
}

/**
 * Mutation: Reorder banners
 */
export function useReorderBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bannerIds: string[]) => bannersService.reorder(bannerIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      toast.success('Banners reordered successfully');
    },
  });
}
