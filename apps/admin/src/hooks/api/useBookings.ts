import type { Booking, BookingStatus } from "@repo/types/booking";
import type { PaginationResponse } from "@repo/types/pagination";
import type { ApiError } from "@repo/utils/api";

import { queryKeys } from "@repo/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { bookingsService } from "@/services/bookings.service";
import { storage } from "@/services/storage.service";

type BookingFilters = {
  dateFrom?: string;
  dateTo?: string;
  status?: BookingStatus;
};

type UseBookingsOptions = BookingFilters &
  Omit<
    UseQueryOptions<PaginationResponse<Booking>, ApiError>,
    "queryKey" | "queryFn"
  >;

/**
 * Query: Get all bookings with optional filters
 */
export function useBookings(options?: UseBookingsOptions) {
  const { dateFrom, dateTo, status, ...queryOptions } = options || {};

  const filters: BookingFilters | undefined =
    status || dateFrom || dateTo ? { dateFrom, dateTo, status } : undefined;

  return useQuery({
    // Don't run query if no auth token (prevents 401 errors on mount)
    enabled: queryOptions.enabled !== false && !!storage.get("auth_token", ""),
    queryFn: async () => {
      // Always return PaginationResponse for consistent typing
      if (status) {
        const items = await bookingsService.getByStatus(status);
        return {
          data: items,
          pagination: {
            limit: items.length,
            page: 1,
            total: items.length,
            totalPages: 1,
          },
        };
      }
      if (dateFrom && dateTo) {
        const items = await bookingsService.getByDateRange(
          new Date(dateFrom),
          new Date(dateTo),
        );
        return {
          data: items,
          pagination: {
            limit: items.length,
            page: 1,
            total: items.length,
            totalPages: 1,
          },
        };
      }
      return bookingsService.getAll();
    },
    queryKey: queryKeys.bookings.list(filters),
    ...queryOptions,
  });
}

/**
 * Query: Get booking by ID
 */
export function useBooking(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => bookingsService.getById(id!),
    queryKey: queryKeys.bookings.detail(id!),
  });
}

/**
 * Mutation: Update booking
 */
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: Partial<Omit<Booking, "id">>;
      id: string;
    }) => bookingsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      if (updated.id) {
        queryClient.setQueryData(
          queryKeys.bookings.detail(updated.id),
          updated,
        );
      }
      toast.success("Booking updated successfully");
    },
  });
}

/**
 * Mutation: Update booking status (optimistic update)
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingsService.updateStatus(id, status),

    // Rollback on error
    onError: (
      _err,
      _variables,
      context: { previousBookings?: Booking[] } | undefined,
    ) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(
          queryKeys.bookings.lists(),
          context.previousBookings,
        );
      }
      toast.error("Failed to update booking status");
    },

    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.bookings.all });

      // Snapshot previous value
      const previousBookings = queryClient.getQueryData<Booking[]>(
        queryKeys.bookings.lists(),
      );

      // Optimistically update cache
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(
          queryKeys.bookings.lists(),
          previousBookings.map((booking) =>
            booking.id === id ? { ...booking, status } : booking,
          ),
        );
      }

      return { previousBookings };
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
