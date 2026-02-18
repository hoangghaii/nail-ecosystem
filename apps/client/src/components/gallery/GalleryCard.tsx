import type { Service } from "@repo/types/service";

import { Clock, DollarSign, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { GalleryItem } from "@/types";

import { LazyImage } from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/api/useServices";

type GalleryCardProps = {
  index: number;
  item: GalleryItem;
  onImageClick?: () => void;
};

export function GalleryCard({ index, item, onImageClick }: GalleryCardProps) {
  const navigate = useNavigate();

  // Fetch active services for matching
  const { data: services = [] } = useServices({ isActive: true });

  // Detect touch device
  const isTouchDevice = "ontouchstart" in window;

  const handleBookNow = () => {
    // Match service by category
    const matchedService = services.find(
      (service: Service) => service.category === item.category
    );

    // Validate service found
    if (!matchedService) {
      toast.error(
        "Không tìm thấy dịch vụ phù hợp. Vui lòng liên hệ với chúng tôi."
      );
      return;
    }

    // Navigate with matched service
    navigate("/booking", {
      state: {
        fromGallery: true,
        galleryItem: item,
        service: matchedService,
      },
    });
  };

  const handleSaveDesign = () => {
    // Placeholder for save design functionality (Phase 7 or future)
    toast.info("Chức năng lưu thiết kế đang được phát triển");
    // Future: Add to favorites, localStorage, or API
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
      className="group flex h-full flex-col rounded-2xl border-2 border-secondary bg-card p-2 transition-colors duration-200 hover:border-primary md:rounded-[20px]"
    >
      {/* Image with hover effects */}
      <div
        className="gallery-card relative mb-3 cursor-pointer overflow-hidden rounded-sm md:mb-4 md:rounded-2xl"
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
        <LazyImage
          alt={item.title}
          className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          src={item.imageUrl}
          placeholderClassName="rounded-[12px] md:rounded-[16px]"
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

        {/* Quick action buttons - appear on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
          <Button
            size="icon"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm"
            aria-label="Lưu thiết kế này"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveDesign();
            }}
          >
            <Heart className="size-4" />
          </Button>
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
        <div className="flex justify-between items-center gap-3 mb-3 space-y-2 md:mb-4">
          {item.price && (
            <div className="flex flex-1 mb-0 items-center gap-2 rounded-sm border border-border bg-primary/5 p-2 md:p-2.5">
              <DollarSign className="size-4 text-primary" />
              <span className="font-sans text-sm font-semibold text-primary md:text-base">
                {item.price}
              </span>
            </div>
          )}

          {item.duration && (
            <div className="flex flex-1 items-center gap-2 rounded-sm border border-border bg-secondary/10 p-2 md:p-2.5">
              <Clock className="size-4 text-secondary" />
              <span className="font-sans text-sm font-foreground md:text-base">
                {item.duration}
              </span>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <Button
          className="w-full rounded-sm mt-auto text-sm md:text-base"
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
