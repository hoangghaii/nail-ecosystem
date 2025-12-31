export type GalleryItem = {
  category: GalleryCategory;
  createdAt?: Date;
  description?: string;
  duration?: string; // e.g., "45 min", "1.5 hrs"
  featured?: boolean;
  id: string;
  imageUrl: string;
  price?: string; // e.g., "$45", "$60-80"
  title: string;
};

export const GalleryCategory = {
  ALL: "all",
  EXTENSIONS: "extensions",
  MANICURE: "manicure",
  NAIL_ART: "nail-art",
  PEDICURE: "pedicure",
  SEASONAL: "seasonal",
} as const;

export type GalleryCategory =
  (typeof GalleryCategory)[keyof typeof GalleryCategory];

export type GalleryFilterProps = {
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
};
