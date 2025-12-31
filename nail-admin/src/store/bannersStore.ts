import { create } from "zustand";

import type { Banner } from "@/types/banner.types";

import { MOCK_BANNERS } from "@/data/mockBanners";

type BannersState = {
  addBanner: (banner: Banner) => void;
  banners: Banner[];
  deleteBanner: (id: string) => void;
  initializeBanners: () => void;
  isInitialized: boolean;
  reorderBanners: (bannerIds: string[]) => void;
  setBanners: (banners: Banner[]) => void;
  setPrimaryBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
};

export const useBannersStore = create<BannersState>((set, get) => ({
  addBanner: (banner) => {
    set((state) => ({
      banners: [...state.banners, banner],
    }));
  },
  banners: [],

  deleteBanner: (id) => {
    set((state) => ({
      banners: state.banners.filter((banner) => banner.id !== id),
    }));
  },

  initializeBanners: () => {
    if (!get().isInitialized) {
      set({ banners: MOCK_BANNERS, isInitialized: true });
    }
  },

  isInitialized: false,

  reorderBanners: (bannerIds) => {
    set((state) => {
      const bannerMap = new Map(state.banners.map((b) => [b.id, b]));
      const reorderedBanners = bannerIds
        .map((id, index) => {
          const banner = bannerMap.get(id);
          return banner ? { ...banner, sortIndex: index } : null;
        })
        .filter((b): b is Banner => b !== null);

      return { banners: reorderedBanners };
    });
  },

  setBanners: (banners) => {
    set({ banners });
  },

  setPrimaryBanner: (id) => {
    set((state) => ({
      banners: state.banners.map((banner) =>
        banner.id === id
          ? { ...banner, isPrimary: true, updatedAt: new Date() }
          : { ...banner, isPrimary: false, updatedAt: new Date() },
      ),
    }));
  },

  toggleBannerActive: (id) => {
    set((state) => ({
      banners: state.banners.map((banner) =>
        banner.id === id
          ? { ...banner, active: !banner.active, updatedAt: new Date() }
          : banner,
      ),
    }));
  },

  updateBanner: (id, data) => {
    set((state) => ({
      banners: state.banners.map((banner) =>
        banner.id === id
          ? { ...banner, ...data, updatedAt: new Date() }
          : banner,
      ),
    }));
  },
}));
