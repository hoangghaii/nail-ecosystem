import type { GalleryItem } from "@/types/gallery.types";

import { useGalleryStore } from "@/store/galleryStore";

export class GalleryService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<GalleryItem[]> {
    if (this.useMockApi) {
      return useGalleryStore.getState().galleryItems;
    }

    const response = await fetch("/api/gallery");
    if (!response.ok) throw new Error("Failed to fetch gallery items");
    return response.json();
  }

  async getById(id: string): Promise<GalleryItem | null> {
    if (this.useMockApi) {
      const items = useGalleryStore.getState().galleryItems;
      return items.find((item) => item.id === id) || null;
    }

    const response = await fetch(`/api/gallery/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch gallery item");
    }
    return response.json();
  }

  async create(
    data: Omit<GalleryItem, "id" | "createdAt">,
  ): Promise<GalleryItem> {
    if (this.useMockApi) {
      const newItem: GalleryItem = {
        ...data,
        createdAt: new Date(),
        id: `gallery_${Date.now()}`,
      };
      useGalleryStore.getState().addGalleryItem(newItem);
      return newItem;
    }

    const response = await fetch("/api/gallery", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to create gallery item");
    return response.json();
  }

  async createMultiple(
    items: Omit<GalleryItem, "id" | "createdAt">[],
  ): Promise<GalleryItem[]> {
    if (this.useMockApi) {
      const newItems: GalleryItem[] = items.map((item, index) => ({
        ...item,
        createdAt: new Date(),
        id: `gallery_${Date.now()}_${index}`,
      }));
      useGalleryStore.getState().addMultipleItems(newItems);
      return newItems;
    }

    const response = await fetch("/api/gallery/bulk", {
      body: JSON.stringify({ items }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to create gallery items");
    return response.json();
  }

  async update(
    id: string,
    data: Partial<Omit<GalleryItem, "id" | "createdAt">>,
  ): Promise<GalleryItem> {
    if (this.useMockApi) {
      const items = useGalleryStore.getState().galleryItems;
      const item = items.find((i) => i.id === id);
      if (!item) throw new Error("Gallery item not found");

      const updatedItem: GalleryItem = {
        ...item,
        ...data,
      };
      useGalleryStore.getState().updateGalleryItem(id, data);
      return updatedItem;
    }

    const response = await fetch(`/api/gallery/${id}`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update gallery item");
    return response.json();
  }

  async delete(id: string): Promise<void> {
    if (this.useMockApi) {
      useGalleryStore.getState().deleteGalleryItem(id);
      return;
    }

    const response = await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete gallery item");
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    if (this.useMockApi) {
      useGalleryStore.getState().deleteMultipleItems(ids);
      return;
    }

    const response = await fetch("/api/gallery/bulk-delete", {
      body: JSON.stringify({ ids }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete gallery items");
  }

  async toggleFeatured(id: string): Promise<GalleryItem> {
    const item = await this.getById(id);
    if (!item) throw new Error("Gallery item not found");

    if (this.useMockApi) {
      useGalleryStore.getState().toggleFeatured(id);
      const updatedItem = await this.getById(id);
      if (!updatedItem) throw new Error("Gallery item not found after toggle");
      return updatedItem;
    }

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
