/**
 * Bookings Service
 *
 * Handles CRUD operations for bookings
 */

import type { Booking, BookingStatus } from "@repo/types/booking";

import { apiClient } from "@/lib/apiClient";

export class BookingsService {
  async getAll(): Promise<Booking[]> {
    return apiClient.get<Booking[]>("/bookings");
  }

  async getById(id: string): Promise<Booking | null> {
    try {
      return await apiClient.get<Booking>(`/bookings/${id}`);
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
    const bookings = await this.getAll();
    return bookings.filter((booking) => booking.status === status);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookings = await this.getAll();
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startDate && bookingDate <= endDate;
    });
  }

  async getUpcoming(): Promise<Booking[]> {
    const bookings = await this.getAll();
    const now = new Date();
    return bookings.filter((booking) => new Date(booking.date) >= now);
  }

  async getPast(): Promise<Booking[]> {
    const bookings = await this.getAll();
    const now = new Date();
    return bookings.filter((booking) => new Date(booking.date) < now);
  }
}

export const bookingsService = new BookingsService();
