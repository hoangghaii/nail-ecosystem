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
    isValidState, // Will be used in Phase 4 for error handling
    onSubmit,
    selectedService,
    steps,
    timeSlots,
  } = useBookingPage();

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("timeSlot");

  // Show loading while validating/redirecting
  if (!isValidState || !selectedService) {
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

        {/* Selected Service Summary */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-[24px] border-2 border-primary bg-primary/5 p-6"
          >
            <p className="mb-3 font-sans text-sm font-medium text-muted-foreground">
              Dịch Vụ Đã Chọn
            </p>

            <div className="flex items-start gap-4">
              {selectedService.imageUrl && (
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.name}
                  className="h-20 w-20 rounded-[12px] object-cover"
                />
              )}

              <div className="flex-1">
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                  {selectedService.name}
                </h3>

                <div className="flex flex-wrap gap-4 font-sans text-sm">
                  <span className="font-bold text-primary">
                    ${selectedService.price}
                  </span>
                  <span className="text-muted-foreground">
                    {selectedService.duration} phút
                  </span>
                </div>

                {selectedService.description && (
                  <p className="mt-2 font-sans text-sm text-muted-foreground">
                    {selectedService.description}
                  </p>
                )}
              </div>
            </div>

            {/* Optional: Change Service Link */}
            <div className="mt-4 border-t border-border pt-4">
              <Link
                to="/services"
                className="font-sans text-sm text-secondary hover:underline"
              >
                ← Thay đổi dịch vụ
              </Link>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center",
                    step.id === 2 ? "" : "flex-1",
                  )}
                >
                  <div className="flex flex-col items-center">
                    {/* Step Circle */}
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor:
                          isCompleted || isCurrent
                            ? "var(--color-primary)"
                            : "var(--color-card)",
                        borderColor:
                          isCompleted || isCurrent
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                      }}
                      transition={{
                        damping: 30,
                        stiffness: 300,
                        type: "spring",
                      }}
                      className="flex size-12 items-center justify-center rounded-[12px] border-2"
                    >
                      {isCompleted ? (
                        <Check className="size-6 text-primary-foreground" />
                      ) : (
                        <Icon
                          className={`size-6 ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"}`}
                        />
                      )}
                    </motion.div>

                    {/* Step Title */}
                    <span
                      className={`mt-2 hidden font-sans text-sm font-medium sm:block ${
                        isCurrent || isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor:
                          currentStep > step.id
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                      }}
                      transition={{
                        damping: 30,
                        stiffness: 300,
                        type: "spring",
                      }}
                      className="mx-2 h-0.5 flex-1"
                    />
                  )}
                </div>
              );
            })}
          </div>
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

                {/* Selected Service Summary */}
                {selectedService && (
                  <div className="mb-6 space-y-4">
                    {/* Gallery Item Preview (if coming from gallery) */}
                    {galleryItem && (
                      <div className="rounded-[16px] border-2 border-secondary bg-card p-3">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={galleryItem.imageUrl}
                              alt={galleryItem.title}
                              className="h-20 w-20 rounded-[12px] object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="mb-1 font-sans text-xs text-muted-foreground">
                              Thiết Kế Đã Chọn
                            </p>
                            <h4 className="mb-1 font-serif text-base font-semibold text-foreground">
                              {galleryItem.title}
                            </h4>
                            {galleryItem.description && (
                              <p className="font-sans text-xs text-muted-foreground">
                                {galleryItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Service Summary */}
                    <div className="rounded-[12px] border border-border bg-background p-4">
                      <p className="mb-1 font-sans text-sm text-muted-foreground">
                        Dịch Vụ Đã Chọn
                      </p>
                      <p className="font-sans text-lg font-semibold text-foreground">
                        {selectedService.name} - ${selectedService.price}
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
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                            {timeSlots.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => handleTimeSelect(time)}
                                className={`rounded-[8px] border px-3 py-2 font-sans text-sm font-medium transition-all duration-200 ${
                                  selectedTime === time
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-foreground hover:border-secondary"
                                }`}
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
                            Email *
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
              className="rounded-[12px] flex-shrink-0"
            >
              <ChevronLeft className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Quay Lại</span>
            </Button>

            {currentStep < 2 ? (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-[12px] flex-1 sm:flex-initial"
              >
                <span className="sm:inline">Tiếp Theo</span>
                <ChevronRight className="size-4 sm:size-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={onSubmit}
                disabled={!canProceed() || isPending}
                className="rounded-[12px] flex-1 sm:flex-initial text-xs sm:text-base"
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
