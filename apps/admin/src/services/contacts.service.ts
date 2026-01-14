/**
 * Contacts Service
 *
 * Handles operations for customer contact inquiries with backend filtering
 */

import type { Contact, ContactStatus } from "@/types/contact.types";

import { apiClient } from "@/lib/apiClient";

// Query params type for type-safe API calls
export type ContactsQueryParams = {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: 'createdAt' | 'status' | 'firstName' | 'lastName';
  sortOrder?: 'asc' | 'desc';
  status?: ContactStatus;
};

export class ContactsService {
  async getAll(params?: ContactsQueryParams): Promise<Contact[]> {
    const queryString = this.buildQueryString(params);
    const response = await apiClient.get<{ data: Contact[] } | Contact[]>(`/contacts${queryString}`);

    // Backend now returns pagination response, extract data
    return 'data' in response ? response.data : response;
  }

  async getById(id: string): Promise<Contact | null> {
    try {
      return await apiClient.get<Contact>(`/contacts/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
    adminNotes?: string,
  ): Promise<Contact> {
    return apiClient.patch<Contact>(`/contacts/${id}/status`, {
      adminNotes,
      status,
    });
  }

  async updateAdminNotes(id: string, adminNotes: string): Promise<Contact> {
    return apiClient.patch<Contact>(`/contacts/${id}/notes`, { adminNotes });
  }

  /**
   * Builds query string from params
   * @private
   */
  private buildQueryString(params?: ContactsQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  // REMOVED: getByStatus
  // Reason: Backend filtering via getAll({ status }) replaces client-side filtering
  // Migration: Use getAll({ status }) instead
}

export const contactsService = new ContactsService();
