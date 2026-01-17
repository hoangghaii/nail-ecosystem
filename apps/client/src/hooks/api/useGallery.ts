import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { galleryService, type GalleryQueryParams } from '@/services/gallery.service';

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
    staleTime: 30_000, // 30s cache
  });
}
