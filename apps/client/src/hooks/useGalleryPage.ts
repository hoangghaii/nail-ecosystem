import { useMemo, useState } from "react";

import type { GalleryItem } from "@/types";

import { useGalleryItems } from "./api/useGallery";
import { useGalleryCategories } from "./useGalleryCategories";

export function useGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch gallery items and categories from API
  const { data: galleryItems = [], isLoading: isLoadingItems } =
    useGalleryItems();
  const { categories, isLoading: isLoadingCategories } = useGalleryCategories();

  const filteredGallery = useMemo(() => {
    if (selectedCategory === "all") return galleryItems;
    return galleryItems.filter((item: GalleryItem) => item.category === selectedCategory);
  }, [galleryItems, selectedCategory]);

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % filteredGallery.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredGallery[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex =
      (currentIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredGallery[prevIndex]);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return {
    categories,
    closeLightbox,
    currentIndex,
    filteredGallery,
    handleImageClick,
    handleNext,
    handlePrevious,
    isLoading: isLoadingItems || isLoadingCategories,
    lightboxOpen,
    selectedCategory,
    selectedImage,
    setSelectedCategory,
  };
}
