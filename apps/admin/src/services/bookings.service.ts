/**
 * Bookings Service
 *
 * Handles CRUD operations for bookings
 */
import type { Booking, BookingStatus } from "@repo/types/booking";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

export class BookingsService {
  async getAll(): Promise<PaginationResponse<Booking>> {
    return apiClient.get<PaginationResponse<Booking>>("/bookings");
  }

  async getById(id: string): Promise<Booking | null> {
    try {
      return await apiClient.get<Booking>(`/bookings/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<Omit<Booking, "id">>,
  ): Promise<Booking> {
    return apiClient.patch<Booking>(`/bookings/${id}`, data);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    return this.update(id, { status });
  }

  async getByStatus(status: BookingStatus): Promise<Booking[]> {
    try {
      const bookings = await this.getAll();

      return (
        bookings?.data?.filter((booking) => booking.status === status) || []
      );
    } catch (error) {
      console.error("Failed to get bookings by status:", error);
      return [];
    }
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
      const bookings = await this.getAll();
      return (
        bookings?.data?.filter((booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= startDate && bookingDate <= endDate;
        }) || []
      );
    } catch (error) {
      console.error("Failed to get bookings by date range:", error);
      return [];
    }
  }

  async getUpcoming(): Promise<Booking[]> {
    try {
      const bookings = await this.getAll();
      const now = new Date();
      return (
        bookings?.data?.filter((booking) => new Date(booking.date) >= now) || []
      );
    } catch (error) {
      console.error("Failed to get upcoming bookings:", error);
      return [];
    }
  }

  async getPast(): Promise<Booking[]> {
    try {
      const bookings = await this.getAll();
      const now = new Date();
      return (
        bookings?.data?.filter((booking) => new Date(booking.date) < now) || []
      );
    } catch (error) {
      console.error("Failed to get past bookings:", error);
      return [];
    }
  }
}

export const bookingsService = new BookingsService();
