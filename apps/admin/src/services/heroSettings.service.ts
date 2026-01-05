/**
 * Hero Settings Service
 *
 * Handles hero section carousel settings
 */

import type { HeroSettings } from "@/types/heroSettings.types";

import { apiClient } from "@/lib/apiClient";

export class HeroSettingsService {
  async getSettings(): Promise<HeroSettings> {
    return apiClient.get<HeroSettings>("/hero-settings");
  }

  async updateSettings(
    data: Partial<Omit<HeroSettings, "updatedAt">>,
  ): Promise<HeroSettings> {
    return apiClient.patch<HeroSettings>("/hero-settings", data);
  }

  async resetSettings(): Promise<HeroSettings> {
    return this.updateSettings({
      carouselInterval: 5000,
      displayMode: "carousel",
      showControls: true,
    });
  }
}

export const heroSettingsService = new HeroSettingsService();
