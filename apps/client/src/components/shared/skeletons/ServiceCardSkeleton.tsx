import { ImageSkeleton } from "./ImageSkeleton";
import { TextSkeleton } from "./TextSkeleton";

export function ServiceCardSkeleton() {
  return (
    <div
      className="border border-border rounded-md p-6 space-y-4"
      aria-label="Loading service"
      role="status"
    >
      {/* Image placeholder */}
      <ImageSkeleton height="h-48" />

      {/* Title placeholder */}
      <TextSkeleton width="w-3/4" height="h-6" />

      {/* Description placeholders (2 lines) */}
      <div className="space-y-2">
        <TextSkeleton width="w-full" height="h-4" />
        <TextSkeleton width="w-5/6" height="h-4" />
      </div>

      {/* Price placeholder */}
      <TextSkeleton width="w-1/4" height="h-5" />
    </div>
  );
}
