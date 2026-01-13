/**
 * Gallery Service (Client)
 *
 * Read-only access to gallery items for customers
 */

import type { GalleryItem } from "@repo/types/gallery";

import { apiClient } from "@/lib/apiClient";

export class GalleryService {
  async getAll(): Promise<GalleryItem[]> {
    return apiClient.get<GalleryItem[]>("/gallery");
  }

  async getById(id: string): Promise<GalleryItem> {
    return apiClient.get<GalleryItem>(`/gallery/${id}`);
  }

  async getFeatured(): Promise<GalleryItem[]> {
    const items = await this.getAll();
    return items.filter((item) => item.featured);
  }
}

export const galleryService = new GalleryService();
