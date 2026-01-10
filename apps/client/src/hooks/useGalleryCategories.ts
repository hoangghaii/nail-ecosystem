import { useQuery } from "@tanstack/react-query";

import type { GalleryCategoryItem, PaginationResponse } from "@/types";

import { apiClient } from "@/lib/apiClient";

// Vietnamese label mapping (client-side only)
const VIETNAMESE_LABELS: Record<string, string> = {
  all: "Tất Cả",
  manicure: "Làm Móng Tay",
  pedicure: "Làm Móng Chân",
  "nail-art": "Nghệ Thuật Nail",
  extensions: "Nối Móng",
  seasonal: "Theo Mùa",
};

export type CategoryWithLabel = GalleryCategoryItem & {
  label: string; // Vietnamese label
};

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
      name: "All",
      slug: "all",
      description: "",
      sortIndex: 0,
      isActive: true,
      label: "Tất Cả",
    },
    ...categoriesWithLabels,
  ];

  return {
    ...query,
    categories: allCategories,
  };
}
