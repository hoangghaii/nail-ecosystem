import type { BookingStatus as BookingStatusType } from "@/types/booking.types";

import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking.types";

export type StatusFilterProps = {
  activeStatus: BookingStatusType | "all";
  onStatusChange: (status: BookingStatusType | "all") => void;
  statusCounts?: Record<BookingStatusType | "all", number>;
};

const STATUS_LABELS: Record<BookingStatusType | "all", string> = {
  all: "All",
  [BookingStatus.CANCELLED]: "Cancelled",
  [BookingStatus.COMPLETED]: "Completed",
  [BookingStatus.CONFIRMED]: "Confirmed",
  [BookingStatus.PENDING]: "Pending",
};

export function StatusFilter({
  activeStatus,
  onStatusChange,
  statusCounts,
}: StatusFilterProps) {
  const statuses: Array<BookingStatusType | "all"> = [
    "all",
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const isActive = activeStatus === status;
        const count = statusCounts?.[status];

        return (
          <Button
            key={status}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className="gap-2"
          >
            {STATUS_LABELS[status]}
            {count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
