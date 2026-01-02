/**
 * Services Service
 *
 * Handles CRUD operations for nail salon services
 */

import type { Service, ServiceCategory } from "@repo/types/service";

import { apiClient } from "@/lib/apiClient";

export class ServicesService {
  async getAll(): Promise<Service[]> {
    return apiClient.get<Service[]>("/services");
  }

  async getById(id: string): Promise<Service> {
    return apiClient.get<Service>(`/services/${id}`);
  }

  async create(data: Omit<Service, "id">): Promise<Service> {
    return apiClient.post<Service>("/services", data);
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
    return apiClient.get<Service[]>(`/services?category=${category}`);
  }
}

export const servicesService = new ServicesService();
