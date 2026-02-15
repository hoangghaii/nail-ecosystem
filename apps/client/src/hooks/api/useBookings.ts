import { useMutation } from "@tanstack/react-query";

import { bookingsService, type CreateBookingDto } from "@/services/bookings.service";

/**
 * Mutation: Create booking (customer-facing)
 */
export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    retry: 1, // Retry once for booking submissions
  });
}
