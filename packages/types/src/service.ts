export type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: ServiceCategory;
  imageUrl?: string;
  featured?: boolean;
};

export const ServiceCategory = {
  EXTENSIONS: 'extensions',
  MANICURE: 'manicure',
  NAIL_ART: 'nail-art',
  PEDICURE: 'pedicure',
  SPA: 'spa',
} as const;

export type ServiceCategory =
  (typeof ServiceCategory)[keyof typeof ServiceCategory];

export type ServiceCardProps = {
  service: Service;
  variant?: 'default' | 'featured' | 'compact';
};
