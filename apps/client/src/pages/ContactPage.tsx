import { motion } from "motion/react";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfoDisplay } from "@/components/contact/contact-info-display";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { useBusinessInfo } from "@/hooks/api/useBusinessInfo";
import { useContactPage } from "@/hooks/useContactPage";
import { getTransition, pageVariants } from "@/utils/animations";
import { transformBusinessInfo } from "@/utils/businessInfo";

export function ContactPage() {
  useContactPage();

  // Fetch business info from API
  const { data: businessInfoData, error, isLoading } = useBusinessInfo();

  // Transform data for display
  const displayData = businessInfoData
    ? transformBusinessInfo(businessInfoData)
    : null;

  const contactInfo = displayData?.contactInfo;
  const businessHours = displayData?.businessHours;

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        animate="animate"
        className="min-h-screen bg-background"
        exit="exit"
        initial="initial"
        transition={getTransition(0.4)}
        variants={pageVariants}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="font-sans text-base text-muted-foreground">
                Đang tải thông tin...
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error || !displayData || !contactInfo || !businessHours) {
    return (
      <motion.div
        animate="animate"
        className="min-h-screen bg-background"
        exit="exit"
        initial="initial"
        transition={getTransition(0.4)}
        variants={pageVariants}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="font-sans text-lg text-foreground mb-2">
                Không thể tải thông tin liên hệ
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate="animate"
      className="min-h-screen bg-background"
      exit="exit"
      initial="initial"
      transition={getTransition(0.4)}
      variants={pageVariants}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Breadcrumb />
        <PageHeader
          subtitle="Bạn có câu hỏi hoặc sẵn sàng đặt lịch? Chúng tôi rất muốn nghe từ bạn."
          title="Liên Hệ Với Chúng Tôi"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ContactInfoDisplay
            contactInfo={contactInfo}
            businessHours={businessHours}
          />

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </motion.div>
  );
}
