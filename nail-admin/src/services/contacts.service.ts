import type { Contact, ContactStatus } from "@/types/contact.types";

import { useContactsStore } from "@/store/contactsStore";

export class ContactsService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Contact[]> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      // Sort by createdAt descending (newest first)
      return [...contacts].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    const response = await fetch("/api/contacts");
    if (!response.ok) throw new Error("Failed to fetch contacts");
    return response.json();
  }

  async getById(id: string): Promise<Contact | null> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      return contacts.find((c) => c.id === id) || null;
    }

    const response = await fetch(`/api/contacts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch contact");
    }
    return response.json();
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
    adminNotes?: string,
  ): Promise<Contact> {
    if (this.useMockApi) {
      const contact = await this.getById(id);
      if (!contact) throw new Error("Contact not found");

      // Update respondedAt when status changes to RESPONDED
      const respondedAt =
        status === "responded" ? new Date() : contact.respondedAt;

      useContactsStore.getState().updateContact(id, {
        adminNotes,
        respondedAt,
        status,
      });

      const updatedContact = await this.getById(id);
      if (!updatedContact) throw new Error("Contact not found after update");
      return updatedContact;
    }

    const response = await fetch(`/api/contacts/${id}/status`, {
      body: JSON.stringify({ adminNotes, status }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update contact status");
    return response.json();
  }

  async updateAdminNotes(id: string, adminNotes: string): Promise<Contact> {
    if (this.useMockApi) {
      useContactsStore.getState().updateContact(id, { adminNotes });
      const contact = await this.getById(id);
      if (!contact) throw new Error("Contact not found");
      return contact;
    }

    const response = await fetch(`/api/contacts/${id}/notes`, {
      body: JSON.stringify({ adminNotes }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update admin notes");
    return response.json();
  }

  async getByStatus(status: ContactStatus): Promise<Contact[]> {
    const contacts = await this.getAll();
    return contacts.filter((c) => c.status === status);
  }
}

export const contactsService = new ContactsService();
