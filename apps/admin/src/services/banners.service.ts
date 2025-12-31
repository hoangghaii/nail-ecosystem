import type { Banner } from "@/types/banner.types";

import { useBannersStore } from "@/store/bannersStore";

export class BannersService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Banner[]> {
    if (this.useMockApi) {
      const banners = useBannersStore.getState().banners;
      return banners.sort((a, b) => a.sortIndex - b.sortIndex);
    }

    const response = await fetch("/api/banners");
    if (!response.ok) throw new Error("Failed to fetch banners");
    return response.json();
  }

  async getById(id: string): Promise<Banner | null> {
    if (this.useMockApi) {
      const banners = useBannersStore.getState().banners;
      return banners.find((b) => b.id === id) || null;
    }

    const response = await fetch(`/api/banners/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch banner");
    }
    return response.json();
  }

  async create(
    data: Omit<Banner, "id" | "createdAt" | "updatedAt">,
  ): Promise<Banner> {
    if (this.useMockApi) {
      const newBanner: Banner = {
        ...data,
        createdAt: new Date(),
        id: `banner_${Date.now()}`,
        updatedAt: new Date(),
      };
      useBannersStore.getState().addBanner(newBanner);
      return newBanner;
    }

    const response = await fetch("/api/banners", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to create banner");
    return response.json();
  }

  async update(
    id: string,
    data: Partial<Omit<Banner, "id" | "createdAt">>,
  ): Promise<Banner> {
    if (this.useMockApi) {
      const banners = useBannersStore.getState().banners;
      const banner = banners.find((b) => b.id === id);
      if (!banner) throw new Error("Banner not found");

      const updatedBanner: Banner = {
        ...banner,
        ...data,
        updatedAt: new Date(),
      };
      useBannersStore.getState().updateBanner(id, data);
      return updatedBanner;
    }

    const response = await fetch(`/api/banners/${id}`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update banner");
    return response.json();
  }

  async delete(id: string): Promise<void> {
    if (this.useMockApi) {
      useBannersStore.getState().deleteBanner(id);
      return;
    }

    const response = await fetch(`/api/banners/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete banner");
  }

  async toggleActive(id: string): Promise<Banner> {
    const banner = await this.getById(id);
    if (!banner) throw new Error("Banner not found");

    if (this.useMockApi) {
      useBannersStore.getState().toggleBannerActive(id);
      const updatedBanner = await this.getById(id);
      if (!updatedBanner) throw new Error("Banner not found after toggle");
      return updatedBanner;
    }

    return this.update(id, { active: !banner.active });
  }

  async setPrimary(id: string): Promise<Banner> {
    if (this.useMockApi) {
      useBannersStore.getState().setPrimaryBanner(id);
      const banner = await this.getById(id);
      if (!banner) throw new Error("Banner not found");
      return banner;
    }

    const response = await fetch(`/api/banners/${id}/set-primary`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to set primary banner");
    return response.json();
  }

  async reorder(bannerIds: string[]): Promise<Banner[]> {
    if (this.useMockApi) {
      useBannersStore.getState().reorderBanners(bannerIds);
      return this.getAll();
    }

    const response = await fetch("/api/banners/reorder", {
      body: JSON.stringify({ bannerIds }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to reorder banners");
    return response.json();
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
