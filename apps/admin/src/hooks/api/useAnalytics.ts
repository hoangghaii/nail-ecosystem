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
    queryKey: queryKeys.analytics.profit(params),
    queryFn: () => analyticsService.getProfit(params),
    enabled: !!storage.get('auth_token', '') && !!params.startDate && !!params.endDate,
    staleTime: 60_000, // 60s cache for aggregated data
  });
}
