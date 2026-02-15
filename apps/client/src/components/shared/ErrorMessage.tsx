import { cn } from "@repo/utils/cn";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  className?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  className,
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "border border-destructive/50 bg-destructive/10 rounded-md p-6",
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-4">
          <p className="text-destructive font-medium">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-destructive/50 text-destructive hover:bg-destructive/20"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
