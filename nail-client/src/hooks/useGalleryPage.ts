import { useState } from "react";

import type { GalleryItem } from "@/types";

import { galleryData, GalleryCategory } from "@/data/gallery";

const categories = [
  { label: "Tất Cả", value: "all" },
  { label: "Làm Móng Tay", value: GalleryCategory.MANICURE },
  { label: "Làm Móng Chân", value: GalleryCategory.PEDICURE },
  { label: "Nghệ Thuật Nail", value: GalleryCategory.NAIL_ART },
  { label: "Nối Móng", value: GalleryCategory.EXTENSIONS },
];

export function useGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredGallery =
    selectedCategory === "all"
      ? galleryData
      : galleryData.filter((item) => item.category === selectedCategory);

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
    lightboxOpen,
    selectedCategory,
    selectedImage,
    setSelectedCategory,
  };
}
