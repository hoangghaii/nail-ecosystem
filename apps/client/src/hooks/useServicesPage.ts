import { useState } from "react";

import { ServiceCategory } from "@/types";

import { useServices } from "./api/useServices";

const categories = [
  { label: "Tất Cả Dịch Vụ", value: "all" },
  { label: "Làm Móng Tay", value: ServiceCategory.MANICURE },
  { label: "Làm Móng Chân", value: ServiceCategory.PEDICURE },
  { label: "Nghệ Thuật Nail", value: ServiceCategory.NAIL_ART },
  { label: "Nối Móng", value: ServiceCategory.EXTENSIONS },
  { label: "Spa", value: ServiceCategory.SPA },
];

export function useServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Backend filtering
  const {
    data: services = [],
    isError,
    isLoading,
    refetch,
  } = useServices({
    category:
      selectedCategory !== "all"
        ? (selectedCategory as ServiceCategory)
        : undefined,
    isActive: true, // Only show active services
  });

  return {
    categories,
    filteredServices: services, // Already filtered by backend
    isError,
    isLoading,
    refetch,
    selectedCategory,
    setSelectedCategory,
  };
}
