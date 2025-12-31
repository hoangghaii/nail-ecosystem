import { Phone, Mail, MapPin, Clock } from "lucide-react";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { contactInfo, businessHours } from "@/data/businessInfo";
import { useContactPage } from "@/hooks/useContactPage";

export function ContactPage() {
  useContactPage();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Breadcrumb />
        <PageHeader
          subtitle="Bạn có câu hỏi hoặc sẵn sàng đặt lịch? Chúng tôi rất muốn nghe từ bạn."
          title="Liên Hệ Với Chúng Tôi"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
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
                      {contactInfo.address.street}
                      <br />
                      {contactInfo.address.city}, {contactInfo.address.state}{" "}
                      {contactInfo.address.zip}
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

          {/* Contact Form */}
          <div className="rounded-[24px] border border-border bg-card p-8">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>

            <form className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-sans text-sm font-medium text-foreground mb-2"
                >
                  Tên Của Bạn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-sm font-medium text-foreground mb-2"
                >
                  Địa Chỉ Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                  placeholder="email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block font-sans text-sm font-medium text-foreground mb-2"
                >
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                  placeholder="0123 456 789"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-sans text-sm font-medium text-foreground mb-2"
                >
                  Tin Nhắn
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all resize-none"
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                Gửi Tin Nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
