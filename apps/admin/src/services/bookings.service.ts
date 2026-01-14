/**
 * Bookings Service
 *
 * Handles CRUD operations for bookings with backend filtering
 */
import type { Booking, BookingStatus } from "@repo/types/booking";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

// Query params type for type-safe API calls
export type BookingsQueryParams = {
  date?: string; // ISO format: YYYY-MM-DD
  limit?: number;
  page?: number;
  search?: string;
  serviceId?: string;
  sortBy?: 'date' | 'createdAt' | 'customerName';
  sortOrder?: 'asc' | 'desc';
  status?: BookingStatus;
};

export class BookingsService {
  async getAll(params?: BookingsQueryParams): Promise<PaginationResponse<Booking>> {
    const queryString = this.buildQueryString(params);
    return apiClient.get<PaginationResponse<Booking>>(`/bookings${queryString}`);
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

  /**
   * Builds query string from params
   * @private
   */
  private buildQueryString(params?: BookingsQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    if (params.status) searchParams.append('status', params.status);
    if (params.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params.date) searchParams.append('date', params.date);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  // REMOVED: getByStatus, getByDateRange, getUpcoming, getPast
  // Reason: Backend filtering via getAll(params) replaces client-side filtering
  // Migration: Use getAll({ status }), getAll({ date }), etc.
}

export const bookingsService = new BookingsService();
