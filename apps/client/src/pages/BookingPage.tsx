import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";

import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBookingPage } from "@/hooks/useBookingPage";
import { cn } from "@/lib/utils";
import { getTransition, pageVariants } from "@/utils/animations";

export function BookingPage() {
  const {
    bookingResult,
    canProceed,
    currentStep,
    form,
    galleryItem,
    handleCloseConfirmation,
    handleDateSelect,
    handleNext,
    handlePrevious,
    handleTimeSelect,
    isPending,
    isSuccess,
    isValidState,
    onSubmit,
    selectedService,
    timeSlots,
  } = useBookingPage();

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("timeSlot");

  // Show loading while validating/redirecting
  if (!isValidState) {
    return (
      <motion.div
        animate="animate"
        className="min-h-screen bg-background"
        exit="exit"
        initial="initial"
        transition={getTransition(0.4)}
        variants={pageVariants}
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="ml-3 font-sans text-lg text-muted-foreground">
              Đang chuyển hướng...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show success confirmation
  if (isSuccess && bookingResult) {
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
            subtitle="Xác nhận đặt lịch của bạn"
            title="Đặt Lịch Thành Công"
          />
          <BookingConfirmation
            booking={bookingResult}
            serviceName={selectedService?.name}
            onClose={handleCloseConfirmation}
          />
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
          subtitle="Đặt lịch hẹn chỉ với vài bước đơn giản"
          title="Đặt Lịch Hẹn"
        />

        {/* Booking Item Summary — service (from Services page) or gallery item (from Lookbook) */}
        {(selectedService || galleryItem) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-[24px] border-2 border-primary bg-primary/5 p-6"
          >
            <p className="mb-3 font-sans text-sm font-medium text-muted-foreground">
              {selectedService ? "Dịch Vụ Đã Chọn" : "Thiết Kế Đã Chọn"}
            </p>

            <div className="flex items-start gap-4">
              {(selectedService?.imageUrl ?? galleryItem?.imageUrl) && (
                <img
                  src={selectedService?.imageUrl ?? galleryItem?.imageUrl}
                  alt={selectedService?.name ?? galleryItem?.title}
                  className="h-20 w-20 rounded-sm object-cover"
                />
              )}

              <div className="flex-1">
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                  {selectedService?.name ?? galleryItem?.title}
                </h3>

                <div className="flex flex-wrap gap-4 font-sans text-sm">
                  {selectedService ? (
                    <>
                      <span className="font-bold text-primary">${selectedService.price}</span>
                      <span className="text-muted-foreground">{selectedService.duration} phút</span>
                    </>
                  ) : (
                    <>
                      {galleryItem?.price && (
                        <span className="font-bold text-primary">{galleryItem.price}</span>
                      )}
                      {galleryItem?.duration && (
                        <span className="text-muted-foreground">{galleryItem.duration}</span>
                      )}
                    </>
                  )}
                </div>

                {(selectedService?.description ?? galleryItem?.description) && (
                  <p className="mt-2 font-sans text-sm text-muted-foreground">
                    {selectedService?.description ?? galleryItem?.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <Link
                to="/gallery"
                className="font-sans text-sm text-secondary hover:underline"
              >
                ← Xem Lookbook
              </Link>
            </div>
          </motion.div>
        )}

        {/* Progress Indicator — minimalist dots */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-3 w-3 rounded-full transition-all duration-300",
                  step === currentStep
                    ? "scale-125 bg-primary"
                    : step < currentStep
                      ? "bg-primary/50"
                      : "bg-border",
                )}
              />
              {step < 2 && (
                <div
                  className={cn(
                    "h-0.5 w-8 transition-colors duration-300",
                    step < currentStep ? "bg-primary/50" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="rounded-[24px] border-2 border-border bg-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Date & Time */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ damping: 30, stiffness: 300, type: "spring" }}
              >
                <h3 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                  Chọn Ngày & Giờ
                </h3>

                {/* Booking item summary (service or gallery item) */}
                {(selectedService || galleryItem) && (
                  <div className="mb-6">
                    <div className="rounded-sm border border-border bg-background p-4">
                      <p className="mb-1 font-sans text-sm text-muted-foreground">
                        {selectedService ? "Dịch Vụ Đã Chọn" : "Thiết Kế Đã Chọn"}
                      </p>
                      <p className="font-sans text-lg font-semibold text-foreground">
                        {selectedService
                          ? `${selectedService.name} - $${selectedService.price}`
                          : galleryItem?.title}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="date"
                    render={() => (
                      <FormItem className="mb-6">
                        <FormLabel className="font-sans text-sm font-medium text-foreground">
                          Chọn Ngày
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            date={selectedDate}
                            onSelect={handleDateSelect}
                            placeholder="Chọn ngày hẹn của bạn"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>

                {/* Time Slots */}
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={() => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm font-medium text-foreground">
                          Chọn Giờ
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                            {timeSlots.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => handleTimeSelect(time)}
                                className={cn(
                                  "rounded-sm border-2 px-3 py-2.5 font-sans text-sm font-medium transition-all duration-200",
                                  selectedTime === time
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-card text-foreground hover:border-primary",
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </motion.div>
            )}

            {/* Step 2: Customer Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ damping: 30, stiffness: 300, type: "spring" }}
              >
                <h3 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                  Thông Tin Của Bạn
                </h3>

                <Form {...form}>
                  <div className="space-y-4">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="customerInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-foreground">
                            Tên *
                          </FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="customerInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-foreground">
                            Họ *
                          </FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="customerInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-foreground">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="customerInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-foreground">
                            Số Điện Thoại *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="0123456789"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="rounded-sm shrink-0"
            >
              <ChevronLeft className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Quay Lại</span>
            </Button>

            {currentStep < 2 ? (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-sm flex-1 sm:flex-initial"
              >
                <span className="sm:inline">Tiếp Theo</span>
                <ChevronRight className="size-4 sm:size-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={onSubmit}
                disabled={!canProceed() || isPending}
                className="rounded-sm flex-1 sm:flex-initial text-xs sm:text-base"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 sm:size-5 animate-spin" />
                    <span className="whitespace-nowrap">Đang Xử Lý...</span>
                  </>
                ) : (
                  <>
                    <Check className="size-4 sm:size-5" />
                    <span className="whitespace-nowrap">Xác Nhận Đặt Lịch</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
