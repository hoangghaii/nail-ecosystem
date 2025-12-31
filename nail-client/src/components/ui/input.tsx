import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // Base styles - no shadows, border-based design
          "w-full rounded-[12px] border border-border bg-background px-4 py-3 font-sans text-foreground",
          // Transitions
          "transition-colors duration-200",
          // Focus state
          "focus:border-primary focus:outline-none",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Invalid/error state
          "aria-invalid:border-destructive aria-invalid:focus:border-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
