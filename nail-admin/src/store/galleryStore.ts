import { create } from "zustand";

import type { GalleryItem } from "@/types/gallery.types";

import { MOCK_GALLERY } from "@/data/mockGallery";

type GalleryState = {
  addGalleryItem: (item: GalleryItem) => void;
  addMultipleItems: (items: GalleryItem[]) => void;
  deleteGalleryItem: (id: string) => void;
  deleteMultipleItems: (ids: string[]) => void;
  galleryItems: GalleryItem[];
  initializeGallery: () => void;
  isInitialized: boolean;
  setGalleryItems: (items: GalleryItem[]) => void;
  toggleFeatured: (id: string) => void;
  updateGalleryItem: (id: string, data: Partial<GalleryItem>) => void;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  addGalleryItem: (item) => {
    set((state) => ({
      galleryItems: [...state.galleryItems, item],
    }));
  },

  addMultipleItems: (items) => {
    set((state) => ({
      galleryItems: [...state.galleryItems, ...items],
    }));
  },

  deleteGalleryItem: (id) => {
    set((state) => ({
      galleryItems: state.galleryItems.filter((item) => item.id !== id),
    }));
  },

  deleteMultipleItems: (ids) => {
    const idsSet = new Set(ids);
    set((state) => ({
      galleryItems: state.galleryItems.filter((item) => !idsSet.has(item.id)),
    }));
  },

  galleryItems: [],

  initializeGallery: () => {
    if (!get().isInitialized) {
      set({ galleryItems: MOCK_GALLERY, isInitialized: true });
    }
  },

  isInitialized: false,

  setGalleryItems: (items) => {
    set({ galleryItems: items });
  },

  toggleFeatured: (id) => {
    set((state) => ({
      galleryItems: state.galleryItems.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item,
      ),
    }));
  },

  updateGalleryItem: (id, data) => {
    set((state) => ({
      galleryItems: state.galleryItems.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    }));
  },
}));
