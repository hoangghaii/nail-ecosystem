/**
 * Analytics Query Hooks
 *
 * TanStack Query hooks for analytics operations
 */

import type { ProfitAnalytics, ProfitQueryParams } from '@repo/types/analytics';

import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { analyticsService } from '@/services/analytics.service';
import { storage } from '@/services/storage.service';

/**
 * Query: Get profit analytics
 */
export function useProfitAnalytics(params: ProfitQueryParams) {
  return useQuery<ProfitAnalytics, Error>({
    enabled: !!storage.get('auth_token', '') && !!params.startDate && !!params.endDate,
    queryFn: () => analyticsService.getProfit(params),
    queryKey: queryKeys.analytics.profit(params),
    staleTime: 60_000, // 60s cache for aggregated data
  });
}
