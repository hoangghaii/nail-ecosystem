/**
 * Contacts Service (Client)
 *
 * Service for submitting customer contact inquiries
 */

import type { Contact, ContactFormData } from "@repo/types/contact";

import { apiClient } from "@/lib/apiClient";

export class ContactsService {
  /**
   * Submit a new contact inquiry
   */
  async create(data: ContactFormData): Promise<Contact> {
    return apiClient.post<Contact>("/contacts", data);
  }
}

export const contactsService = new ContactsService();
