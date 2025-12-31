import { create } from "zustand";

import type { Contact } from "@/types/contact.types";

import { mockContacts } from "@/data/mockContacts";

type ContactsState = {
  contacts: Contact[];
  initializeContacts: () => void;
  isInitialized: boolean;
  setContacts: (contacts: Contact[]) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],

  initializeContacts: () => {
    if (!get().isInitialized) {
      set({ contacts: mockContacts, isInitialized: true });
    }
  },

  isInitialized: false,

  setContacts: (contacts) => {
    set({ contacts });
  },

  updateContact: (id, data) => {
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...data } : contact,
      ),
    }));
  },
}));
