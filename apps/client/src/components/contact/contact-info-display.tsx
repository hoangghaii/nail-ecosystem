import { cn } from "@repo/utils/cn";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getBusinessStatus } from "@/utils/business-hours";

interface ContactInfoDisplayProps {
  businessHours: Array<{
    close: string;
    closed: boolean;
    day: string;
    open: string;
  }>;
  contactInfo: {
    address: {
      city?: string;
      full?: string;
      state?: string;
      street?: string;
      zip?: string;
    };
    email: string;
    phone: string;
  };
}

const iconContainerClass =
  "flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center";

export function ContactInfoDisplay({
  businessHours,
  contactInfo,
}: ContactInfoDisplayProps) {
  const { isOpen, message } = getBusinessStatus();

  return (
    <div className="space-y-8">
      {/* Contact Details Card */}
      <div className="rounded-[24px] border border-border bg-card p-8">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
          Thông Tin Liên Hệ
        </h2>

        <div className="space-y-6">
          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className={iconContainerClass}>
              <Phone className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-muted-foreground mb-1">
                Điện Thoại
              </p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="font-sans text-base text-foreground hover:text-primary transition-colors"
              >
                {contactInfo.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className={iconContainerClass}>
              <Mail className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-muted-foreground mb-1">
                Email
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="font-sans text-base text-foreground hover:text-primary transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className={iconContainerClass}>
              <MapPin className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-muted-foreground mb-1">
                Địa Chỉ
              </p>
              <address className="font-sans text-base text-foreground not-italic">
                {contactInfo.address.street && (
                  <>
                    {contactInfo.address.street}
                    <br />
                  </>
                )}
                {contactInfo.address.city &&
                contactInfo.address.state &&
                contactInfo.address.zip ? (
                  <>
                    {contactInfo.address.city}, {contactInfo.address.state}{" "}
                    {contactInfo.address.zip}
                  </>
                ) : (
                  contactInfo.address.full
                )}
              </address>
            </div>
          </div>

          {/* Hours with real-time status */}
          <div className="flex items-start gap-4">
            <div className={iconContainerClass}>
              <Clock className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-sans text-sm font-medium text-muted-foreground">
                  Giờ Làm Việc
                </p>
                {/* Real-time open/closed badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isOpen ? "bg-green-500" : "bg-red-500",
                    )}
                  />
                  {message}
                </span>
              </div>
              <div className="space-y-1">
                {businessHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex justify-between items-center w-full gap-4 font-sans text-sm text-foreground"
                  >
                    <span>{schedule.day}</span>
                    <span className="text-muted-foreground">
                      {schedule.closed
                        ? "Đóng Cửa"
                        : `${schedule.open} - ${schedule.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Book CTA */}
      <div className="rounded-[24px] border border-border bg-primary p-8 text-primary-foreground">
        <h3 className="font-serif text-2xl font-semibold mb-3">
          Sẵn Sàng Đặt Lịch?
        </h3>
        <p className="font-sans text-base opacity-90 mb-6">
          Đặt lịch hẹn trực tuyến và nhận xác nhận ngay lập tức.
        </p>
        <Link to="/booking" className="block">
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground rounded-full"
          >
            Đặt Lịch Hẹn
          </Button>
        </Link>
      </div>
    </div>
  );
}
