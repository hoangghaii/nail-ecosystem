import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@repo/utils/api';
import type { ContactStatus } from '@/types/contact.types';
import { contactsService } from '@/services/contacts.service';

/**
 * Query: Get all contacts with optional status filter
 */
export function useContacts(filters?: { status?: ContactStatus }) {
  return useQuery({
    queryKey: queryKeys.contacts.list(filters),
    queryFn: async () => {
      if (filters?.status) {
        return contactsService.getByStatus(filters.status);
      }
      return contactsService.getAll();
    },
  });
}

/**
 * Query: Get contact by ID
 */
export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id!),
    queryFn: () => contactsService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Mutation: Update contact status
 */
export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: ContactStatus;
      adminNotes?: string;
    }) => contactsService.updateStatus(id, status, adminNotes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.setQueryData(queryKeys.contacts.detail(updated.id), updated);
      toast.success('Contact status updated successfully');
    },
  });
}

/**
 * Mutation: Update contact admin notes
 */
export function useUpdateContactNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes: string }) =>
      contactsService.updateAdminNotes(id, adminNotes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.setQueryData(queryKeys.contacts.detail(updated.id), updated);
      toast.success('Admin notes updated successfully');
    },
  });
}

/**
 * Mutation: Mark contact as read (update status to 'read')
 */
export function useMarkContactAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsService.updateStatus(id, 'read'),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.setQueryData(queryKeys.contacts.detail(updated.id), updated);
      toast.success('Contact marked as read');
    },
  });
}
