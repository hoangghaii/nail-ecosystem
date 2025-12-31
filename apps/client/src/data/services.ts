import type { Service } from "@/types";

import { ServiceCategory } from "@/types";

export const servicesData: Service[] = [
  {
    category: ServiceCategory.MANICURE,
    description:
      "Traditional manicure with nail shaping, cuticle care, hand massage, and polish application. Perfect for maintaining healthy, beautiful nails.",
    duration: 45,
    featured: true,
    id: "svc-001",
    imageUrl: "https://picsum.photos/800/600?random=21",
    name: "Classic Manicure",
    price: 35,
  },
  {
    category: ServiceCategory.MANICURE,
    description:
      "Long-lasting gel polish manicure with UV curing for 2-3 weeks of chip-free wear. Includes nail prep and cuticle treatment.",
    duration: 60,
    featured: true,
    id: "svc-002",
    imageUrl: "https://picsum.photos/800/600?random=22",
    name: "Gel Manicure",
    price: 50,
  },
  {
    category: ServiceCategory.PEDICURE,
    description:
      "Luxurious pedicure experience with exfoliation, massage, and hydrating treatment. Leaves feet feeling soft and refreshed.",
    duration: 75,
    featured: true,
    id: "svc-003",
    imageUrl: "https://picsum.photos/800/600?random=23",
    name: "Spa Pedicure",
    price: 65,
  },
  {
    category: ServiceCategory.NAIL_ART,
    description:
      "Unique hand-painted designs tailored to your style and preferences. From minimalist to intricate patterns.",
    duration: 90,
    featured: true,
    id: "svc-004",
    imageUrl: "https://picsum.photos/800/600?random=24",
    name: "Custom Nail Art",
    price: 80,
  },
  {
    category: ServiceCategory.PEDICURE,
    description:
      "Ultimate pedicure with extended massage, hot towel treatment, and paraffin wax for deep moisturization.",
    duration: 90,
    id: "svc-005",
    imageUrl: "https://picsum.photos/800/600?random=25",
    name: "Deluxe Pedicure",
    price: 85,
  },
  {
    category: ServiceCategory.EXTENSIONS,
    description:
      "Full set of acrylic nail extensions with your choice of length and shape. Durable and customizable.",
    duration: 120,
    id: "svc-006",
    imageUrl: "https://picsum.photos/800/600?random=26",
    name: "Acrylic Extensions",
    price: 75,
  },
  {
    category: ServiceCategory.EXTENSIONS,
    description:
      "Natural-looking gel extensions that are lighter and more flexible than acrylics. Healthier for natural nails.",
    duration: 120,
    id: "svc-007",
    imageUrl: "https://picsum.photos/800/600?random=27",
    name: "Gel Extensions",
    price: 90,
  },
  {
    category: ServiceCategory.MANICURE,
    description:
      "Quick nail shaping and polish application for those on the go. Perfect for busy schedules.",
    duration: 30,
    id: "svc-008",
    imageUrl: "https://picsum.photos/800/600?random=28",
    name: "Express Manicure",
    price: 25,
  },
  {
    category: ServiceCategory.SPA,
    description:
      "Relaxing manicure with extended hand massage, exfoliation, and hot towel treatment.",
    duration: 60,
    id: "svc-009",
    imageUrl: "https://picsum.photos/800/600?random=29",
    name: "Spa Manicure",
    price: 45,
  },
  {
    category: ServiceCategory.MANICURE,
    description:
      "Classic French tips with white polish and natural base. Timeless and elegant.",
    duration: 50,
    id: "svc-010",
    imageUrl: "https://picsum.photos/800/600?random=30",
    name: "French Manicure",
    price: 40,
  },
];

export const getFeaturedServices = () => servicesData.filter((s) => s.featured);

export const getServicesByCategory = (category: ServiceCategory) =>
  servicesData.filter((s) => s.category === category);

export const getServiceById = (id: string) =>
  servicesData.find((s) => s.id === id);
