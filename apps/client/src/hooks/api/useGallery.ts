import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@repo/utils/api';
import { galleryService } from '@/services/gallery.service';

/**
 * Query: Get all public gallery items
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
 * Query: Get featured gallery items
 */
export function useFeaturedGalleryItems() {
  return useQuery({
    queryKey: queryKeys.gallery.list({ featured: true }),
    queryFn: () => galleryService.getFeatured(),
  });
}
