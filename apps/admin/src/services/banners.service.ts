/**
 * Banners Service
 *
 * Handles CRUD operations for hero banners
 */

import type { PaginationResponse } from "@repo/types/pagination";

import type { Banner } from "@/types/banner.types";

import { apiClient } from "@/lib/apiClient";

export class BannersService {
  async getAll(): Promise<PaginationResponse<Banner>> {
    return apiClient.get<PaginationResponse<Banner>>("/banners");
  }

  async getById(id: string): Promise<Banner | null> {
    try {
      return await apiClient.get<Banner>(`/banners/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(formData: FormData): Promise<Banner> {
    return apiClient.post<Banner>("/banners", formData);
  }

  async update(
    id: string,
    data: Partial<Omit<Banner, "id" | "createdAt">>,
  ): Promise<Banner> {
    return apiClient.patch<Banner>(`/banners/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/banners/${id}`);
  }

  async toggleActive(id: string): Promise<Banner> {
    const banner = await this.getById(id);
    if (!banner) throw new Error("Banner not found");
    return this.update(id, { active: !banner.active });
  }

  async setPrimary(id: string): Promise<Banner> {
    return apiClient.post<Banner>(`/banners/${id}/set-primary`);
  }

  async reorder(bannerIds: string[]): Promise<Banner[]> {
    return apiClient.post<Banner[]>("/banners/reorder", { bannerIds });
  }

  async getPrimary(): Promise<Banner | null> {
    try {
      const banners = await this.getAll();
      return banners?.data?.find((b) => b.isPrimary && b.active) || null;
    } catch (error) {
      console.error("Failed to get primary banner:", error);
      return null;
    }
  }

  async getActive(): Promise<Banner[]> {
    try {
      const banners = await this.getAll();
      return banners?.data?.filter((b) => b.active) || [];
    } catch (error) {
      console.error("Failed to get active banners:", error);
      return [];
    }
  }
}

export const bannersService = new BannersService();
