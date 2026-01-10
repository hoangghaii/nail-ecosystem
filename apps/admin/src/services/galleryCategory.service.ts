/**
 * Gallery Category Service
 *
 * Handles CRUD operations for gallery categories
 */

import type {
  CreateGalleryCategoryDto,
  GalleryCategoryItem,
  UpdateGalleryCategoryDto,
} from "@repo/types/gallery-category";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

export class GalleryCategoryService {
  async getAll(): Promise<PaginationResponse<GalleryCategoryItem>> {
    return apiClient.get<PaginationResponse<GalleryCategoryItem>>(
      "/gallery-categories",
    );
  }

  async getById(id: string): Promise<GalleryCategoryItem | null> {
    try {
      return await apiClient.get<GalleryCategoryItem>(
        `/gallery-categories/${id}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<GalleryCategoryItem | null> {
    try {
      return await apiClient.get<GalleryCategoryItem>(
        `/gallery-categories/slug/${slug}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(
    data: CreateGalleryCategoryDto,
  ): Promise<GalleryCategoryItem> {
    return apiClient.post<GalleryCategoryItem>("/gallery-categories", data);
  }

  async update(
    id: string,
    data: UpdateGalleryCategoryDto,
  ): Promise<GalleryCategoryItem> {
    return apiClient.patch<GalleryCategoryItem>(
      `/gallery-categories/${id}`,
      data,
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/gallery-categories/${id}`);
  }

  async toggleActive(id: string): Promise<GalleryCategoryItem> {
    const category = await this.getById(id);
    if (!category) throw new Error("Category not found");
    return this.update(id, { isActive: !category.isActive });
  }

  async getActive(): Promise<GalleryCategoryItem[]> {
    const categories = await this.getAll();
    return (
      categories?.data
        ?.filter((c) => c.isActive)
        .sort((a, b) => a.name.localeCompare(b.name)) || []
    );
  }
}

export const galleryCategoryService = new GalleryCategoryService();
