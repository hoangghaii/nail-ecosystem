import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/utils/api';

/**
 * Admin QueryClient Configuration
 *
 * Optimized for admin users who need:
 * - Fresh data (frequent changes)
 * - Aggressive refetching (manage business)
 * - Quick error feedback (toast notifications)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache config
      staleTime: 30_000, // 30s - admin data changes frequently
      gcTime: 5 * 60_000, // 5min - moderate cache retention

      // Retry config
      retry: 1, // Retry once on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch config
      refetchOnWindowFocus: true, // Admin users switch tabs often
      refetchOnReconnect: true, // Refresh on network recovery
      refetchOnMount: true, // Refetch when component mounts

      // Error handling
      throwOnError: false, // Handle errors in components
    },

    mutations: {
      // Retry config
      retry: 0, // Don't retry mutations (could cause duplicates)

      // Global error handler
      onError: (error) => {
        console.error('[Mutation Error]', error);

        if (ApiError.isApiError(error)) {
          // Show user-friendly error message
          toast.error(error.getUserMessage());
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  },
});
