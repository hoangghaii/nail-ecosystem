import type { Banner } from "@repo/types/banner";

import { motion } from "motion/react";

interface HeroVideoModeProps {
  banner: Banner;
  onEnded: () => void;
  onPause: () => void;
  onPlay: () => void;
  showControls: boolean;
}

export function HeroVideoMode({
  banner,
  onEnded,
  onPause,
  onPlay,
  showControls,
}: HeroVideoModeProps) {
  if (!banner.videoUrl) {
    return (
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="aspect-4/3 h-auto w-full object-cover"
      />
    );
  }

  return (
    <motion.video
      key="video"
      className="aspect-4/3 h-auto w-full object-cover"
      controls={showControls}
      preload="metadata"
      poster={banner.imageUrl}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <source src={banner.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </motion.video>
  );
}
