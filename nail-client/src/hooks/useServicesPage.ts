import { useState } from "react";

import { servicesData } from "@/data/services";
import { ServiceCategory } from "@/types";

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

  const filteredServices =
    selectedCategory === "all"
      ? servicesData
      : servicesData.filter((service) => service.category === selectedCategory);

  return {
    categories,
    filteredServices,
    selectedCategory,
    setSelectedCategory,
  };
}
