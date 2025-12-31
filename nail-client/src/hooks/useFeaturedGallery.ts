import { useState } from "react";

import type { GalleryItem } from "@/types";

import { getFeaturedGallery } from "@/data/gallery";

export function useFeaturedGallery() {
  const featuredItems = getFeaturedGallery();
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
    lightboxOpen,
    selectedImage,
  };
}
