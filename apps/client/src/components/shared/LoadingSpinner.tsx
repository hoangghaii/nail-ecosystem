import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  lg: "h-8 w-8",
  md: "h-6 w-6",
  sm: "h-4 w-4",
};

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={`animate-spin text-accent ${sizeMap[size]}`}
        aria-label="Loading"
      />
    </div>
  );
}
