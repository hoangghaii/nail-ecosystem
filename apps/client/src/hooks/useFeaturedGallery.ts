import { useMemo, useState } from "react";

import type { GalleryItem } from "@/types";

import { useFeaturedGalleryItems } from "./api/useGallery";

export function useFeaturedGallery() {
  const { data: featuredData = [], isLoading } = useFeaturedGalleryItems();
  const featuredItems = useMemo(
    () => featuredData.slice(0, 8),
    [featuredData],
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % featuredItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(featuredItems[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex =
      (currentIndex - 1 + featuredItems.length) % featuredItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(featuredItems[prevIndex]);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return {
    closeLightbox,
    currentIndex,
    featuredItems,
    handleImageClick,
    handleNext,
    handlePrevious,
    isLoading,
    lightboxOpen,
    selectedImage,
  };
}
