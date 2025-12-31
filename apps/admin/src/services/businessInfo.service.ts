import type { BusinessInfo } from "@/types/businessInfo.types";

import { useBusinessInfoStore } from "@/store/businessInfoStore";

export class BusinessInfoService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  /**
   * Get business info (singleton - only one record exists)
   */
  async get(): Promise<BusinessInfo | null> {
    if (this.useMockApi) {
      return useBusinessInfoStore.getState().businessInfo;
    }

    const response = await fetch("/api/business-info");
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch business info");
    }
    return response.json();
  }

  /**
   * Update business info (singleton - only one record exists)
   */
  async update(data: Partial<Omit<BusinessInfo, "id">>): Promise<BusinessInfo> {
    if (this.useMockApi) {
      useBusinessInfoStore.getState().updateBusinessInfo(data);
      const businessInfo = await this.get();
      if (!businessInfo)
        throw new Error("Business info not found after update");
      return businessInfo;
    }

    const response = await fetch("/api/business-info", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update business info");
    return response.json();
  }
}

export const businessInfoService = new BusinessInfoService();
