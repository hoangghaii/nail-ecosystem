/**
 * Banners Service
 *
 * Handles CRUD operations for hero banners
 */

import type { Banner } from "@/types/banner.types";

import { apiClient } from "@/lib/apiClient";

export class BannersService {
  async getAll(): Promise<Banner[]> {
    return apiClient.get<Banner[]>("/banners");
  }

  async getById(id: string): Promise<Banner | null> {
    try {
      return await apiClient.get<Banner>(`/banners/${id}`);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(
    data: Omit<Banner, "id" | "createdAt" | "updatedAt">,
  ): Promise<Banner> {
    return apiClient.post<Banner>("/banners", data);
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
    const banners = await this.getAll();
    return banners.find((b) => b.isPrimary && b.active) || null;
  }

  async getActive(): Promise<Banner[]> {
    const banners = await this.getAll();
    return banners.filter((b) => b.active);
  }
}

export const bannersService = new BannersService();
