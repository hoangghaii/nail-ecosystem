import type { Banner } from "@repo/types/banner";

import { motion } from "motion/react";

interface HeroImageModeProps {
  banner: Banner;
}

export function HeroImageMode({ banner }: HeroImageModeProps) {
  return (
    <motion.img
      key="image"
      src={banner.imageUrl}
      alt={banner.title}
      className="aspect-[4/3] h-auto w-full object-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
