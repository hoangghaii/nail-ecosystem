/**
 * Banners Service (Client)
 *
 * Read-only access to hero banners for customers
 */

import type { Banner } from "@repo/types/banner";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

export class BannersService {
  /**
   * Get all active banners sorted by sortIndex
   */
  async getAll(): Promise<Banner[]> {
    const response = await apiClient.get<PaginationResponse<Banner>>(
      "/banners?active=true",
    );
    return response.data; // Extract array from pagination response
  }

  /**
   * Get the primary banner for hero section
   */
  async getPrimary(): Promise<Banner | null> {
    const response = await apiClient.get<PaginationResponse<Banner>>(
      "/banners?isPrimary=true&active=true&limit=1",
    );
    const banners = response.data; // Extract array from pagination response
    return banners.length > 0 ? banners[0] : null;
  }
}

export const bannersService = new BannersService();
