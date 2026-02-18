import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Clock, DollarSign, X } from "lucide-react";
import { motion } from "motion/react";

import type { GalleryItem } from "@/types";

import { Button } from "@/components/ui/button";

type GalleryModalDetailsPanelProps = {
  item: GalleryItem;
  onBookDesign: () => void;
};

export function GalleryModalDetailsPanel({
  item,
  onBookDesign,
}: GalleryModalDetailsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        damping: 30,
        delay: 0.1,
        stiffness: 300,
        type: "spring",
      }}
      className="flex flex-col overflow-y-auto p-6 md:w-[45%] md:p-8 lg:p-10"
    >
      {/* Close Button */}
      <div className="mb-4 flex justify-end">
        <DialogPrimitive.Close
          className="rounded-[10px] border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Đóng"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </div>

      {/* Title */}
      <DialogPrimitive.Title
        id="gallery-modal-title"
        className="mb-3 font-serif text-2xl font-semibold text-foreground md:text-3xl"
      >
        {item.title}
      </DialogPrimitive.Title>

      {/* Description */}
      {item.description && (
        <p className="mb-6 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
          {item.description}
        </p>
      )}

      {/* Metadata */}
      {(item.price || item.duration) && (
        <div className="mb-6 space-y-3 border-t border-b border-border py-5">
          {item.price && (
            <div className="flex items-center gap-3 rounded-[12px] border border-border bg-primary/5 px-3 py-2.5">
              <DollarSign className="size-4 shrink-0 text-primary" />
              <span className="font-sans text-base font-semibold text-primary">
                {item.price}
              </span>
            </div>
          )}
          {item.duration && (
            <div className="flex items-center gap-3 rounded-[12px] border border-border bg-secondary/10 px-3 py-2.5">
              <Clock className="size-4 shrink-0 text-secondary" />
              <span className="font-sans text-sm text-foreground md:text-base">
                {item.duration}
              </span>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <Button
        size="lg"
        className="mt-auto w-full rounded-[14px]"
        onClick={onBookDesign}
      >
        Đặt Lịch Theo Mẫu Này
      </Button>
    </motion.div>
  );
}
