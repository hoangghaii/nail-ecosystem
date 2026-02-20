import { cn } from "@repo/utils/cn";

interface GalleryItemSkeletonProps {
  className?: string;
  index?: number;
}

const SKELETON_HEIGHTS = ["h-72", "h-56", "h-44"] as const;

export function GalleryItemSkeleton({ className, index }: GalleryItemSkeletonProps) {
  const heightClass =
    index !== undefined ? SKELETON_HEIGHTS[index % 3] : "h-64";

  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/50",
        heightClass,
        className,
      )}
      aria-label="Loading gallery item"
      role="status"
    />
  );
}
