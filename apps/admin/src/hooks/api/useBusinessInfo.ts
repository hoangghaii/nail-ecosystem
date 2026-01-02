import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@repo/utils/api';
import type { BusinessInfo } from '@/types/businessInfo.types';
import { businessInfoService } from '@/services/businessInfo.service';

/**
 * Query: Get business info (singleton)
 */
export function useBusinessInfo() {
  return useQuery({
    queryKey: queryKeys.businessInfo.detail(),
    queryFn: () => businessInfoService.get(),
  });
}

/**
 * Mutation: Update business info
 */
export function useUpdateBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<BusinessInfo, 'id'>>) =>
      businessInfoService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.businessInfo.detail(), updated);
      toast.success('Business information updated successfully');
    },
  });
}
