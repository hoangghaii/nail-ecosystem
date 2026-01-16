/**
 * Business Info Service (Client)
 *
 * Read-only access to business information (phone, email, address, hours)
 */

import type { BusinessInfoResponse } from '@repo/types/business-info';

import { apiClient } from '@/lib/apiClient';

export class BusinessInfoService {
  async get(): Promise<BusinessInfoResponse> {
    return apiClient.get<BusinessInfoResponse>('/business-info');
  }
}

export const businessInfoService = new BusinessInfoService();
