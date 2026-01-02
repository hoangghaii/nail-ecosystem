/**
 * Bookings Service (Client)
 *
 * Customer booking creation
 */

import type { Booking } from "@repo/types/booking";
import { apiClient } from "@/lib/apiClient";

export class BookingsService {
  async create(data: Omit<Booking, "id" | "status">): Promise<Booking> {
    return apiClient.post<Booking>("/bookings", data);
  }
}

export const bookingsService = new BookingsService();
