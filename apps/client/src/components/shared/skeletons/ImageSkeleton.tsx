import { cn } from "@repo/utils/cn";

interface ImageSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function ImageSkeleton({
  className,
  height = "h-48",
  width = "w-full",
}: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 rounded-md animate-pulse",
        width,
        height,
        className,
      )}
      aria-label="Loading image"
      role="status"
    />
  );
}
