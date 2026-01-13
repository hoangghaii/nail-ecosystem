import { useQuery } from "@tanstack/react-query";

import type { GalleryCategoryItem, PaginationResponse } from "@/types";

import { apiClient } from "@/lib/apiClient";

// Vietnamese label mapping (client-side only)
const VIETNAMESE_LABELS: Record<string, string> = {
  all: "Tất Cả",
  extensions: "Nối Móng",
  manicure: "Làm Móng Tay",
  "nail-art": "Nghệ Thuật Nail",
  pedicure: "Làm Móng Chân",
  seasonal: "Theo Mùa",
};

export type CategoryWithLabel = {
  label: string; // Vietnamese label
} & GalleryCategoryItem;

async function fetchCategories(): Promise<
  PaginationResponse<GalleryCategoryItem>
> {
  return apiClient.get<PaginationResponse<GalleryCategoryItem>>(
    "/gallery-categories",
  );
}

export function useGalleryCategories() {
  const query = useQuery({
    queryFn: fetchCategories,
    queryKey: ["gallery-categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform categories with Vietnamese labels
  const categoriesWithLabels: CategoryWithLabel[] = (query.data?.data ?? [])
    .filter((c: GalleryCategoryItem) => c.isActive)
    .sort((a: GalleryCategoryItem, b: GalleryCategoryItem) => a.name.localeCompare(b.name))
    .map((category: GalleryCategoryItem) => ({
      ...category,
      label: VIETNAMESE_LABELS[category.slug] || category.name,
    }));

  // Add "All" category
  const allCategories: CategoryWithLabel[] = [
    {
      _id: "all",
      description: "",
      isActive: true,
      label: "Tất Cả",
      name: "All",
      slug: "all",
      sortIndex: 0,
    },
    ...categoriesWithLabels,
  ];

  return {
    ...query,
    categories: allCategories,
  };
}
