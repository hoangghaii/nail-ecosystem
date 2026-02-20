import { CalendarCheck, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { GalleryItem } from "@/types";
import type { ServicesNavigationState } from "@/types/navigation";

import { Button } from "../ui/button";

type GalleryCardProps = {
  index: number;
  item: GalleryItem;
  onImageClick?: () => void;
};

export function GalleryCard({ index, item, onImageClick }: GalleryCardProps) {
  const navigate = useNavigate();
  const [touchOverlayVisible, setTouchOverlayVisible] = useState(false);

  // Detect touch device once per render
  const isTouchDevice = "ontouchstart" in window;

  const handleBookNow = () => {
    navigate("/services", {
      state: { fromGallery: true, galleryItem: item } satisfies ServicesNavigationState,
    });
  };

  const handleCardClick = () => {
    if (isTouchDevice) {
      // Toggle overlay on touch devices (Pinterest mobile behavior)
      setTouchOverlayVisible((v) => !v);
    } else {
      onImageClick?.();
    }
  };

  // Overlay visibility: CSS hover on desktop, state on touch
  const overlayClass = isTouchDevice
    ? touchOverlayVisible
      ? "opacity-100"
      : "opacity-0"
    : "opacity-0 group-hover:opacity-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        damping: 30,
        delay: (index % 12) * 0.04,
        stiffness: 300,
        type: "spring",
      }}
    >
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <img
          alt={item.title}
          src={item.imageUrl}
          loading="lazy"
          className="block h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Dusty rose overlay - only on non-touch devices */}
        {!isTouchDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.4 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-primary pointer-events-none rounded-sm md:rounded-2xl"
          />
        )}

        {/* Hover / touch overlay */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${overlayClass}`}
        >

          {/* Quick action buttons - appear on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="sm"
              variant="default"
              className="shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick?.();
              }}
            >
              Xem Chi Tiết
            </Button>
          </div>

          {/* Title + description — bottom area */}
          <div className="absolute left-3 right-14 bottom-3">
            <h3 className="line-clamp-1 font-serif text-sm font-semibold text-white">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-0.5 line-clamp-2 font-sans text-xs text-white/70">
                {item.description}
              </p>
            )}
          </div>

          {/* Action strip — bottom-right, vertical */}
          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
            <span className="font-sans text-xs font-semibold text-white">
              {item.price || "$30"} 
            </span>
          
            <span className="flex items-center gap-0.5 font-sans text-xs text-white/80">
              <Clock className="size-3" />
              {item.duration|| "2hrs"} 
            </span>

            <button
              title="Đặt lịch ngay"
              type="button"
              aria-label="Đặt lịch ngay"
              className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-white"
              onClick={(e) => {
                e.stopPropagation();
                handleBookNow();
              }}
            >
              <CalendarCheck className="size-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
