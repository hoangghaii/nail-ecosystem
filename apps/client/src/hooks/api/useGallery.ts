import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { galleryService } from '@/services/gallery.service';

/**
 * Query: Get all public gallery items
 */
export function useGalleryItems() {
  return useQuery({
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
 * Query: Get featured gallery items
 */
export function useFeaturedGalleryItems() {
  return useQuery({
    queryFn: () => galleryService.getFeatured(),
    queryKey: queryKeys.gallery.list({ featured: true }),
  });
}
