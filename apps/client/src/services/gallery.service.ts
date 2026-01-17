/**
 * Gallery Service (Client)
 *
 * Read-only access to gallery items for customers
 */

import type { GalleryItem } from "@repo/types/gallery";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

export interface GalleryQueryParams {
  categoryId?: string;
  featured?: boolean;
  isActive?: boolean;
  limit?: number;
  page?: number;
}

export class GalleryService {
  async getAll(params?: GalleryQueryParams): Promise<GalleryItem[]> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await apiClient.get<PaginationResponse<GalleryItem>>(
      `/gallery${queryString}`
    );
    return response.data; // Extract array from pagination
  }

  async getById(id: string): Promise<GalleryItem> {
    return apiClient.get<GalleryItem>(`/gallery/${id}`);
  }

  async getFeatured(): Promise<GalleryItem[]> {
    // Use backend filtering instead of frontend
    return this.getAll({ featured: true, isActive: true });
  }

  private buildQueryString(params: GalleryQueryParams): string {
    const searchParams = new URLSearchParams();
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
    if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}

export const galleryService = new GalleryService();
