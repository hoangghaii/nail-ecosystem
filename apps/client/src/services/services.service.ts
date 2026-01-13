/**
 * Services Service (Client)
 *
 * Read-only access to nail salon services for customers
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

  async getByCategory(category: ServiceCategory): Promise<Service[]> {
    return apiClient.get<Service[]>(`/services?category=${category}`);
  }
}

export const servicesService = new ServicesService();
