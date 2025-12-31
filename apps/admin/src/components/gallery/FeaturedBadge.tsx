import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeaturedBadgeProps = {
  className?: string;
};

export function FeaturedBadge({ className }: FeaturedBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-xs font-medium text-warning-foreground",
        className,
      )}
    >
      <Star className="h-3 w-3 fill-current" />
      Featured
    </div>
  );
}
