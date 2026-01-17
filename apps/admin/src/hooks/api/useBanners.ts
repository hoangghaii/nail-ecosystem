import type { PaginationResponse } from "@repo/types/pagination";
import type { ApiError } from "@repo/utils/api";

import { queryKeys } from "@repo/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { Banner } from "@/types/banner.types";

import {
  bannersService,
  type BannersQueryParams,
} from "@/services/banners.service";
import { storage } from "@/services/storage.service";

type UseBannersOptions = BannersQueryParams &
  Omit<
    UseQueryOptions<PaginationResponse<Banner>, ApiError>,
    "queryKey" | "queryFn"
  >;

/**
 * Query: Get all banners
 */
export function useBanners(options?: UseBannersOptions) {
  const { active, isPrimary, limit, page, type, ...queryOptions } =
    options || {};

  // Build filter object for queryKey and service call
  const filters: BannersQueryParams | undefined =
    active || isPrimary || type || page || limit
      ? { active, isPrimary, limit, page, type }
      : undefined;

  return useQuery({
    // Don't run query if no auth token (prevents 401 errors on mount)
    enabled: queryOptions?.enabled !== false && !!storage.get("auth_token", ""),
    // @ts-expect-error - keepPreviousData exists in v4
    keepPreviousData: true,
    queryFn: () => bannersService.getAll(filters),
    queryKey: queryKeys.banners.list(filters),
    staleTime: 30_000,
    ...queryOptions,
  });
}

/**
 * Query: Get banner by ID
 */
export function useBanner(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => bannersService.getById(id!),
    queryKey: queryKeys.banners.detail(id!),
  });
}

/**
 * Mutation: Create banner
 */
export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => bannersService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      toast.success("Banner created successfully");
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
      data,
      id,
    }: {
      data: Partial<Omit<Banner, "id" | "createdAt">>;
      id: string;
    }) => bannersService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.lists() });
      queryClient.setQueryData(queryKeys.banners.detail(updated._id), updated);
      toast.success("Banner updated successfully");
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
      toast.success("Banner deleted successfully");
    },
  });
}

/**
 * Mutation: Toggle banner active status (optimistic update)
 */
export function useToggleBannerActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ active, id }: { active: boolean; id: string }) =>
      bannersService.update(id, { active }),

    onError: (
      _err,
      _variables,
      context: { previousBanners?: PaginationResponse<Banner> } | undefined,
    ) => {
      if (context?.previousBanners) {
        queryClient.setQueryData(
          queryKeys.banners.lists(),
          context.previousBanners,
        );
      }
      toast.error("Failed to update banner");
    },

    // Optimistic update
    onMutate: async ({ active, id }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.banners.all });

      const previousData = queryClient.getQueryData<PaginationResponse<Banner>>(
        queryKeys.banners.lists(),
      );

      if (previousData?.data) {
        queryClient.setQueryData<PaginationResponse<Banner>>(
          queryKeys.banners.lists(),
          {
            ...previousData,
            data: previousData.data.map((banner) =>
              banner._id === id ? { ...banner, active } : banner,
            ),
          },
        );
      }

      return { previousBanners: previousData };
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
      toast.success("Primary banner updated successfully");
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
      toast.success("Banners reordered successfully");
    },
  });
}
