import type { PaginationResponse } from "@repo/types/pagination";

import { queryKeys } from "@repo/utils/api";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { Contact, ContactStatus } from "@/types/contact.types";

import {
  contactsService,
  type ContactsQueryParams,
} from "@/services/contacts.service";
import { useAuthStore } from "@/store/authStore";

/**
 * Query: Get all contacts with backend filtering
 */
export function useContacts(filters?: ContactsQueryParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<Contact[]>({
    enabled: isAuthenticated,
    // @ts-expect-error - keepPreviousData exists in v4
    keepPreviousData: true, // Show old data while fetching new (smooth UX)
    queryFn: () => contactsService.getAll(filters),

    queryKey: queryKeys.contacts.list(filters),
    // Cache configuration
    staleTime: 30_000, // Consider data fresh for 30s
  });
}

/**
 * Query: Get all contacts with infinite scroll
 */
export function useInfiniteContacts(
  params: Omit<ContactsQueryParams, "page"> = {},
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useInfiniteQuery<
    PaginationResponse<Contact>,
    Error,
    InfiniteData<PaginationResponse<Contact>>,
    ReturnType<typeof queryKeys.contacts.list>,
    number
  >({
    enabled: isAuthenticated,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      contactsService.getAllPaginated({ ...params, limit: 20, page: pageParam }),
    queryKey: queryKeys.contacts.list(params),
    staleTime: 30_000,
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
