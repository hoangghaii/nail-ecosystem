import { X, ChevronLeft, ChevronRight, DollarSign, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { GalleryItem } from "@/types";

import { Button } from "@/components/ui/button";

type ImageLightboxProps = {
  hasNext?: boolean;
  hasPrevious?: boolean;
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function ImageLightbox({
  hasNext = false,
  hasPrevious = false,
  isOpen,
  item,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (item) {
      // Navigate to booking page with gallery item data
      navigate("/booking", {
        state: {
          fromGallery: true,
          galleryItem: item,
        },
      });
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft" && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === "ArrowRight" && hasNext && onNext) {
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/95"
            onClick={onClose}
          />

          {/* Lightbox Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ damping: 30, stiffness: 300, type: "spring" }}
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-[12px] border-2 border-border bg-background p-3 text-foreground transition-colors duration-200 hover:border-primary hover:bg-card"
              aria-label="Close lightbox"
            >
              <X className="size-6" />
            </motion.button>

            {/* Previous Button */}
            {hasPrevious && onPrevious && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  damping: 30,
                  delay: 0.1,
                  stiffness: 300,
                  type: "spring",
                }}
                onClick={onPrevious}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-[12px] border-2 border-border bg-background p-3 text-foreground transition-colors duration-200 hover:border-primary hover:bg-card"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </motion.button>
            )}

            {/* Next Button */}
            {hasNext && onNext && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  damping: 30,
                  delay: 0.1,
                  stiffness: 300,
                  type: "spring",
                }}
                onClick={onNext}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-[12px] border-2 border-border bg-background p-3 text-foreground transition-colors duration-200 hover:border-primary hover:bg-card"
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </motion.button>
            )}

            {/* Image Container - Responsive Layout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ damping: 30, stiffness: 300, type: "spring" }}
              className="relative flex max-h-[90vh] w-full max-w-6xl flex-col gap-3 overflow-y-auto p-2 md:flex-row md:items-center md:gap-4 md:p-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold-framed image - Left side */}
              <div className="flex-shrink-0 rounded-[20px] border-2 border-secondary bg-card p-2 md:w-3/5 md:rounded-[24px] md:p-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-auto w-full max-h-[50vh] rounded-[16px] object-contain md:max-h-[85vh] md:rounded-[20px]"
                />
              </div>

              {/* Image Info - Right side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  damping: 30,
                  delay: 0.15,
                  stiffness: 300,
                  type: "spring",
                }}
                className="flex flex-col rounded-[12px] border border-border bg-background p-4 md:w-2/5 md:rounded-[16px] md:p-6"
              >
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground md:text-2xl">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mb-3 font-sans text-sm leading-relaxed text-muted-foreground md:mb-4 md:text-base">
                    {item.description}
                  </p>
                )}

                {/* Price and Duration - Separate rows with different backgrounds */}
                <div className="mb-4 space-y-2 md:mb-6 md:space-y-3">
                  {item.price && (
                    <div className="flex items-center gap-2 rounded-[12px] border border-border bg-primary/5 p-2 md:p-2.5">
                      <DollarSign className="size-4 text-primary md:size-5" />
                      <span className="font-sans text-lg font-semibold text-primary md:text-xl">
                        {item.price}
                      </span>
                    </div>
                  )}
                  {item.duration && (
                    <div className="flex items-center gap-2 rounded-[12px] border border-border bg-secondary/10 p-2 md:p-2.5">
                      <Clock className="size-4 text-secondary md:size-5" />
                      <span className="font-sans text-sm text-foreground md:text-base">
                        {item.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Book Now Button */}
                <Button
                  onClick={handleBookNow}
                  className="w-full rounded-[12px] text-sm md:text-base"
                  size="default"
                >
                  Đặt Lịch Ngay
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
