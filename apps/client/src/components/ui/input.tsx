import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // Base styles
          "w-full rounded-[12px] border-2 border-border bg-background/80 px-4 py-3 h-12 text-base font-sans text-foreground",
          // Transitions
          "transition-all duration-200",
          // Focus state
          "focus:border-primary focus:bg-background focus:outline-none",
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
