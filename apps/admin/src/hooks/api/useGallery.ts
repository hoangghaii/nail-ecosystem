import type { GalleryItem } from "@repo/types/gallery";
import type { PaginationResponse } from "@repo/types/pagination";
import type { ApiError } from "@repo/utils/api";

import { queryKeys } from "@repo/utils/api";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  galleryService,
  type GalleriesQueryParams,
} from "@/services/gallery.service";
import { storage } from "@/services/storage.service";

type UseGalleriesOptions = GalleriesQueryParams &
  Omit<
    UseQueryOptions<PaginationResponse<GalleryItem>, ApiError>,
    "queryKey" | "queryFn"
  >;

/**
 * Query: Get all gallery items
 */
export function useGalleryItems(options?: UseGalleriesOptions) {
  const {
    featured,
    isActive,
    limit,
    nailShape,
    nailStyle,
    page,
    search,
    ...queryOptions
  } = options || {};

  const filters: GalleriesQueryParams | undefined =
    featured || isActive || search || page || limit || nailShape || nailStyle
      ? { featured, isActive, limit, nailShape, nailStyle, page, search }
      : undefined;

  return useQuery({
    enabled: queryOptions.enabled !== false && !!storage.get("auth_token", ""),
    // @ts-expect-error - keepPreviousData exists in v4
    keepPreviousData: true, // Show old data while fetching new (smooth UX)
    queryFn: () => galleryService.getAll(filters),
    queryKey: queryKeys.gallery.list(filters),
    staleTime: 30_000, // Consider data fresh for 30s
    ...queryOptions,
  });
}

/**
 * Query: Get all gallery items with infinite scroll
 */
export function useInfiniteGalleryItems(
  params: Omit<GalleriesQueryParams, "page"> = {},
) {
  return useInfiniteQuery<
    PaginationResponse<GalleryItem>,
    Error,
    InfiniteData<PaginationResponse<GalleryItem>>,
    ReturnType<typeof queryKeys.gallery.list>,
    number
  >({
    enabled: !!storage.get("auth_token", ""),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      galleryService.getAll({ ...params, limit: 20, page: pageParam }),
    queryKey: queryKeys.gallery.list(params),
    staleTime: 30_000,
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

export { useToggleGalleryFeatured } from "./useToggleGalleryFeatured";
