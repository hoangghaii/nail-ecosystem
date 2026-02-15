/**
 * Bookings Service (Client)
 *
 * Customer booking creation
 */

import type { Booking } from "@repo/types/booking";

import { apiClient } from "@/lib/apiClient";

export interface CreateBookingDto {
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  date: string; // ISO date format "YYYY-MM-DD"
  notes?: string;
  serviceId: string;
  timeSlot: string; // e.g., "14:00"
}

export class BookingsService {
  async create(data: CreateBookingDto): Promise<Booking> {
    return apiClient.post<Booking>("/bookings", data);
  }
}

export const bookingsService = new BookingsService();
