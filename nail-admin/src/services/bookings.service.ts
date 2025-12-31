import type { Booking, BookingStatus } from "@/types/booking.types";

import { useBookingsStore } from "@/store/bookingsStore";

export class BookingsService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Booking[]> {
    if (this.useMockApi) {
      return useBookingsStore.getState().bookings;
    }

    const response = await fetch("/api/bookings");
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
  }

  async getById(id: string): Promise<Booking | null> {
    if (this.useMockApi) {
      const bookings = useBookingsStore.getState().bookings;
      return bookings.find((booking) => booking.id === id) || null;
    }

    const response = await fetch(`/api/bookings/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch booking");
    }
    return response.json();
  }

  async update(
    id: string,
    data: Partial<Omit<Booking, "id">>,
  ): Promise<Booking> {
    if (this.useMockApi) {
      const bookings = useBookingsStore.getState().bookings;
      const booking = bookings.find((b) => b.id === id);
      if (!booking) throw new Error("Booking not found");

      const updatedBooking: Booking = {
        ...booking,
        ...data,
      };
      useBookingsStore.getState().updateBooking(id, data);
      return updatedBooking;
    }

    const response = await fetch(`/api/bookings/${id}`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update booking");
    return response.json();
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    if (this.useMockApi) {
      const booking = await this.getById(id);
      if (!booking) throw new Error("Booking not found");

      useBookingsStore.getState().updateBookingStatus(id, status);
      const updatedBooking = await this.getById(id);
      if (!updatedBooking)
        throw new Error("Booking not found after status update");
      return updatedBooking;
    }

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
