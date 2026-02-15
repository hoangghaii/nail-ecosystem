/**
 * Analytics Service
 *
 * Handles analytics and reporting operations
 */

import type { ProfitAnalytics, ProfitQueryParams } from '@repo/types/analytics';

import { apiClient } from '@/lib/apiClient';

export class AnalyticsService {
  async getProfit(params: ProfitQueryParams): Promise<ProfitAnalytics> {
    const queryString = this.buildQueryString(params);
    return apiClient.get<ProfitAnalytics>(`/analytics/profit${queryString}`);
  }

  /**
   * Builds query string from params
   * @private
   */
  private buildQueryString(params: ProfitQueryParams): string {
    const searchParams = new URLSearchParams();

    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.groupBy) searchParams.append('groupBy', params.groupBy);

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}

export const analyticsService = new AnalyticsService();
