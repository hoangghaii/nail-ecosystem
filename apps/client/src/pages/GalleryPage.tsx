import { motion } from "motion/react";
import Masonry from "react-masonry-css";

import type { GalleryItem } from "@/types";

import { FilterPills } from "@/components/gallery/FilterPills";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { GalleryDetailModal } from "@/components/gallery/GalleryDetailModal";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { InfiniteScrollTrigger } from "@/components/shared/InfiniteScrollTrigger";
import { PageHeader } from "@/components/shared/PageHeader";
import { GalleryItemSkeleton } from "@/components/shared/skeletons/GalleryItemSkeleton";
import { useGalleryPage } from "@/hooks/useGalleryPage";
import { getTransition, pageVariants } from "@/utils/animations";

const breakpointColumns = {
  1024: 3,
  1280: 4,
  380: 1,
  640: 2,
  default: 4,
};

export function GalleryPage() {
  const {
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
    isLoading,
    isLoadingItems,
    lightboxOpen,
    nailShapes,
    nailStyles,
    refetch,
    selectedImage,
    selectedShape,
    selectedStyle,
    setSelectedShape,
    setSelectedStyle,
  } = useGalleryPage();

  // Build filter pills with "All" prepended
  const shapeFilters = nailShapes.length > 0 ? [
    { label: "Tất Cả", slug: "all" },
    ...nailShapes.map((s) => ({ label: s.labelVi, slug: s.value })),
  ] : [];

  const styleFilters = nailStyles.length > 0 ? [
    { label: "Tất Cả", slug: "all" },
    ...nailStyles.map((s) => ({ label: s.labelVi, slug: s.value })),
  ] : [];

  const hasActiveFilters = selectedShape !== "all" || selectedStyle !== "all";

  return (
    <>
      <motion.div
        animate="animate"
        className="min-h-screen bg-background"
        exit="exit"
        initial="initial"
        transition={getTransition(0.4)}
        variants={pageVariants}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Breadcrumb />
          <PageHeader
            subtitle="Khám phá bộ sưu tập nghệ thuật nail và thiết kế tuyệt đẹp. Mỗi bộ móng kể một câu chuyện."
            title="Lookbook"
          />

          {/* Nail Shape & Style Filters */}
          <div className="mb-6 space-y-6">
            {shapeFilters.length > 0 && <div>
              <h3 className="mb-3 text-center font-sans text-sm font-semibold text-muted-foreground">
                Dáng Móng
              </h3>
              <FilterPills
                filters={shapeFilters}
                selected={selectedShape}
                onSelect={setSelectedShape}
              />
            </div>}

            {styleFilters.length > 0 && <div>
              <h3 className="mb-3 text-center font-sans text-sm font-semibold text-muted-foreground">
                Phong Cách
              </h3>
              <FilterPills
                filters={styleFilters}
                selected={selectedStyle}
                onSelect={setSelectedStyle}
              />
            </div>}

            {hasActiveFilters && (
              <div className="text-center">
                <button
                  onClick={() => { setSelectedShape("all"); setSelectedStyle("all"); }}
                  className="font-sans text-sm font-medium text-primary hover:underline"
                >
                  Xóa Bộ Lọc
                </button>
              </div>
            )}
          </div>

          {/* Gallery Masonry */}
          {isLoading ? (
            <Masonry breakpointCols={breakpointColumns} className="masonry-grid" columnClassName="masonry-column">
              {Array.from({ length: 15 }).map((_, i) => <GalleryItemSkeleton key={i} index={i} />)}
            </Masonry>
          ) : isError ? (
            <ErrorMessage message="Không thể tải thư viện. Vui lòng thử lại." onRetry={() => refetch()} />
          ) : (
            <Masonry breakpointCols={breakpointColumns} className="masonry-grid" columnClassName="masonry-column">
              {galleryItems.map((item: GalleryItem, index: number) => (
                <GalleryCard
                  key={item._id}
                  index={index}
                  item={item}
                  onImageClick={() => handleImageClick(item, index)}
                />
              ))}
            </Masonry>
          )}

          <GalleryDetailModal
            isOpen={lightboxOpen}
            item={selectedImage}
            onClose={closeLightbox}
            onNext={handleNext}
            onPrevious={handlePrevious}
            hasNext={currentIndex < galleryItems.length - 1}
            hasPrevious={currentIndex > 0}
          />

          {!isLoading && galleryItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
              <p className="font-sans text-lg text-muted-foreground">
                Không tìm thấy mẫu móng phù hợp. Thử bộ lọc khác?
              </p>
            </motion.div>
          )}

          {!isLoadingItems && galleryItems.length > 0 && (
            <InfiniteScrollTrigger
              hasMore={!!hasNextPage}
              isLoading={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              className="mt-4"
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
