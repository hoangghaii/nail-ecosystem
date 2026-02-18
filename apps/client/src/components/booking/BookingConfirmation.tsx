import { useEffect } from "react";

import type { Booking } from "@repo/types/booking";

import { cn } from "@repo/utils/cn";
import { motion } from "motion/react";
import { Check, Calendar, Clock, User, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { celebrateBooking } from "@/utils/confetti";

interface BookingConfirmationProps {
  booking: Booking;
  className?: string;
  onClose: () => void;
  serviceName?: string;
}

export function BookingConfirmation({
  booking,
  className,
  onClose,
  serviceName,
}: BookingConfirmationProps) {
  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
      celebrateBooking();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "border-2 border-green-500/50 bg-green-50/50 rounded-[24px] p-6 sm:p-8 space-y-6",
        className
      )}
    >
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center size-16 rounded-full bg-green-500">
          <Check className="size-8 text-white" />
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Đặt Lịch Thành Công!
        </h2>
        <p className="text-muted-foreground">
          Chúng tôi sẽ liên hệ với bạn sớm để xác nhận lịch hẹn.
        </p>
      </div>

      {/* Booking Details */}
      <div className="space-y-4">
        {serviceName && (
          <div className="flex items-start gap-3 p-4 rounded-[12px] border border-border bg-background">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Dịch Vụ</p>
              <p className="font-semibold text-foreground">{serviceName}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-4 rounded-[12px] border border-border bg-background">
          <Calendar className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Ngày Hẹn</p>
            <p className="font-semibold text-foreground capitalize">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-[12px] border border-border bg-background">
          <Clock className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Giờ Hẹn</p>
            <p className="font-semibold text-foreground">
              {typeof booking.timeSlot === "string"
                ? booking.timeSlot
                : booking.timeSlot.time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-[12px] border border-border bg-background">
          <User className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Thông Tin Khách Hàng</p>
            <p className="font-semibold text-foreground">
              {booking.customerInfo.firstName} {booking.customerInfo.lastName}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                <span>{booking.customerInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                <span>{booking.customerInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="p-4 rounded-[12px] border border-border bg-background">
            <p className="text-sm text-muted-foreground mb-1">Ghi Chú</p>
            <p className="text-foreground">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" onClick={onClose} className="flex-1 rounded-full">
          Đặt Lịch Khác
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => (window.location.href = "/")}
          className="flex-1 rounded-full"
        >
          Về Trang Chủ
        </Button>
      </div>
    </motion.div>
  );
}
