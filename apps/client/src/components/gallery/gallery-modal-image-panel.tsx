import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

type GalleryModalImagePanelProps = {
  alt: string;
  hasNext: boolean;
  hasPrevious: boolean;
  imageUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function GalleryModalImagePanel({
  alt,
  hasNext,
  hasPrevious,
  imageUrl,
  onNext,
  onPrevious,
}: GalleryModalImagePanelProps) {
  return (
    <div className="relative md:w-[55%] flex-shrink-0 overflow-hidden bg-muted">
      <div className="relative h-64 md:h-full">
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-cover"
        />

        {hasPrevious && onPrevious && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-[10px] border border-border bg-background/90 p-2 text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:bg-card"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="size-5" />
          </motion.button>
        )}

        {hasNext && onNext && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[10px] border border-border bg-background/90 p-2 text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:bg-card"
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight className="size-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
