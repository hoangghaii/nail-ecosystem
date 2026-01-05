import { queryKeys } from "@repo/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ContactStatus } from "@/types/contact.types";

import { contactsService } from "@/services/contacts.service";
import { storage } from "@/services/storage.service";

/**
 * Query: Get all contacts with optional status filter
 */
export function useContacts(filters?: { status?: ContactStatus }) {
  return useQuery({
    // Don't run query if no auth token (prevents 401 errors on mount)
    enabled: !!storage.get("auth_token", ""),
    queryFn: async () => {
      if (filters?.status) {
        return contactsService.getByStatus(filters.status);
      }
      return contactsService.getAll();
    },
    queryKey: queryKeys.contacts.list(filters),
  });
}

/**
 * Query: Get contact by ID
 */
export function useContact(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => contactsService.getById(id!),
    queryKey: queryKeys.contacts.detail(id!),
  });
}

/**
 * Mutation: Update contact status
 */
export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminNotes,
      id,
      status,
    }: {
      adminNotes?: string;
      id: string;
      status: ContactStatus;
    }) => contactsService.updateStatus(id, status, adminNotes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.setQueryData(queryKeys.contacts.detail(updated._id), updated);
      toast.success("Contact status updated successfully");
    },
  });
}

/**
 * Mutation: Update contact admin notes
 */
export function useUpdateContactNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminNotes, id }: { adminNotes: string; id: string }) =>
      contactsService.updateAdminNotes(id, adminNotes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.setQueryData(queryKeys.contacts.detail(updated._id), updated);
      toast.success("Admin notes updated successfully");
    },
  });
}

/**
 * Mutation: Mark contact as read (update status to 'read')
 */
export function useMarkContactAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsService.updateStatus(id, "read"),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.setQueryData(queryKeys.contacts.detail(updated._id), updated);
      toast.success("Contact marked as read");
    },
  });
}
