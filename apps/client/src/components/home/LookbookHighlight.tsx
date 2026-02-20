import { cn } from "@repo/utils/cn";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { LazyImage } from "@/components/shared/LazyImage";
import { GalleryItemSkeleton } from "@/components/shared/skeletons/GalleryItemSkeleton";
import { Button } from "@/components/ui/button";
import { useGalleryItems } from "@/hooks/api/useGallery";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
    y: 0,
  },
};

// Heights for asymmetric grid feel
const gridHeights = ["h-48 md:h-64", "h-40 md:h-52", "h-44 md:h-56", "h-40 md:h-52", "h-44 md:h-56", "h-48 md:h-64"];

export function LookbookHighlight() {
  const { data: gallery = [], isLoading } = useGalleryItems({
    featured: true,
    isActive: true,
    limit: 6,
  });

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground">
            Bộ Sưu Tập Mới Nhất
          </h2>
          <p className="mt-4 font-sans text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Những mẫu móng nghệ thuật được yêu thích nhất tại studio
          </p>
        </motion.div>

        {/* Asymmetric Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  gridHeights[i % gridHeights.length],
                  i === 0 && "md:col-span-2 md:row-span-2 md:h-auto",
                )}
              >
                <GalleryItemSkeleton className="h-full" />
              </div>
            ))}
          </div>
        ) : gallery.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-50px", once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-10"
          >
            {gallery.slice(0, 6).map((item, index) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                className={cn(
                  "relative overflow-hidden rounded-[20px] group cursor-pointer",
                  "border-2 border-secondary hover:border-primary transition-colors duration-300",
                  index === 0 && "md:col-span-2 md:row-span-2",
                  gridHeights[index % gridHeights.length],
                  index === 0 && "md:h-[calc(2*13rem+1rem)] lg:h-[calc(2*14rem+1rem)]",
                )}
              >
                <Link to="/gallery" className="block h-full">
                  <motion.div
                    className="h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <LazyImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      placeholderClassName="rounded-[18px]"
                    />
                  </motion.div>

                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent flex flex-col justify-end p-3 md:p-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-sm md:text-base font-semibold text-primary-foreground line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-sans text-xs text-primary-foreground/80 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : null}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-center"
        >
          <Link to="/gallery">
            <Button variant="outline" size="lg" className="group rounded-[16px]">
              <span className="font-sans font-semibold">Xem Toàn Bộ Lookbook</span>
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
