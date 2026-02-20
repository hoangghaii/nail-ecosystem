import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { GalleryItem } from "@/types";
import type { ServicesNavigationState } from "@/types/navigation";

import { GalleryModalDetailsPanel } from "./gallery-modal-details-panel";
import { GalleryModalImagePanel } from "./gallery-modal-image-panel";

type GalleryDetailModalProps = {
  hasNext?: boolean;
  hasPrevious?: boolean;
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function GalleryDetailModal({
  hasNext = false,
  hasPrevious = false,
  isOpen,
  item,
  onClose,
  onNext,
  onPrevious,
}: GalleryDetailModalProps) {
  const navigate = useNavigate();

  // Arrow key navigation (restores behaviour from ImageLightbox)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft" && hasPrevious && onPrevious) onPrevious();
      else if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious]);

  const handleBookDesign = () => {
    if (!item) return;
    navigate("/services", {
      state: { fromGallery: true, galleryItem: item } satisfies ServicesNavigationState,
    });
    onClose();
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal forceMount>
        <AnimatePresence>
          {isOpen && item && (
            <>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  key="gallery-modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm"
                />
              </DialogPrimitive.Overlay>

              <DialogPrimitive.Content asChild>
                <motion.div
                  key="gallery-modal-content"
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ damping: 30, stiffness: 300, type: "spring" }}
                  className="fixed left-1/2 top-1/2 z-50 flex max-h-[70vh] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-border bg-background shadow-2xl md:h-[65vh] md:max-w-5xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Accessibility: sr-only title required by Radix DialogContent */}
                  <DialogPrimitive.Title className="sr-only">
                    {item.title}
                  </DialogPrimitive.Title>
                  <div className="flex flex-col md:flex-row md:h-full">
                    <GalleryModalImagePanel
                      alt={item.title}
                      hasNext={hasNext}
                      hasPrevious={hasPrevious}
                      imageUrl={item.imageUrl}
                      onNext={onNext}
                      onPrevious={onPrevious}
                    />
                    <GalleryModalDetailsPanel
                      item={item}
                      onBookDesign={handleBookDesign}
                    />
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
