import type { Banner } from "@repo/types/banner";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface HeroCarouselModeProps {
  banners: Banner[];
  currentSlide: number;
  onEnded: () => void;
  onNext: () => void;
  onPause: () => void;
  onPlay: () => void;
  onPrev: () => void;
  onSlideSelect: (index: number) => void;
  showControls: boolean;
}

export function HeroCarouselMode({
  banners,
  currentSlide,
  onEnded,
  onNext,
  onPause,
  onPlay,
  onPrev,
  onSlideSelect,
  showControls,
}: HeroCarouselModeProps) {
  const currentBanner = banners[currentSlide];

  // Guard check: return null if currentBanner is undefined
  if (!currentBanner) {
    return null;
  }

  return (
    <>
      <motion.div
        key={`carousel-${currentSlide}`}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-4/3"
      >
        {currentBanner.type === "video" && currentBanner.videoUrl ? (
          <video
            className="h-full w-full object-cover"
            controls={showControls}
            preload="metadata"
            poster={currentBanner.imageUrl}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onEnded}
          >
            <source src={currentBanner.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>

      {/* Carousel Controls */}
      {banners.length > 1 && showControls && (
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-10">
          <button
            onClick={onPrev}
            className="pointer-events-auto rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={onNext}
            className="pointer-events-auto rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Carousel Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => onSlideSelect(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
