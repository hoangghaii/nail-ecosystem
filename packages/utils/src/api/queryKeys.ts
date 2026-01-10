/**
 * Centralized query key factory for React Query
 * Provides type-safe, hierarchical query keys for all resources
 */

export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Services (nail salon services)
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters?: { category?: string }) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },

  // Gallery items
  gallery: {
    all: ['gallery'] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (filters?: { featured?: boolean }) =>
      [...queryKeys.gallery.lists(), filters] as const,
    details: () => [...queryKeys.gallery.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
  },

  // Gallery categories
  galleryCategories: {
    all: ['gallery-categories'] as const,
    lists: () => [...queryKeys.galleryCategories.all, 'list'] as const,
    details: () => [...queryKeys.galleryCategories.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.galleryCategories.details(), id] as const,
  },

  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters?: { status?: string; dateFrom?: string; dateTo?: string }) =>
      [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
  },

  // Banners
  banners: {
    all: ['banners'] as const,
    lists: () => [...queryKeys.banners.all, 'list'] as const,
    details: () => [...queryKeys.banners.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.banners.details(), id] as const,
  },

  // Contact submissions
  contacts: {
    all: ['contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (filters?: { status?: string }) =>
      [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
  },

  // Business info (singleton)
  businessInfo: {
    all: ['businessInfo'] as const,
    detail: () => [...queryKeys.businessInfo.all, 'detail'] as const,
  },

  // Hero settings (singleton)
  heroSettings: {
    all: ['heroSettings'] as const,
    detail: () => [...queryKeys.heroSettings.all, 'detail'] as const,
  },
} as const;
