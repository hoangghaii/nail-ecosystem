import type { GalleryItem } from "@/types/gallery.types";

export const MOCK_GALLERY: GalleryItem[] = [
  // Extensions (4 items)
  {
    category: "extensions",
    createdAt: new Date("2025-01-15"),
    description: "Classic almond-shaped gel extensions with nude polish",
    duration: "1.5 hrs",
    featured: true,
    id: "gallery_1",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop",
    price: "$65",
    title: "Natural Almond Extensions",
  },
  {
    category: "extensions",
    createdAt: new Date("2025-01-18"),
    description: "Long square-shaped acrylic extensions with French tips",
    duration: "2 hrs",
    featured: false,
    id: "gallery_2",
    imageUrl:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop",
    price: "$75",
    title: "French Square Extensions",
  },
  {
    category: "extensions",
    createdAt: new Date("2025-01-20"),
    description: "Medium length stiletto extensions with ombré effect",
    duration: "2 hrs",
    featured: false,
    id: "gallery_3",
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop",
    price: "$80",
    title: "Ombré Stiletto Extensions",
  },
  {
    category: "extensions",
    createdAt: new Date("2025-01-22"),
    description: "Short coffin-shaped gel extensions with glossy finish",
    duration: "1.5 hrs",
    featured: true,
    id: "gallery_4",
    imageUrl:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop",
    price: "$70",
    title: "Glossy Coffin Extensions",
  },

  // Manicure (4 items)
  {
    category: "manicure",
    createdAt: new Date("2025-01-12"),
    description: "Classic manicure with nude polish and glossy topcoat",
    duration: "45 min",
    featured: false,
    id: "gallery_5",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop",
    price: "$35",
    title: "Classic Nude Manicure",
  },
  {
    category: "manicure",
    createdAt: new Date("2025-01-14"),
    description: "French manicure with white tips and sheer pink base",
    duration: "1 hr",
    featured: true,
    id: "gallery_6",
    imageUrl:
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=800&h=600&fit=crop",
    price: "$40",
    title: "French Tip Manicure",
  },
  {
    category: "manicure",
    createdAt: new Date("2025-01-16"),
    description: "Gel manicure with bold red color and matte finish",
    duration: "1 hr",
    featured: false,
    id: "gallery_7",
    imageUrl:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=600&fit=crop",
    price: "$45",
    title: "Bold Red Gel Manicure",
  },
  {
    category: "manicure",
    createdAt: new Date("2025-01-25"),
    description: "Natural manicure with buff and shine, no polish",
    duration: "30 min",
    featured: false,
    id: "gallery_8",
    imageUrl:
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&h=600&fit=crop",
    price: "$30",
    title: "Natural Buff & Shine",
  },

  // Nail Art (4 items)
  {
    category: "nail-art",
    createdAt: new Date("2025-01-10"),
    description: "Geometric patterns with gold foil accents on nude base",
    duration: "1.5 hrs",
    featured: true,
    id: "gallery_9",
    imageUrl:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop&sat=-20",
    price: "$55",
    title: "Gold Geometric Art",
  },
  {
    category: "nail-art",
    createdAt: new Date("2025-01-17"),
    description: "Hand-painted floral designs with pastel colors",
    duration: "2 hrs",
    featured: true,
    id: "gallery_10",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop&hue=30",
    price: "$70",
    title: "Pastel Floral Art",
  },
  {
    category: "nail-art",
    createdAt: new Date("2025-01-19"),
    description: "Abstract marble effect with metallic gold details",
    duration: "1.5 hrs",
    featured: false,
    id: "gallery_11",
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop&hue=60",
    price: "$60",
    title: "Marble & Gold Art",
  },
  {
    category: "nail-art",
    createdAt: new Date("2025-01-23"),
    description: "Glitter gradient with rhinestone accents",
    duration: "1.5 hrs",
    featured: false,
    id: "gallery_12",
    imageUrl:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop&hue=90",
    price: "$65",
    title: "Glitter Gradient Art",
  },

  // Pedicure (4 items)
  {
    category: "pedicure",
    createdAt: new Date("2025-01-11"),
    description: "Classic pedicure with red polish and foot massage",
    duration: "1 hr",
    featured: false,
    id: "gallery_13",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&hue=180",
    price: "$45",
    title: "Classic Red Pedicure",
  },
  {
    category: "pedicure",
    createdAt: new Date("2025-01-13"),
    description: "French pedicure with white tips and pink base",
    duration: "1 hr",
    featured: true,
    id: "gallery_14",
    imageUrl:
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=800&h=600&fit=crop&hue=120",
    price: "$50",
    title: "French Tip Pedicure",
  },
  {
    category: "pedicure",
    createdAt: new Date("2025-01-21"),
    description: "Gel pedicure with coral color and glossy finish",
    duration: "1.25 hrs",
    featured: false,
    id: "gallery_15",
    imageUrl:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=600&fit=crop&hue=150",
    price: "$55",
    title: "Coral Gel Pedicure",
  },
  {
    category: "pedicure",
    createdAt: new Date("2025-01-24"),
    description: "Spa pedicure with exfoliation, massage, and polish",
    duration: "1.5 hrs",
    featured: false,
    id: "gallery_16",
    imageUrl:
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&h=600&fit=crop&hue=210",
    price: "$60",
    title: "Luxury Spa Pedicure",
  },

  // Seasonal (4 items)
  {
    category: "seasonal",
    createdAt: new Date("2025-01-05"),
    description: "Winter-themed design with snowflakes and silver glitter",
    duration: "2 hrs",
    featured: true,
    id: "gallery_17",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop&sat=-40",
    price: "$75",
    title: "Winter Wonderland",
  },
  {
    category: "seasonal",
    createdAt: new Date("2025-01-08"),
    description: "Valentine's Day hearts and pink ombré design",
    duration: "1.5 hrs",
    featured: false,
    id: "gallery_18",
    imageUrl:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop&hue=-30",
    price: "$65",
    title: "Valentine Hearts",
  },
  {
    category: "seasonal",
    createdAt: new Date("2025-01-26"),
    description: "Spring floral design with pastel colors and butterflies",
    duration: "2 hrs",
    featured: false,
    id: "gallery_19",
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop&hue=120",
    price: "$70",
    title: "Spring Blossom",
  },
  {
    category: "seasonal",
    createdAt: new Date("2025-01-28"),
    description: "Holiday glitter design with red and gold accents",
    duration: "1.5 hrs",
    featured: true,
    id: "gallery_20",
    imageUrl:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop&hue=-60",
    price: "$68",
    title: "Holiday Glam",
  },
];
