/**
 * Banners Service
 *
 * Handles CRUD operations for hero banners
 */

import type { PaginationResponse } from "@repo/types/pagination";

import type { Banner } from "@/types/banner.types";

import { apiClient } from "@/lib/apiClient";

// Query params type for type-safe API calls
export type BannersQueryParams = {
  active?: boolean;
  isPrimary?: boolean;
  limit?: number;
  page?: number;
  type?: "image" | "video";
};

export class BannersService {
  async getAll(
    params?: BannersQueryParams,
  ): Promise<PaginationResponse<Banner>> {
    const queryString = this.buildQueryString(params);

    return apiClient.get<PaginationResponse<Banner>>(`/banners${queryString}`);
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

  /**
   * Builds query string from params
   * @private
   */
  private buildQueryString(params?: BannersQueryParams): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    if (params.active) searchParams.append("active", params.active.toString());
    if (params.isPrimary)
      searchParams.append("isPrimary", params.isPrimary.toString());
    if (params.type) searchParams.append("type", params.type);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }
}

export const bannersService = new BannersService();
