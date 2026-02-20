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
    list: (filters?: {
      nailShape?: string;
      nailStyle?: string;
      isActive?: boolean;
      featured?: boolean;
      search?: string;
    }) => [...queryKeys.gallery.lists(), filters] as const,
    details: () => [...queryKeys.gallery.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
  },

  // Nail shapes
  nailShapes: {
    all: ['nail-shapes'] as const,
    lists: () => [...queryKeys.nailShapes.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.nailShapes.all, 'detail', id] as const,
  },

  // Nail styles
  nailStyles: {
    all: ['nail-styles'] as const,
    lists: () => [...queryKeys.nailStyles.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.nailStyles.all, 'detail', id] as const,
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
    list: (filters?: {
      active?: boolean;
      isPrimary?: boolean;
      type?: string;
    }) => [...queryKeys.banners.lists(), filters] as const,
    details: () => [...queryKeys.banners.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.banners.details(), id] as const,
    primary: ['banners', 'primary'] as const,
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

  // Expenses
  expenses: {
    all: ['expenses'] as const,
    lists: () => [...queryKeys.expenses.all, 'list'] as const,
    list: (filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
    }) => [...queryKeys.expenses.lists(), filters] as const,
    details: () => [...queryKeys.expenses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.expenses.details(), id] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    profit: (params?: {
      startDate?: string;
      endDate?: string;
      groupBy?: string;
    }) => [...queryKeys.analytics.all, 'profit', params] as const,
  },
} as const;
