import { motion } from "motion/react";
import { useMemo, useState } from "react";
import Masonry from "react-masonry-css";

import type { GalleryItem } from "@/types";

import { FilterPills } from "@/components/gallery/FilterPills";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { GalleryDetailModal } from "@/components/gallery/GalleryDetailModal";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { PageHeader } from "@/components/shared/PageHeader";
import { GalleryItemSkeleton } from "@/components/shared/skeletons/GalleryItemSkeleton";
import { NAIL_SHAPES, NAIL_STYLES } from "@/data/filter-config";
import { useGalleryPage } from "@/hooks/useGalleryPage";
import { getTransition, pageVariants } from "@/utils/animations";

export function GalleryPage() {
  const {
    categories,
    closeLightbox,
    currentIndex,
    filteredGallery: galleryItems,
    handleImageClick,
    handleNext,
    handlePrevious,
    isError,
    isLoading,
    lightboxOpen,
    refetch,
    selectedCategory,
    selectedImage,
    setSelectedCategory,
  } = useGalleryPage();

  // Filter state
  const [selectedShape, setSelectedShape] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");

  // Multi-dimensional filtering (client-side)
  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item: GalleryItem) => {
      const shapeMatch =
        selectedShape === "all" || item.nailShape === selectedShape;
      const styleMatch =
        selectedStyle === "all" || item.style === selectedStyle;
      return shapeMatch && styleMatch;
    });
  }, [galleryItems, selectedShape, selectedStyle]);

  // Masonry breakpoints: 3 cols (desktop >1024px), 2 cols (tablet/mobile)
  const breakpointColumns = {
    1024: 2, // 640-1024px
    640: 2, // <640px (mobile)
    default: 3, // >1024px
  };

  return (
    <motion.div
      animate="animate"
      className="min-h-screen bg-background"
      exit="exit"
      initial="initial"
      transition={getTransition(0.4)}
      variants={pageVariants}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Breadcrumb />
        <PageHeader
          subtitle="Khám phá bộ sưu tập nghệ thuật nail và thiết kế tuyệt đẹp. Mỗi bộ móng kể một câu chuyện."
          title="Thư Viện Của Chúng Tôi"
        />

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.slug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ damping: 30, stiffness: 300, type: "spring" }}
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-sm px-6 py-3 font-sans font-medium transition-colors duration-200 ${
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:border-secondary"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Nail Shape & Style Filters */}
        <div className="mb-12 space-y-6">
          {/* Nail Shapes */}
          <div>
            <h3 className="mb-3 text-center font-sans text-sm font-semibold text-muted-foreground">
              Dáng Móng
            </h3>
            <FilterPills
              filters={NAIL_SHAPES}
              selected={selectedShape}
              onSelect={setSelectedShape}
            />
          </div>

          {/* Nail Styles */}
          <div>
            <h3 className="mb-3 text-center font-sans text-sm font-semibold text-muted-foreground">
              Phong Cách
            </h3>
            <FilterPills
              filters={NAIL_STYLES}
              selected={selectedStyle}
              onSelect={setSelectedStyle}
            />
          </div>

          {/* Reset Filters Button */}
          {(selectedShape !== "all" || selectedStyle !== "all") && (
            <div className="text-center">
              <button
                onClick={() => {
                  setSelectedShape("all");
                  setSelectedStyle("all");
                }}
                className="font-sans text-sm font-medium text-primary hover:underline"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          )}
        </div>

        {/* Gallery Masonry */}
        {isLoading ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <GalleryItemSkeleton key={i} />
            ))}
          </Masonry>
        ) : isError ? (
          <ErrorMessage
            message="Không thể tải thư viện. Vui lòng thử lại."
            onRetry={() => refetch()}
          />
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {filteredGallery.map((item: GalleryItem, index: number) => (
              <GalleryCard
                key={item._id}
                index={index}
                item={item}
                onImageClick={() => handleImageClick(item, index)}
              />
            ))}
          </Masonry>
        )}

        {/* Gallery Detail Modal */}
        <GalleryDetailModal
          isOpen={lightboxOpen}
          item={selectedImage}
          onClose={closeLightbox}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={currentIndex < filteredGallery.length - 1}
          hasPrevious={currentIndex > 0}
        />

        {/* No results message */}
        {!isLoading && filteredGallery.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="font-sans text-lg text-muted-foreground">
              Không tìm thấy mẫu móng phù hợp. Thử bộ lọc khác?
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
