import { create } from "zustand";

import type { BusinessInfo } from "@/types/businessInfo.types";

import { mockBusinessInfo } from "@/data/mockBusinessInfo";

type BusinessInfoState = {
  businessInfo: BusinessInfo | null;
  initializeBusinessInfo: () => void;
  isInitialized: boolean;
  setBusinessInfo: (businessInfo: BusinessInfo) => void;
  updateBusinessInfo: (data: Partial<Omit<BusinessInfo, "id">>) => void;
};

export const useBusinessInfoStore = create<BusinessInfoState>((set, get) => ({
  businessInfo: null,

  initializeBusinessInfo: () => {
    if (!get().isInitialized) {
      set({ businessInfo: mockBusinessInfo, isInitialized: true });
    }
  },

  isInitialized: false,

  setBusinessInfo: (businessInfo) => {
    set({ businessInfo });
  },

  updateBusinessInfo: (data) => {
    set((state) => ({
      businessInfo: state.businessInfo
        ? { ...state.businessInfo, ...data }
        : null,
    }));
  },
}));
