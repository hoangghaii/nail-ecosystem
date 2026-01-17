/**
 * Business Info Query Hook
 *
 * Fetches business information (phone, email, address, hours) from API
 */

import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { businessInfoService } from '@/services/business-info.service';

/**
 * Query: Get business information
 *
 * Caching strategy:
 * - 1 hour stale time (business info rarely changes)
 * - 24 hour garbage collection
 * - 3 retries with exponential backoff
 */
export function useBusinessInfo() {
  return useQuery({
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    queryFn: () => businessInfoService.get(),
    queryKey: queryKeys.businessInfo.detail(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
