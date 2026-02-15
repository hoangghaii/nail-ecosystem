import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, FileText, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import type { GalleryItem, Service } from "@/types";

import { useCreateBooking } from "@/hooks/api/useBookings";
import { useServices } from "@/hooks/api/useServices";
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

  // Fetch services from API
  const { data: servicesData = [], isLoading: servicesLoading } = useServices({
    isActive: true,
  });

  // Booking mutation
  const { data: bookingResult, isPending, isSuccess, mutate: createBooking } = useCreateBooking();

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

  const initialServiceId = matchingService?._id ?? "";
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
    // Transform form data to match API DTO
    const bookingDto = {
      customerInfo: data.customerInfo,
      date: data.date.toISOString().split('T')[0], // Convert Date to "YYYY-MM-DD"
      notes: "", // Optional field
      serviceId: data.serviceId,
      timeSlot: data.timeSlot, // Already a string like "14:00"
    };

    // Submit to API
    createBooking(bookingDto, {
      onError: () => {
        toast.error("Không thể đặt lịch. Vui lòng thử lại hoặc liên hệ với chúng tôi.");
      },
    });
  });

  // Reset form after successful booking
  const handleCloseConfirmation = () => {
    form.reset();
    setSelectedService(null);
    setCurrentStep(1);
  };

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
    form.setValue("serviceId", service._id, { shouldValidate: true });
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
    bookingResult,
    canProceed,
    currentStep,
    form,
    galleryItem,
    handleCloseConfirmation,
    handleDateSelect,
    handleNext,
    handlePrevious,
    handleServiceSelect,
    handleTimeSelect,
    isPending,
    isSuccess,
    onSubmit,
    selectedService,
    servicesData,
    servicesLoading,
    steps,
    timeSlots,
  };
}
