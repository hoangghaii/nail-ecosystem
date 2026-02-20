import { useState } from "react";
import { useMemo } from "react";

import type { GalleryItem } from "@/types";

import { useInfiniteGalleryItems, useNailShapes, useNailStyles } from "./api/useGallery";

export function useGalleryPage() {
  const [selectedShape, setSelectedShape] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch dynamic filter options
  const { data: nailShapesData, isLoading: isLoadingShapes } = useNailShapes();
  const { data: nailStylesData, isLoading: isLoadingStyles } = useNailStyles();

  // Server-side filtering by nailShape and nailStyle
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading: isLoadingItems,
    refetch,
  } = useInfiniteGalleryItems({
    isActive: true,
    nailShape: selectedShape !== "all" ? selectedShape : undefined,
    nailStyle: selectedStyle !== "all" ? selectedStyle : undefined,
  });

  const galleryItems = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

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
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryItems[prevIndex]);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return {
    closeLightbox,
    currentIndex,
    fetchNextPage,
    galleryItems,
    handleImageClick,
    handleNext,
    handlePrevious,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading: isLoadingItems || isLoadingShapes || isLoadingStyles,
    isLoadingItems,
    lightboxOpen,
    nailShapes: nailShapesData ?? [],
    nailStyles: nailStylesData ?? [],
    refetch,
    selectedImage,
    selectedShape,
    selectedStyle,
    setSelectedShape,
    setSelectedStyle,
  };
}
