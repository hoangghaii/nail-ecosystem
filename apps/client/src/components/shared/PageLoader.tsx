import { Loader2 } from "lucide-react";

/**
 * Full-page loading fallback for React.lazy / Suspense boundaries.
 */
export function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      aria-label="Đang tải trang..."
      role="status"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-primary"
        aria-hidden="true"
      />
    </div>
  );
}
