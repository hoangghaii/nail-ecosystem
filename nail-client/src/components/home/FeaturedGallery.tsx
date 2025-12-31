import { Clock, DollarSign } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";

import { ImageLightbox } from "@/components/gallery/ImageLightbox";
import { Button } from "@/components/ui/button";
import { useFeaturedGallery } from "@/hooks/useFeaturedGallery";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.03,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as Variants;

export function FeaturedGallery() {
  const {
    closeLightbox,
    featuredItems,
    handleImageClick,
    handleNext,
    handlePrevious,
    lightboxOpen,
    selectedImage,
  } = useFeaturedGallery();

  // Create varied heights for true masonry effect
  const masonryHeights = [320, 420, 380, 500, 360, 440, 400, 480];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Thư viện ảnh
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground lg:text-lg">
            Khám phá bộ sưu tập nghệ thuật nail và thiết kế tuyệt đẹp của chúng
            tôi
          </p>
        </motion.div>

        {/* Masonry Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px", once: true }}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group relative mb-3 break-inside-avoid cursor-pointer rounded-[16px] border-2 border-secondary bg-card p-1.5 transition-all hover:border-primary md:mb-4 md:rounded-[20px] md:p-2"
              onClick={() => handleImageClick(item, index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleImageClick(item, index);
                }
              }}
            >
              {/* Gold-framed image */}
              <div className="overflow-hidden rounded-[12px] md:rounded-[16px]">
                <motion.img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full object-cover"
                  style={{
                    height: `${masonryHeights[index % masonryHeights.length]}px`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Hover overlay with reduced opacity */}
              <motion.div
                className="absolute inset-1.5 flex flex-col justify-end rounded-[12px] bg-primary/40 p-2 backdrop-blur-sm md:inset-2 md:rounded-[16px] md:p-3"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Title */}
                <h3 className="mb-1 font-serif text-xs font-semibold text-primary-foreground sm:text-sm md:text-base">
                  {item.title}
                </h3>

                {/* Description (max 2 lines) */}
                {item.description && (
                  <p className="mb-1.5 font-sans text-[10px] text-primary-foreground/90 line-clamp-2 sm:text-xs md:mb-2">
                    {item.description}
                  </p>
                )}

                {/* Price and Duration - minimized */}
                <div className="flex items-center gap-1.5 text-primary-foreground md:gap-2">
                  {item.price && (
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <DollarSign className="size-2.5 md:size-3" />
                      <span className="font-sans text-[10px] font-semibold sm:text-xs">
                        {item.price}
                      </span>
                    </div>
                  )}
                  {item.duration && (
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <Clock className="size-2.5 md:size-3" />
                      <span className="font-sans text-[10px] sm:text-xs">
                        {item.duration}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-12 text-center"
        >
          <Link to="/gallery">
            <Button variant="outline" size="lg" className="group">
              <span className="font-sans text-base font-semibold">
                Xem Toàn Bộ Thư Viện
              </span>
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        item={selectedImage}
        onClose={closeLightbox}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={featuredItems.length > 1}
        hasPrevious={featuredItems.length > 1}
      />
    </section>
  );
}
