import { cva, type VariantProps } from "class-variance-authority";
import {
  Archive,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  MailCheck,
  MailOpen,
  Star,
  X,
  XCircle,
} from "lucide-react";
import * as React from "react";

import type { BookingStatus } from "@/types/booking.types";
import type { ContactStatus } from "@/types/contact.types";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    defaultVariants: {
      status: "active",
      variant: "default",
    },
    variants: {
      status: {
        active: "",
        archived: "",
        cancelled: "",
        completed: "",
        confirmed: "",
        inactive: "",
        new: "",
        pending: "",
        primary: "",
        read: "",
        responded: "",
      },
      variant: {
        booking: "",
        contact: "",
        default: "",
        outline: "border",
      },
    },
  },
);

export type StatusBadgeProps = {
  className?: string;
  isPrimary?: boolean;
  status?: "active" | "inactive" | BookingStatus | ContactStatus;
  variant?: "default" | "outline" | "booking" | "contact";
} & React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants>;

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      className,
      isPrimary = false,
      status = "active",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const getStatusStyles = () => {
      // Contact status variants
      if (variant === "contact") {
        if (status === "new") {
          return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700";
        }
        if (status === "read") {
          return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700";
        }
        if (status === "responded") {
          return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700";
        }
        if (status === "archived") {
          return "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700";
        }
      }

      // Booking status variants
      if (variant === "booking") {
        if (status === "pending") {
          return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700";
        }
        if (status === "confirmed") {
          return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700";
        }
        if (status === "completed") {
          return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700";
        }
        if (status === "cancelled") {
          return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700";
        }
      }

      // Banner status variants
      if (isPrimary) {
        return variant === "outline"
          ? "border-primary text-primary bg-primary/10"
          : "bg-primary text-primary-foreground";
      }

      if (status === "active") {
        return variant === "outline"
          ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
          : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
      }

      return variant === "outline"
        ? "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20"
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    };

    const getIcon = () => {
      if (variant === "contact") {
        if (status === "new") return <Mail className="h-3 w-3" />;
        if (status === "read") return <MailOpen className="h-3 w-3" />;
        if (status === "responded") return <MailCheck className="h-3 w-3" />;
        if (status === "archived") return <Archive className="h-3 w-3" />;
      }

      if (variant === "booking") {
        if (status === "pending") return <Clock className="h-3 w-3" />;
        if (status === "confirmed") return <CheckCircle2 className="h-3 w-3" />;
        if (status === "completed")
          return <CheckCircle2 className="h-3 w-3 fill-current" />;
        if (status === "cancelled") return <XCircle className="h-3 w-3" />;
      }

      if (isPrimary) {
        return <Star className="h-3 w-3" />;
      }
      if (status === "active") {
        return <Check className="h-3 w-3" />;
      }
      return <X className="h-3 w-3" />;
    };

    const getLabel = () => {
      if (variant === "contact") {
        if (status === "new") return "New";
        if (status === "read") return "Read";
        if (status === "responded") return "Responded";
        if (status === "archived") return "Archived";
      }

      if (variant === "booking") {
        if (status === "pending") return "Pending";
        if (status === "confirmed") return "Confirmed";
        if (status === "completed") return "Completed";
        if (status === "cancelled") return "Cancelled";
      }

      if (isPrimary) return "Primary";
      return status === "active" ? "Active" : "Inactive";
    };

    return (
      <span
        ref={ref}
        className={cn(
          statusBadgeVariants({ status, variant }),
          getStatusStyles(),
          className,
        )}
        {...props}
      >
        {getIcon()}
        {getLabel()}
      </span>
    );
  },
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
