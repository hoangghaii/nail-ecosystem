/**
 * Gallery Service (Client)
 *
 * Read-only access to gallery items and nail filter options for customers
 */

import type { GalleryItem } from "@repo/types/gallery";
import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

export interface GalleryQueryParams {
  featured?: boolean;
  isActive?: boolean;
  limit?: number;
  nailShape?: string;
  nailStyle?: string;
  page?: number;
}

export class GalleryService {
  async getAll(params?: GalleryQueryParams): Promise<GalleryItem[]> {
    const response = await apiClient.get<PaginationResponse<GalleryItem>>(
      `/gallery${this.buildQueryString(params)}`,
    );
    return response.data;
  }

  async getAllPagination(params?: GalleryQueryParams): Promise<PaginationResponse<GalleryItem>> {
    return apiClient.get<PaginationResponse<GalleryItem>>(
      `/gallery${this.buildQueryString(params)}`,
    );
  }

  async getById(id: string): Promise<GalleryItem> {
    return apiClient.get<GalleryItem>(`/gallery/${id}`);
  }

  async getFeatured(): Promise<GalleryItem[]> {
    return this.getAll({ featured: true, isActive: true });
  }

  async getNailShapes(): Promise<NailShapeItem[]> {
    const res = await apiClient.get<{ data: NailShapeItem[] }>("/nail-shapes?isActive=true");
    return res.data;
  }

  async getNailStyles(): Promise<NailStyleItem[]> {
    const res = await apiClient.get<{ data: NailStyleItem[] }>("/nail-styles?isActive=true");
    return res.data;
  }

  private buildQueryString(params?: GalleryQueryParams): string {
    if (!params) return "";
    const p = new URLSearchParams();
    if (params.nailShape) p.set("nailShape", params.nailShape);
    if (params.nailStyle) p.set("nailStyle", params.nailStyle);
    if (params.featured !== undefined) p.set("featured", String(params.featured));
    if (params.isActive !== undefined) p.set("isActive", String(params.isActive));
    if (params.page) p.set("page", String(params.page));
    if (params.limit) p.set("limit", String(params.limit));
    const q = p.toString();
    return q ? `?${q}` : "";
  }
}

export const galleryService = new GalleryService();
