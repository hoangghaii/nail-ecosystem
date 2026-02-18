import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { getTransition, tapScale } from "@/utils/animations";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[16px] font-sans font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "h-12 px-6 py-3 text-base has-[>svg]:px-5",
        icon: "size-12",
        "icon-lg": "size-14",
        "icon-sm": "size-10",
        lg: "h-14 px-8 py-4 text-lg has-[>svg]:px-6",
        sm: "h-10 px-4 py-2 text-sm has-[>svg]:px-3",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground",
        pill: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      },
    },
  },
);

type ButtonProps = {
  asChild?: boolean;
} & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({ asChild = false, className, size, variant, ...props }: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ className, size, variant }))}
        {...props}
      />
    );
  }

  // Cast props to motion props, excluding conflicting event handlers
  const motionProps = props as unknown as HTMLMotionProps<"button">;

  return (
    <motion.button
      data-slot="button"
      className={cn(buttonVariants({ className, size, variant }))}
      whileTap={tapScale}
      transition={getTransition(0.15)}
      {...motionProps}
    />
  );
}

export { Button, buttonVariants };
