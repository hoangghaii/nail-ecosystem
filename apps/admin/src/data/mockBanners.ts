import type { Banner } from "@/types/banner.types";

export const MOCK_BANNERS: Banner[] = [
  {
    active: true,
    createdAt: new Date("2025-11-15"),
    id: "banner_1",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&h=1080&fit=crop",
    isPrimary: true,
    sortIndex: 0,
    title: "Welcome to Pink Nail Salon",
    type: "image",
    updatedAt: new Date("2025-11-15"),
  },
  {
    active: false,
    createdAt: new Date("2025-11-20"),
    id: "banner_2",
    imageUrl:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1920&h=1080&fit=crop",
    isPrimary: false,
    sortIndex: 1,
    title: "Special Holiday Offer",
    type: "image",
    updatedAt: new Date("2025-11-20"),
  },
  {
    active: true,
    createdAt: new Date("2025-11-25"),
    id: "banner_3",
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1920&h=1080&fit=crop",
    isPrimary: false,
    sortIndex: 2,
    title: "New Nail Art Collection",
    type: "image",
    updatedAt: new Date("2025-11-25"),
  },
  {
    active: false,
    createdAt: new Date("2025-11-10"),
    id: "banner_4",
    imageUrl:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1920&h=1080&fit=crop",
    isPrimary: false,
    sortIndex: 3,
    title: "Premium Spa Experience",
    type: "video",
    updatedAt: new Date("2025-11-28"),
  },
  {
    active: true,
    createdAt: new Date("2025-11-05"),
    id: "banner_5",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=1080&fit=crop",
    isPrimary: false,
    sortIndex: 4,
    title: "Gift Cards Available",
    type: "video",
    updatedAt: new Date("2025-11-05"),
  },
];
