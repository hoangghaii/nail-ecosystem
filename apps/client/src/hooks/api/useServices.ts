import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { servicesService, type ServicesQueryParams } from '@/services/services.service';

/**
 * Query: Get all services with optional filters
 */
export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
    staleTime: 30_000, // 30s cache
  });
}

/**
 * Query: Get service by ID
 */
export function useService(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => servicesService.getById(id!),
    queryKey: queryKeys.services.detail(id!),
  });
}
