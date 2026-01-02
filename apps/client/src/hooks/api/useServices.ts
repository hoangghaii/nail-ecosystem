import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@repo/utils/api';
import type { ServiceCategory } from '@repo/types/service';
import { servicesService } from '@/services/services.service';

/**
 * Query: Get all public services
 */
export function useServices() {
  return useQuery({
    queryKey: queryKeys.services.lists(),
    queryFn: () => servicesService.getAll(),
  });
}

/**
 * Query: Get service by ID
 */
export function useService(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.services.detail(id!),
    queryFn: () => servicesService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Query: Get services by category
 */
export function useServicesByCategory(category: ServiceCategory | undefined) {
  return useQuery({
    queryKey: queryKeys.services.list({ category }),
    queryFn: () => servicesService.getByCategory(category!),
    enabled: !!category,
  });
}
