import { ApiError } from "@repo/utils/api";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { storage } from "@/services/storage.service";

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
    mutations: {
      // Global error handler
      onError: (error) => {
        console.error("[Mutation Error]", error);

        if (ApiError.isApiError(error)) {
          // Handle 401 Unauthorized - redirect to login
          if (error.statusCode === 401) {
            toast.error("Session expired. Please login again.");
            // Clear auth data
            storage.remove("auth_token");
            storage.remove("refresh_token");
            storage.remove("auth_user");
            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
            return;
          }

          // Show user-friendly error message
          toast.error(error.getUserMessage());
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      },

      // Retry config
      retry: 0, // Don't retry mutations (could cause duplicates)
    },

    queries: {
      gcTime: 5 * 60_000, // 5min - moderate cache retention
      refetchOnMount: true, // Refetch when component mounts

      refetchOnReconnect: true, // Refresh on network recovery
      // Refetch config
      refetchOnWindowFocus: true, // Admin users switch tabs often

      // Retry config
      retry: (failureCount, error) => {
        // Don't retry on 401 Unauthorized
        if (ApiError.isApiError(error) && error.statusCode === 401) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Cache config
      staleTime: 30_000, // 30s - admin data changes frequently

      // Error handling
      throwOnError: false, // Handle errors in components
    },
  },
});
