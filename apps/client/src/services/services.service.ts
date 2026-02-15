/**
 * Services Service (Client)
 *
 * Read-only access to nail salon services for customers
 */

import type { PaginationResponse } from "@repo/types/pagination";
import type { Service, ServiceCategory } from "@repo/types/service";

import { apiClient } from "@/lib/apiClient";

export interface ServicesQueryParams {
  category?: ServiceCategory;
  featured?: boolean;
  isActive?: boolean;
  limit?: number;
  page?: number;
}

export class ServicesService {
  async getAll(params?: ServicesQueryParams): Promise<Service[]> {
    const queryString = params ? this.buildQueryString(params) : "";
    const response = await apiClient.get<PaginationResponse<Service>>(
      `/services${queryString}`,
    );
    return response.data; // Extract array from pagination
  }

  async getById(id: string): Promise<Service> {
    return apiClient.get<Service>(`/services/${id}`);
  }

  private buildQueryString(params: ServicesQueryParams): string {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set("category", params.category);
    if (params.featured !== undefined)
      searchParams.set("featured", String(params.featured));
    if (params.isActive !== undefined)
      searchParams.set("isActive", String(params.isActive));
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }
}

export const servicesService = new ServicesService();
