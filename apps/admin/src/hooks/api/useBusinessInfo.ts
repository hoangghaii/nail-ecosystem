import type { BusinessInfo } from "@repo/types/business-info";

import { queryKeys } from "@repo/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { businessInfoService } from "@/services/businessInfo.service";
import { storage } from "@/services/storage.service";

/**
 * Query: Get business info (singleton)
 */
export function useBusinessInfo() {
  return useQuery({
    // Don't run query if no auth token (prevents 401 errors on mount)
    enabled: !!storage.get("auth_token", ""),
    queryFn: () => businessInfoService.get(),
    queryKey: queryKeys.businessInfo.detail(),
  });
}

/**
 * Mutation: Update business info
 */
export function useUpdateBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<BusinessInfo, "_id" | "createdAt" | "updatedAt">>) =>
      businessInfoService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.businessInfo.detail(), updated);
      toast.success("Business information updated successfully");
    },
  });
}
