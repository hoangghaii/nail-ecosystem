/**
 * Services Service
 *
 * Handles CRUD operations for nail salon services
 */

import type { Service, ServiceCategory } from "@repo/types/service";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

export type GetServicesParams = {
  page?: number;
  limit?: number;
  category?: ServiceCategory;
};

export class ServicesService {
  async getAll(
    params: GetServicesParams = {},
  ): Promise<PaginationResponse<Service>> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.category) searchParams.set("category", params.category);

    const query = searchParams.toString();
    return apiClient.get<PaginationResponse<Service>>(
      `/services${query ? `?${query}` : ""}`,
    );
  }

  async getById(id: string): Promise<Service | null> {
    try {
      return await apiClient.get<Service>(`/services/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(formData: FormData): Promise<Service> {
    return apiClient.post<Service>("/services", formData);
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    return apiClient.patch<Service>(`/services/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/services/${id}`);
  }

  async toggleFeatured(id: string, featured: boolean): Promise<Service> {
    return apiClient.patch<Service>(`/services/${id}`, { featured });
  }

  async getByCategory(category: ServiceCategory): Promise<Service[]> {
    try {
      const items = await this.getAll({ category });
      return items?.data || [];
    } catch (error) {
      console.error("Failed to get services by category:", error);
      return [];
    }
  }

  async getFeatured(): Promise<Service[]> {
    try {
      const items = await this.getAll();
      return items?.data?.filter((item) => item.featured) || [];
    } catch (error) {
      console.error("Failed to get featured services:", error);
      return [];
    }
  }
}

export const servicesService = new ServicesService();
