import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";
import type { PaginationResponse } from "@repo/types/pagination";

import { queryKeys } from "@repo/utils/api";
import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";

import type { GalleryItem } from "@/types";

import {
  galleryService,
  type GalleryQueryParams,
} from "@/services/gallery.service";

/**
 * Query: Get all gallery items with optional filters
 */
export function useGalleryItems(params?: GalleryQueryParams) {
  return useQuery({
    queryFn: () => galleryService.getAll(params),
    queryKey: queryKeys.gallery.list(params),
    staleTime: 30_000, // 30s cache
  });
}

/**
 * Query: Get all gallery items with infinite scroll
 */
export function useInfiniteGalleryItems(
  params: Omit<GalleryQueryParams, "page"> = {},
) {
  return useInfiniteQuery<
    PaginationResponse<GalleryItem>,
    Error,
    InfiniteData<PaginationResponse<GalleryItem>>,
    ReturnType<typeof queryKeys.gallery.list>,
    number
  >({
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      galleryService.getAllPagination({ ...params, limit: 20, page: pageParam }),
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
 * Query: Get featured gallery items
 */
export function useFeaturedGalleryItems() {
  return useQuery({
    queryFn: () => galleryService.getFeatured(),
    queryKey: queryKeys.gallery.list({ featured: true }),
    staleTime: 30_000,
  });
}

/** Query: Get all active nail shapes from API */
export function useNailShapes() {
  return useQuery<NailShapeItem[]>({
    queryFn: () => galleryService.getNailShapes(),
    queryKey: queryKeys.nailShapes.lists(),
    staleTime: 5 * 60_000, // 5 min — rarely changes
  });
}

/** Query: Get all active nail styles from API */
export function useNailStyles() {
  return useQuery<NailStyleItem[]>({
    queryFn: () => galleryService.getNailStyles(),
    queryKey: queryKeys.nailStyles.lists(),
    staleTime: 5 * 60_000,
  });
}
