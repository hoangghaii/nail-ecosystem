import { useMemo, useState } from "react";

import type { GalleryItem } from "@/types";

import { useGalleryItems } from "./api/useGallery";
import { useGalleryCategories } from "./useGalleryCategories";

export function useGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch categories
  const { categories, isLoading: isLoadingCategories } = useGalleryCategories();

  // Find categoryId from slug
  const categoryId = useMemo(() => {
    if (selectedCategory === "all") return undefined;
    const category = categories.find((c) => c.slug === selectedCategory);
    return category?._id;
  }, [selectedCategory, categories]);

  // Backend filtering by categoryId
  const {
    data: galleryItems = [],
    isError,
    isLoading: isLoadingItems,
    refetch,
  } = useGalleryItems({
    categoryId,
    isActive: true,
  });

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryItems[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryItems[prevIndex]);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return {
    categories,
    closeLightbox,
    currentIndex,
    filteredGallery: galleryItems, // Already filtered by backend
    handleImageClick,
    handleNext,
    handlePrevious,
    isError,
    isLoading: isLoadingItems || isLoadingCategories,
    lightboxOpen,
    refetch,
    selectedCategory,
    selectedImage,
    setSelectedCategory,
  };
}
