import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { galleryService } from "@/services/gallery.service";
import { servicesService } from "@/services/services.service";

/**
 * HomePage hook with prefetching optimization
 *
 * Prefetches services and gallery data on desktop (>= 768px)
 * to make navigation to /services and /gallery instant
 */
export function useHomePage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only prefetch on desktop (save mobile bandwidth)
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      // Prefetch services for /services page
      queryClient.prefetchQuery({
        queryFn: () => servicesService.getAll({ isActive: true }),
        queryKey: ["services", { isActive: true }],
      });

      // Prefetch gallery for /gallery page
      queryClient.prefetchQuery({
        queryFn: () => galleryService.getAll({ isActive: true, limit: 12 }),
        queryKey: ["gallery", { isActive: true, limit: 12 }],
      });
    }
  }, [queryClient]);

  return {};
}
