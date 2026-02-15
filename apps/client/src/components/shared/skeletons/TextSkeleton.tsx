import { cn } from "@repo/utils/cn";

interface TextSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function TextSkeleton({
  className,
  height = "h-4",
  width = "w-full",
}: TextSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 rounded animate-pulse",
        width,
        height,
        className,
      )}
      aria-label="Loading text"
      role="status"
    />
  );
}
