import { Clock, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import type { GalleryItem } from "@/types";

import { Button } from "@/components/ui/button";

type GalleryCardProps = {
  index: number;
  item: GalleryItem;
  onImageClick?: () => void;
};

export function GalleryCard({ index, item, onImageClick }: GalleryCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Navigate to booking page with gallery item data
    navigate("/booking", {
      state: {
        fromGallery: true,
        galleryItem: item,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        damping: 30,
        delay: index * 0.05,
        stiffness: 300,
        type: "spring",
      }}
      className="group flex h-full flex-col rounded-[16px] border-2 border-secondary bg-card p-2 transition-colors duration-200 hover:border-primary md:rounded-[20px]"
    >
      {/* Gold-framed image */}
      <div
        className="relative mb-3 cursor-pointer overflow-hidden rounded-[12px] md:mb-4 md:rounded-[16px]"
        onClick={onImageClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onImageClick?.();
          }
        }}
      >
        <img
          alt={item.title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-80"
          src={item.imageUrl}
        />
        {/* Hover overlay hint */}
        <div className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-foreground/0 opacity-0 transition-all duration-200 group-hover:bg-foreground/10 group-hover:opacity-100 md:rounded-[16px]">
          <span className="rounded-[8px] border border-background bg-background/90 px-2 py-1 font-sans text-xs font-medium text-foreground md:px-3 md:py-1.5">
            Nhấn để xem
          </span>
        </div>
      </div>

      {/* Content area - grows to fill space */}
      <div className="flex flex-1 flex-col px-1.5 md:px-2">
        {/* Title */}
        <h3 className="mb-1.5 font-serif text-lg font-semibold text-foreground md:mb-2 md:text-xl">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="mb-3 flex-1 font-sans text-sm leading-relaxed text-muted-foreground md:mb-4">
            {item.description}
          </p>
        )}

        {/* Price and Duration - Separate rows with different backgrounds */}
        <div className="mb-3 space-y-2 md:mb-4">
          {item.price && (
            <div className="flex items-center gap-2 rounded-[12px] border border-border bg-primary/5 p-2 md:p-2.5">
              <DollarSign className="size-4 text-primary" />
              <span className="font-sans text-sm font-semibold text-primary md:text-base">
                {item.price}
              </span>
            </div>
          )}

          {item.duration && (
            <div className="flex items-center gap-2 rounded-[12px] border border-border bg-secondary/10 p-2 md:p-2.5">
              <Clock className="size-4 text-secondary" />
              <span className="font-sans text-sm font-foreground md:text-base">
                {item.duration}
              </span>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <Button
          className="w-full rounded-[12px] text-sm md:text-base"
          onClick={handleBookNow}
          size="default"
          variant="default"
        >
          Đặt Lịch Ngay
        </Button>
      </div>
    </motion.div>
  );
}
