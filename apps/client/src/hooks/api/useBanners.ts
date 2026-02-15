/**
 * Banners API Hooks (Client)
 *
 * TanStack Query hooks for banner data
 */

import { queryKeys } from "@repo/utils/api";
import { useQuery } from "@tanstack/react-query";

import { bannersService } from "@/services/banners.service";

/**
 * Query: Get all active banners
 */
export function useBanners() {
  return useQuery({
    queryFn: () => bannersService.getAll(),
    queryKey: queryKeys.banners.all,
    staleTime: 5 * 60 * 1000, // 5 minutes (banners don't change often)
  });
}

/**
 * Query: Get primary banner for hero section
 */
export function usePrimaryBanner() {
  return useQuery({
    queryFn: () => bannersService.getPrimary(),
    queryKey: queryKeys.banners.primary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
