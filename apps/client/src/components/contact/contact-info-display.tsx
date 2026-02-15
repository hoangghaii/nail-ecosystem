import { Phone, Mail, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

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

export function ContactInfoDisplay({
  businessHours,
  contactInfo,
}: ContactInfoDisplayProps) {
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
            <div className="rounded-[12px] bg-muted p-3">
              <Phone className="h-6 w-6 text-primary" />
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
            <div className="rounded-[12px] bg-muted p-3">
              <Mail className="h-6 w-6 text-primary" />
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
            <div className="rounded-[12px] bg-muted p-3">
              <MapPin className="h-6 w-6 text-primary" />
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

          {/* Hours */}
          <div className="flex items-start gap-4">
            <div className="rounded-[12px] bg-muted p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-muted-foreground mb-2">
                Giờ Làm Việc
              </p>
              <div className="space-y-1">
                {businessHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex justify-between gap-4 font-sans text-sm text-foreground"
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
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground"
        >
          Đặt Lịch Hẹn
        </Button>
      </div>
    </div>
  );
}
