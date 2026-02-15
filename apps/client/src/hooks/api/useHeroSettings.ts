/**
 * Hero Settings API Hooks (Client)
 *
 * TanStack Query hooks for hero settings
 */

import { queryKeys } from "@repo/utils/api";
import { useQuery } from "@tanstack/react-query";

import { heroSettingsService } from "@/services/hero-settings.service";

/**
 * Query: Get hero settings
 */
export function useHeroSettings() {
  return useQuery({
    queryFn: () => heroSettingsService.get(),
    queryKey: queryKeys.heroSettings.detail(),
    staleTime: 10 * 60 * 1000, // 10 minutes (settings rarely change)
  });
}
