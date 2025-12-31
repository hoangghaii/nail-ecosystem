export type Service = {
  category: ServiceCategory;
  description: string;
  duration: number; // in minutes
  featured?: boolean;
  id: string;
  imageUrl?: string;
  name: string;
  price: number;
};

export const ServiceCategory = {
  EXTENSIONS: "extensions",
  MANICURE: "manicure",
  NAIL_ART: "nail-art",
  PEDICURE: "pedicure",
  SPA: "spa",
} as const;

export type ServiceCategory =
  (typeof ServiceCategory)[keyof typeof ServiceCategory];

export type ServiceCardProps = {
  service: Service;
  variant?: "default" | "featured" | "compact";
};
