import { ApiError } from '@repo/utils/api';
import { QueryClient } from '@tanstack/react-query';

/**
 * Client QueryClient Configuration
 *
 * Optimized for customers who need:
 * - Longer cache (data rarely changes)
 * - Less aggressive refetching (better UX)
 * - Customer-friendly error messages
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      // Global error handler
      onError: (error) => {
        console.error('[Mutation Error]', error);

        if (ApiError.isApiError(error)) {
          // Customer-friendly error messages
          const message = error.getUserMessage();
          // TODO: Show error in customer-appropriate UI (not toast)
          console.error(message);
        } else if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred');
        }
      },

      // Retry config
      retry: 1, // Retry booking submissions once
    },

    queries: {
      gcTime: 10 * 60_000, // 10min - longer cache for better UX
      refetchOnMount: true, // Refetch when component mounts

      refetchOnReconnect: true, // Refresh on network recovery
      // Refetch config
      refetchOnWindowFocus: false, // Less aggressive for customers

      // Retry config
      retry: 2, // More retries for public users (network issues)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Cache config
      staleTime: 5 * 60_000, // 5min - customer data rarely changes

      // Error handling
      throwOnError: false, // Handle errors in components
    },
  },
});
