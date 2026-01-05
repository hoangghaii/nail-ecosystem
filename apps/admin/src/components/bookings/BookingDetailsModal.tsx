import type { Booking, BookingStatus } from "@repo/types/booking";

import { BookingStatus as BookingStatusEnum } from "@repo/types/booking";
import { format } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/layout/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateBookingStatus } from "@/hooks/api/useBookings";

export type BookingDetailsModalProps = {
  booking?: Booking;
  onClose: () => void;
  open: boolean;
};

export function BookingDetailsModal({
  booking,
  onClose,
  open,
}: BookingDetailsModalProps) {
  const updateStatus = useUpdateBookingStatus();
  const [newStatus, setNewStatus] = useState<BookingStatus>(
    booking?.status || BookingStatusEnum.PENDING,
  );

  // Sync newStatus with booking.status when booking changes or modal opens
  useEffect(() => {
    if (booking?.status) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewStatus(booking.status);
    }
  }, [booking?.status, open]);

  if (!booking) return null;

  const isCancellation =
    booking.status !== BookingStatusEnum.CANCELLED &&
    newStatus === BookingStatusEnum.CANCELLED;

  const hasStatusChanged = newStatus !== booking.status;

  const handleSaveChanges = () => {
    if (!hasStatusChanged || !booking.id) return;

    updateStatus.mutate(
      { id: booking.id, status: newStatus },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            View and manage booking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Current Status
              </p>
              <StatusBadge status={booking.status} variant="booking" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-select">Update Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as BookingStatus)}
              >
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BookingStatusEnum.PENDING}>
                    Pending
                  </SelectItem>
                  <SelectItem value={BookingStatusEnum.CONFIRMED}>
                    Confirmed
                  </SelectItem>
                  <SelectItem value={BookingStatusEnum.COMPLETED}>
                    Completed
                  </SelectItem>
                  <SelectItem value={BookingStatusEnum.CANCELLED}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cancellation Warning */}
            {isCancellation && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Cancellation Warning
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You are about to cancel this booking. This action cannot be
                    easily reversed.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Customer Information</h3>
            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {booking.customerInfo.firstName}{" "}
                    {booking.customerInfo.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${booking.customerInfo.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {booking.customerInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${booking.customerInfo.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {booking.customerInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Appointment Details</h3>
            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">{booking.timeSlot.time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service ID</p>
                <p className="text-sm font-medium">{booking.serviceId}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Notes</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateStatus.isPending}
          >
            Close
          </Button>
          <Button
            variant={isCancellation ? "destructive" : "default"}
            onClick={handleSaveChanges}
            disabled={updateStatus.isPending || !hasStatusChanged}
          >
            {updateStatus.isPending
              ? "Saving..."
              : isCancellation
                ? "Confirm Cancellation"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
