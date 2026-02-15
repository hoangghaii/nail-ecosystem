/**
 * Hero Settings Service (Client)
 *
 * Read-only access to hero display settings
 */

import type { HeroSettings } from "@repo/types/hero-settings";

import { apiClient } from "@/lib/apiClient";

export class HeroSettingsService {
  /**
   * Get hero settings (singleton)
   */
  async get(): Promise<HeroSettings> {
    return apiClient.get<HeroSettings>("/hero-settings");
  }
}

export const heroSettingsService = new HeroSettingsService();
