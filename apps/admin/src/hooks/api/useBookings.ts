import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@repo/utils/api';
import type { Booking, BookingStatus } from '@repo/types/booking';
import { bookingsService } from '@/services/bookings.service';
import type { ApiError } from '@repo/utils/api';

type BookingFilters = {
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
};

type UseBookingsOptions = BookingFilters & Omit<UseQueryOptions<Booking[], ApiError>, 'queryKey' | 'queryFn'>;

/**
 * Query: Get all bookings with optional filters
 */
export function useBookings(options?: UseBookingsOptions) {
  const { status, dateFrom, dateTo, ...queryOptions } = options || {};

  const filters: BookingFilters | undefined = (status || dateFrom || dateTo)
    ? { status, dateFrom, dateTo }
    : undefined;

  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: async () => {
      if (status) {
        return bookingsService.getByStatus(status);
      }
      if (dateFrom && dateTo) {
        return bookingsService.getByDateRange(
          new Date(dateFrom),
          new Date(dateTo)
        );
      }
      return bookingsService.getAll();
    },
    ...queryOptions,
  });
}

/**
 * Query: Get booking by ID
 */
export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id!),
    queryFn: () => bookingsService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Mutation: Update booking
 */
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Booking, 'id'>> }) =>
      bookingsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      if (updated.id) {
        queryClient.setQueryData(queryKeys.bookings.detail(updated.id), updated);
      }
      toast.success('Booking updated successfully');
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

    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.bookings.all });

      // Snapshot previous value
      const previousBookings = queryClient.getQueryData<Booking[]>(
        queryKeys.bookings.lists()
      );

      // Optimistically update cache
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(
          queryKeys.bookings.lists(),
          previousBookings.map((booking) =>
            booking.id === id ? { ...booking, status } : booking
          )
        );
      }

      return { previousBookings };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(queryKeys.bookings.lists(), context.previousBookings);
      }
      toast.error('Failed to update booking status');
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
