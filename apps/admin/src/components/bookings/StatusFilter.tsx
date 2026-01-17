import type { BookingStatus as BookingStatusType } from "@repo/types/booking";

import { BookingStatus } from "@repo/types/booking";

import { Button } from "@/components/ui/button";

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

        return (
          <Button
            key={status}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className="gap-2"
          >
            {STATUS_LABELS[status]}
          </Button>
        );
      })}
    </div>
  );
}
