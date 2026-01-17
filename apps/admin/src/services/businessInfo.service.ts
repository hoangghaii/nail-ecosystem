/**
 * Business Info Service
 *
 * Handles business information (singleton - only one record exists)
 */

import type { BusinessInfo } from "@repo/types/business-info";

import { apiClient } from "@/lib/apiClient";

export class BusinessInfoService {
  async get(): Promise<BusinessInfo | null> {
    try {
      return await apiClient.get<BusinessInfo>("/business-info");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async update(
    data: Partial<Omit<BusinessInfo, "_id" | "createdAt" | "updatedAt">>,
  ): Promise<BusinessInfo> {
    return apiClient.patch<BusinessInfo>("/business-info", data);
  }
}

export const businessInfoService = new BusinessInfoService();
