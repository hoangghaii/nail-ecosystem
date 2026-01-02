import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@repo/utils/api';
import type { Service, ServiceCategory } from '@repo/types/service';
import { servicesService } from '@/services/services.service';

/**
 * Query: Get all services
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

/**
 * Mutation: Create service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Service, 'id'>) => servicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Service created successfully');
    },
  });
}

/**
 * Mutation: Update service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      servicesService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
      queryClient.setQueryData(queryKeys.services.detail(updated.id), updated);
      toast.success('Service updated successfully');
    },
  });
}

/**
 * Mutation: Delete service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Service deleted successfully');
    },
  });
}

/**
 * Mutation: Toggle service featured status (optimistic update)
 */
export function useToggleServiceFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      servicesService.toggleFeatured(id, featured),

    // Optimistic update
    onMutate: async ({ id, featured }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.services.all });

      // Snapshot previous value
      const previousServices = queryClient.getQueryData<Service[]>(
        queryKeys.services.lists()
      );

      // Optimistically update cache
      if (previousServices) {
        queryClient.setQueryData<Service[]>(
          queryKeys.services.lists(),
          previousServices.map((s) => (s.id === id ? { ...s, featured } : s))
        );
      }

      return { previousServices };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(queryKeys.services.lists(), context.previousServices);
      }
      toast.error('Failed to update service');
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
