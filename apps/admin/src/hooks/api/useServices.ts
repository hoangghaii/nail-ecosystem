import type { PaginationResponse } from "@repo/types/pagination";
import type { Service, ServiceCategory } from "@repo/types/service";

import { queryKeys } from "@repo/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { GetServicesParams } from "@/services/services.service";

import { servicesService } from "@/services/services.service";
import { storage } from "@/services/storage.service";

/**
 * Query: Get all services (paginated)
 */
export function useServices(params: GetServicesParams = {}) {
  return useQuery({
    // Don't run query if no auth token (prevents 401 errors on mount)
    enabled: !!storage.get("auth_token", ""),
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
  });
}

/**
 * Query: Get all services with infinite scroll
 */
export function useInfiniteServices(
  params: Omit<GetServicesParams, "page"> = {},
) {
  return useInfiniteQuery<PaginationResponse<Service>, Error, PaginationResponse<Service>, ReturnType<typeof queryKeys.services.list>, number>({
    enabled: !!storage.get("auth_token", ""),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      servicesService.getAll({ ...params, page: pageParam }),
    queryKey: queryKeys.services.list(params),
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

/**
 * Mutation: Create service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => servicesService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service created successfully");
    },
  });
}

/**
 * Mutation: Update service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: Partial<Service>; id: string }) =>
      servicesService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
      queryClient.setQueryData(queryKeys.services.detail(updated._id), updated);
      toast.success("Service updated successfully");
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
      toast.success("Service deleted successfully");
    },
  });
}

/**
 * Mutation: Toggle service featured status (optimistic update)
 */
export function useToggleServiceFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ featured, id }: { featured: boolean; id: string }) =>
      servicesService.toggleFeatured(id, featured),

    // Rollback on error
    onError: (
      _err,
      _variables,
      context: { previousServices?: Service[] } | undefined,
    ) => {
      if (context?.previousServices) {
        queryClient.setQueryData(
          queryKeys.services.lists(),
          context.previousServices,
        );
      }
      toast.error("Failed to update service");
    },

    // Optimistic update
    onMutate: async ({ featured, id }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.services.all });

      // Snapshot previous value
      const previousServices = queryClient.getQueryData<Service[]>(
        queryKeys.services.lists(),
      );

      // Optimistically update cache
      if (previousServices) {
        queryClient.setQueryData<Service[]>(
          queryKeys.services.lists(),
          previousServices.map((s) => (s._id === id ? { ...s, featured } : s)),
        );
      }

      return { previousServices };
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
