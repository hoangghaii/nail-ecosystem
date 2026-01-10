import { motion } from "motion/react";

import type { GalleryItem } from "@/types";

import { GalleryCard } from "@/components/gallery/GalleryCard";
import { ImageLightbox } from "@/components/gallery/ImageLightbox";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGalleryPage } from "@/hooks/useGalleryPage";

export function GalleryPage() {
  const {
    categories,
    closeLightbox,
    filteredGallery,
    handleImageClick,
    handleNext,
    handlePrevious,
    isLoading,
    lightboxOpen,
    selectedCategory,
    selectedImage,
    setSelectedCategory,
  } = useGalleryPage();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
              className={`rounded-[12px] px-6 py-3 font-sans font-medium transition-colors duration-200 ${
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:border-secondary"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 font-sans text-lg text-muted-foreground">
              Đang tải thư viện...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((item: GalleryItem, index: number) => (
              <GalleryCard
                key={item._id}
                index={index}
                item={item}
                onImageClick={() => handleImageClick(item, index)}
              />
            ))}
          </div>
        )}

        {/* Image Lightbox */}
        <ImageLightbox
          isOpen={lightboxOpen}
          item={selectedImage}
          onClose={closeLightbox}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={filteredGallery.length > 1}
          hasPrevious={filteredGallery.length > 1}
        />

        {/* No results message */}
        {!isLoading && filteredGallery.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="font-sans text-lg text-muted-foreground">
              Không tìm thấy mục nào trong danh mục này.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
