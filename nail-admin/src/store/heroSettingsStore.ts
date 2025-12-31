import { create } from "zustand";

import type { HeroSettings, HeroDisplayMode } from "@/types/heroSettings.types";

const DEFAULT_HERO_SETTINGS: HeroSettings = {
  carouselInterval: 5000,
  displayMode: "carousel",
  showControls: true,
  updatedAt: new Date(),
};

type HeroSettingsState = {
  initializeSettings: () => void;
  isInitialized: boolean;
  resetSettings: () => void;
  setCarouselInterval: (interval: number) => void;
  setDisplayMode: (mode: HeroDisplayMode) => void;
  setShowControls: (show: boolean) => void;
  settings: HeroSettings;
  updateSettings: (settings: Partial<Omit<HeroSettings, "updatedAt">>) => void;
};

export const useHeroSettingsStore = create<HeroSettingsState>((set, get) => ({
  initializeSettings: () => {
    if (!get().isInitialized) {
      set({ isInitialized: true, settings: DEFAULT_HERO_SETTINGS });
    }
  },
  isInitialized: false,

  resetSettings: () => {
    set({ settings: { ...DEFAULT_HERO_SETTINGS, updatedAt: new Date() } });
  },

  setCarouselInterval: (interval) => {
    set((state) => ({
      settings: {
        ...state.settings,
        carouselInterval: interval,
        updatedAt: new Date(),
      },
    }));
  },

  setDisplayMode: (mode) => {
    set((state) => ({
      settings: {
        ...state.settings,
        displayMode: mode,
        updatedAt: new Date(),
      },
    }));
  },

  setShowControls: (show) => {
    set((state) => ({
      settings: {
        ...state.settings,
        showControls: show,
        updatedAt: new Date(),
      },
    }));
  },

  settings: DEFAULT_HERO_SETTINGS,

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
        updatedAt: new Date(),
      },
    }));
  },
}));
