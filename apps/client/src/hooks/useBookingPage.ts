import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, FileText, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import type { GalleryItem, Service } from "@/types";

import { servicesData } from "@/data/services";
import { toast } from "@/lib/toast";
import {
  type BookingFormData,
  bookingFormSchema,
} from "@/lib/validations/booking.validation";

const steps = [
  { icon: FileText, id: 1, title: "Chọn Dịch Vụ" },
  { icon: Calendar, id: 2, title: "Chọn Ngày & Giờ" },
  { icon: User, id: 3, title: "Thông Tin" },
];

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export function useBookingPage() {
  const location = useLocation();

  // Get gallery item from navigation state
  const galleryItem = (location.state as { galleryItem?: GalleryItem })
    ?.galleryItem;

  // Initialize service from gallery state - compute initial values
  const state = location.state as {
    fromGallery?: boolean;
    galleryItem?: GalleryItem;
  } | null;

  const matchingService =
    state?.fromGallery && state.galleryItem
      ? servicesData.find(
          (service) => service.category === state.galleryItem?.category,
        )
      : null;

  const initialServiceId = matchingService?.id ?? "";
  const initialStep = state?.fromGallery && matchingService ? 2 : 1;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedService, setSelectedService] = useState<Service | null>(
    matchingService ?? null,
  );

  // Initialize React Hook Form with Zod validation
  const form = useForm<BookingFormData>({
    defaultValues: {
      customerInfo: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      },
      date: undefined,
      serviceId: initialServiceId,
      timeSlot: "",
    },
    mode: "onChange",
    resolver: zodResolver(bookingFormSchema),
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Scroll to top smoothly when moving to next step
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top smoothly when moving to previous step
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    try {
      // In a real app, this would submit to an API
      console.log("Booking data:", data);

      // Generate unique ID and save to localStorage as a demo
      const bookingId = crypto.randomUUID();
      const booking = {
        ...data,
        id: bookingId,
        status: "pending",
      };
      localStorage.setItem("lastBooking", JSON.stringify(booking));

      // Show success toast
      toast.success(
        "Đặt lịch thành công!",
        `Dịch vụ: ${selectedService?.name} | Ngày: ${data.date.toLocaleDateString("vi-VN")} | Giờ: ${data.timeSlot}`,
      );

      // Reset form
      form.reset();
      setSelectedService(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      toast.error(
        "Có lỗi xảy ra",
        "Vui lòng thử lại hoặc liên hệ với chúng tôi.",
      );
    }
  });

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedService !== null && form.getValues("serviceId") !== "";
    }
    if (currentStep === 2) {
      const date = form.getValues("date");
      const timeSlot = form.getValues("timeSlot");
      return date instanceof Date && timeSlot !== "";
    }
    if (currentStep === 3) {
      const { customerInfo } = form.getValues();
      return (
        customerInfo.firstName !== "" &&
        customerInfo.lastName !== "" &&
        customerInfo.email !== "" &&
        customerInfo.phone !== ""
      );
    }
    return false;
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    form.setValue("serviceId", service.id, { shouldValidate: true });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", date, { shouldValidate: true });
    }
  };

  const handleTimeSelect = (time: string) => {
    form.setValue("timeSlot", time, { shouldValidate: true });
  };

  return {
    canProceed,
    currentStep,
    form,
    galleryItem,
    handleDateSelect,
    handleNext,
    handlePrevious,
    handleServiceSelect,
    handleTimeSelect,
    onSubmit,
    selectedService,
    steps,
    timeSlots,
  };
}
