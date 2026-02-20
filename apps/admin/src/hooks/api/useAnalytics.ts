/**
 * Analytics Query Hooks
 *
 * TanStack Query hooks for analytics operations
 */

import type { ProfitAnalytics, ProfitQueryParams } from '@repo/types/analytics';

import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { analyticsService } from '@/services/analytics.service';
import { useAuthStore } from '@/store/authStore';

/**
 * Query: Get profit analytics
 */
export function useProfitAnalytics(params: ProfitQueryParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<ProfitAnalytics, Error>({
    enabled: isAuthenticated && !!params.startDate && !!params.endDate,
    queryFn: () => analyticsService.getProfit(params),
    queryKey: queryKeys.analytics.profit(params),
    staleTime: 60_000, // 60s cache for aggregated data
  });
}
