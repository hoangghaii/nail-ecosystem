/**
 * Contacts Service
 *
 * Handles operations for customer contact inquiries
 */

import type { Contact, ContactStatus } from "@/types/contact.types";

import { apiClient } from "@/lib/apiClient";

export class ContactsService {
  async getAll(): Promise<Contact[]> {
    return apiClient.get<Contact[]>("/contacts");
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

  async getByStatus(status: ContactStatus): Promise<Contact[]> {
    try {
      const contacts = await this.getAll();
      return contacts?.filter((c) => c.status === status) || [];
    } catch (error) {
      console.error("Failed to get contacts by status:", error);
      return [];
    }
  }
}

export const contactsService = new ContactsService();
