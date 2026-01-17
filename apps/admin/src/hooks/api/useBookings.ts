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

import {
  bookingsService,
  type BookingsQueryParams,
} from "@/services/bookings.service";
import { storage } from "@/services/storage.service";

type UseBookingsOptions = BookingsQueryParams &
  Omit<
    UseQueryOptions<PaginationResponse<Booking>, ApiError>,
    "queryKey" | "queryFn"
  >;

/**
 * Query: Get all bookings with backend filtering
 */
export function useBookings(options?: UseBookingsOptions) {
  const {
    date,
    limit,
    page,
    search,
    serviceId,
    sortBy,
    sortOrder,
    status,
    ...queryOptions
  } = options || {};

  // Build filter object for queryKey and service call
  const filters: BookingsQueryParams | undefined =
    status ||
    serviceId ||
    date ||
    search ||
    sortBy ||
    sortOrder ||
    page ||
    limit
      ? { date, limit, page, search, serviceId, sortBy, sortOrder, status }
      : undefined;

  return useQuery({
    enabled: queryOptions.enabled !== false && !!storage.get("auth_token", ""),
    // @ts-expect-error - keepPreviousData exists in v4
    keepPreviousData: true, // Show old data while fetching new (smooth UX)
    queryFn: () => bookingsService.getAll(filters),

    queryKey: queryKeys.bookings.list(filters),
    // Cache configuration
    staleTime: 30_000, // Consider data fresh for 30s

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
