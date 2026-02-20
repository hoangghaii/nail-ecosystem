import { queryKeys } from "@repo/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { HeroSettings } from "@/types/heroSettings.types";

import { heroSettingsService } from "@/services/heroSettings.service";
import { useAuthStore } from "@/store/authStore";

/**
 * Query: Get hero settings (singleton)
 */
export function useHeroSettings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    enabled: isAuthenticated,
    queryFn: () => heroSettingsService.getSettings(),
    queryKey: queryKeys.heroSettings.detail(),
  });
}

/**
 * Mutation: Update hero settings
 */
export function useUpdateHeroSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<HeroSettings, "updatedAt">>) =>
      heroSettingsService.updateSettings(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.heroSettings.detail(), updated);
      toast.success("Hero settings updated successfully");
    },
  });
}

/**
 * Mutation: Reset hero settings to defaults
 */
export function useResetHeroSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => heroSettingsService.resetSettings(),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.heroSettings.detail(), updated);
      toast.success("Hero settings reset to defaults");
    },
  });
}
