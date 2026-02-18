export type GalleryItem = {
  category: string; // Changed from enum to string for dynamic categories (category slug)
  createdAt?: Date;
  description?: string;
  duration?: string; // e.g., "45 min", "1.5 hrs"
  featured?: boolean;
  _id: string;
  imageUrl: string;
  nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto'; // Nail shape for filtering
  price?: string; // e.g., "$45", "$60-80"
  style?: '3d' | 'mirror' | 'gem' | 'ombre'; // Nail style for filtering
  title: string;
};

export const GalleryCategory = {
  ALL: 'all',
  EXTENSIONS: 'extensions',
  MANICURE: 'manicure',
  NAIL_ART: 'nail-art',
  PEDICURE: 'pedicure',
  SEASONAL: 'seasonal',
} as const;

export type GalleryCategory =
  (typeof GalleryCategory)[keyof typeof GalleryCategory];

export type GalleryFilterProps = {
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
};
