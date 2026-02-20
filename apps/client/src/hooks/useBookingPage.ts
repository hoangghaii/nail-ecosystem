import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import type { GalleryItem, Service } from "@/types";
import type { BookingNavigationState } from "@/types/navigation";

import { useCreateBooking } from "@/hooks/api/useBookings";
import { toast } from "@/lib/toast";
import {
  type BookingFormData,
  bookingFormSchema,
} from "@/lib/validations/booking.validation";
import { isValidBookingState } from "@/types/navigation";

const steps = [
  { icon: Calendar, id: 1, title: "Chọn Ngày & Giờ" },
  { icon: User, id: 2, title: "Thông Tin" },
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
  const navigate = useNavigate();

  // Booking mutation
  const { data: bookingResult, isPending, isSuccess, mutate: createBooking } = useCreateBooking();

  // Extract navigation state
  const navState = location.state as BookingNavigationState | null;

  // Validate navigation state
  const isValidState = isValidBookingState(navState);

  // Extract service (from Services page flow) or gallery item (from Gallery flow)
  const preSelectedService: Service | null =
    isValidState && "fromService" in navState && navState.fromService
      ? navState.service
      : null;

  const galleryItem: GalleryItem | null =
    isValidState && "fromGallery" in navState && navState.fromGallery
      ? navState.galleryItem
      : null;

  // Service ID: use gallery item's _id when booking from lookbook
  const initialServiceId = preSelectedService?._id ?? galleryItem?._id ?? "";

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService] = useState<Service | null>(preSelectedService);

  // Validate navigation state on mount — redirect if invalid
  useEffect(() => {
    const navState = location.state as BookingNavigationState | null;

    if (!isValidBookingState(navState)) {
      toast.error("Vui lòng chọn mẫu thiết kế từ Lookbook trước khi đặt lịch");
      navigate("/gallery", { replace: true });
    }
  }, [location.state, navigate]);

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
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    const bookingDto = {
      customerInfo: { ...data.customerInfo, email: data.customerInfo.email ?? "" },
      date: data.date.toISOString().split('T')[0],
      notes: "",
      serviceId: data.serviceId,
      timeSlot: data.timeSlot,
    };

    createBooking(bookingDto, {
      onError: () => {
        toast.error("Không thể đặt lịch. Vui lòng thử lại hoặc liên hệ với chúng tôi.");
      },
    });
  });

  const handleCloseConfirmation = () => {
    form.reset();
    setCurrentStep(1);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      const date = form.getValues("date");
      const timeSlot = form.getValues("timeSlot");
      return date instanceof Date && timeSlot !== "";
    }
    if (currentStep === 2) {
      const { customerInfo } = form.getValues();
      return (
        customerInfo.firstName !== "" &&
        customerInfo.lastName !== "" &&
        customerInfo.phone !== ""
      );
    }
    return false;
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
    handleTimeSelect,
    isPending,
    isSuccess,
    isValidState,
    onSubmit,
    selectedService,
    steps,
    timeSlots,
  };
}
