import { ApiError } from "@repo/utils/api";
import { QueryClient } from "@tanstack/react-query";

/**
 * Detect if user is on mobile device
 * Mobile gets longer cache times and more retries (spotty networks)
 */
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

/**
 * Client QueryClient Configuration
 *
 * Optimized for customers who need:
 * - Longer cache (data rarely changes)
 * - Less aggressive refetching (better UX)
 * - Customer-friendly error messages
 * - Mobile-specific optimizations (longer cache, more retries)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      // Global error handler
      onError: (error) => {
        // Log errors in development only
        if (import.meta.env.DEV) {
          console.error("[Mutation Error]", error);

          if (ApiError.isApiError(error)) {
            const message = error.getUserMessage();
            console.error(message);
          } else if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("An unexpected error occurred");
          }
        }
      },

      // Retry config
      retry: 1, // Retry booking submissions once
    },

    queries: {
      gcTime: isMobile ? 20 * 60_000 : 10 * 60_000, // 20min mobile, 10min desktop
      // Refetch config
      refetchOnMount: true, // Refetch when component mounts

      refetchOnReconnect: true, // Refresh on network recovery
      refetchOnWindowFocus: false, // No flashing on tab switch
      // Retry config - smart retry with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (
          ApiError.isApiError(error) &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          return false;
        }
        // Mobile gets more retries (spotty networks)
        const maxRetries = isMobile ? 3 : 2;
        return failureCount < maxRetries;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Cache config - mobile gets longer cache (bandwidth saving)
      staleTime: isMobile ? 10 * 60_000 : 5 * 60_000, // 10min mobile, 5min desktop

      // Error handling
      throwOnError: false, // Handle errors in components
    },
  },
});
