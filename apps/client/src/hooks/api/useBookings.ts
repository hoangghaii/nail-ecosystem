import type { Booking } from "@repo/types/booking";

import { ApiError } from "@repo/utils/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { bookingsService } from "@/services/bookings.service";

/**
 * Mutation: Create booking (customer-facing)
 */
export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: Omit<Booking, "id" | "status">) =>
      bookingsService.create(data),
    onError: (error) => {
      // Customer-friendly error messages
      if (ApiError.isApiError(error)) {
        const message =
          error.statusCode === 409
            ? "This time slot is no longer available. Please choose another time."
            : error.statusCode === 400
              ? "Please check your booking details and try again."
              : "We apologize, but we could not process your booking. Please try again or contact us directly.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
    onSuccess: () => {
      // Customer-friendly success message
      toast.success(
        "Booking submitted successfully! We will contact you shortly to confirm.",
      );
    },
  });
}
