/**
 * Gallery Service
 *
 * Handles CRUD operations for gallery items
 */

import type { GalleryItem } from "@repo/types/gallery";

import { apiClient } from "@/lib/apiClient";

export class GalleryService {
  async getAll(): Promise<GalleryItem[]> {
    return apiClient.get<GalleryItem[]>("/gallery");
  }

  async getById(id: string): Promise<GalleryItem | null> {
    try {
      return await apiClient.get<GalleryItem>(`/gallery/${id}`);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(
    data: Omit<GalleryItem, "id" | "createdAt">,
  ): Promise<GalleryItem> {
    return apiClient.post<GalleryItem>("/gallery", data);
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
    const items = await this.getAll();
    return items.filter((item) => item.featured);
  }

  async getByCategory(category: string): Promise<GalleryItem[]> {
    const items = await this.getAll();
    if (category === "all") return items;
    return items.filter((item) => item.category === category);
  }
}

export const galleryService = new GalleryService();
