/**
 * Contacts API Hooks (Client)
 *
 * TanStack Query hooks for contact form submissions
 */

import type { ContactFormData } from "@repo/types/contact";

import { useMutation } from "@tanstack/react-query";

import { contactsService } from "@/services/contacts.service";

/**
 * Mutation: Submit contact form
 */
export function useContactMutation() {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactsService.create(data),
  });
}
