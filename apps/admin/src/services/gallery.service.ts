/**
 * Gallery Service
 *
 * Handles CRUD operations for gallery items
 */

import type { GalleryItem } from "@repo/types/gallery";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

// Query params type for type-safe API calls
export type GalleriesQueryParams = {
  featured?: boolean;
  isActive?: boolean;
  limit?: number;
  nailShape?: string;
  nailStyle?: string;
  page?: number;
  search?: string;
};

export class GalleryService {
  async getAll(
    params?: GalleriesQueryParams,
  ): Promise<PaginationResponse<GalleryItem>> {
    const queryString = this.buildQueryString(params);

    return apiClient.get<PaginationResponse<GalleryItem>>(
      `/gallery${queryString}`,
    );
  }

  async getById(id: string): Promise<GalleryItem | null> {
    try {
      return await apiClient.get<GalleryItem>(`/gallery/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(formData: FormData): Promise<GalleryItem> {
    return apiClient.post<GalleryItem>("/gallery", formData);
  }

  async createMultiple(
    items: Omit<GalleryItem, "id" | "createdAt">[],
  ): Promise<GalleryItem[]> {
    return apiClient.post<GalleryItem[]>("/gallery/bulk", { items });
  }

  async update(
    id: string,
    data: Partial<Omit<GalleryItem, "id" | "createdAt">>,
  ): Promise<GalleryItem> {
    return apiClient.patch<GalleryItem>(`/gallery/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/gallery/${id}`);
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    return apiClient.delete("/gallery/bulk-delete", {
      body: { ids },
    });
  }

  async toggleFeatured(id: string): Promise<GalleryItem> {
    const item = await this.getById(id);
    if (!item) throw new Error("Gallery item not found");
    return this.update(id, { featured: !item.featured });
  }

  async getFeatured(): Promise<GalleryItem[]> {
    try {
      const items = await this.getAll();
      return items?.data?.filter((item) => item.featured) || [];
    } catch (error) {
      console.error("Failed to get featured gallery items:", error);
      return [];
    }
  }

  /**
   * Builds query string from params
   * @private
   */
  private buildQueryString(params?: GalleriesQueryParams): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    if (params.nailShape) searchParams.append("nailShape", params.nailShape);
    if (params.nailStyle) searchParams.append("nailStyle", params.nailStyle);
    if (params.featured !== undefined) searchParams.append("featured", params.featured.toString());
    if (params.isActive !== undefined) searchParams.append("isActive", params.isActive.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }
}

export const galleryService = new GalleryService();
