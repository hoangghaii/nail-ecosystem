import type { ServiceCategory } from '@repo/types/service';

import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { servicesService } from '@/services/services.service';

/**
 * Query: Get all public services
 */
export function useServices() {
  return useQuery({
    queryFn: () => servicesService.getAll(),
    queryKey: queryKeys.services.lists(),
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

/**
 * Query: Get services by category
 */
export function useServicesByCategory(category: ServiceCategory | undefined) {
  return useQuery({
    enabled: !!category,
    queryFn: () => servicesService.getByCategory(category!),
    queryKey: queryKeys.services.list({ category }),
  });
}
