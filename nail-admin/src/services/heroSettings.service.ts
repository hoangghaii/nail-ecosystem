import type { HeroSettings } from "@/types/heroSettings.types";

import { useHeroSettingsStore } from "@/store/heroSettingsStore";

export class HeroSettingsService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getSettings(): Promise<HeroSettings> {
    if (this.useMockApi) {
      return useHeroSettingsStore.getState().settings;
    }

    const response = await fetch("/api/hero-settings");
    if (!response.ok) throw new Error("Failed to fetch hero settings");
    return response.json();
  }

  async updateSettings(
    data: Partial<Omit<HeroSettings, "updatedAt">>,
  ): Promise<HeroSettings> {
    if (this.useMockApi) {
      useHeroSettingsStore.getState().updateSettings(data);
      return useHeroSettingsStore.getState().settings;
    }

    const response = await fetch("/api/hero-settings", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to update hero settings");
    return response.json();
  }

  async resetSettings(): Promise<HeroSettings> {
    if (this.useMockApi) {
      useHeroSettingsStore.getState().resetSettings();
      return useHeroSettingsStore.getState().settings;
    }

    return this.updateSettings({
      carouselInterval: 5000,
      displayMode: "carousel",
      showControls: true,
    });
  }
}

export const heroSettingsService = new HeroSettingsService();
