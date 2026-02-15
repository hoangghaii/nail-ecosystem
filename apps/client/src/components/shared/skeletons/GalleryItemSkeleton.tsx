import { cn } from "@repo/utils/cn";

interface GalleryItemSkeletonProps {
  className?: string;
}

export function GalleryItemSkeleton({ className }: GalleryItemSkeletonProps) {
  return (
    <div
      className={cn(
        "aspect-square bg-muted/50 rounded-md border border-border animate-pulse",
        className,
      )}
      aria-label="Loading gallery item"
      role="status"
    />
  );
}
