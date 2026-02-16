/**
 * Expense Query Hooks
 *
 * TanStack Query hooks for expense operations
 */

import type { Expense, ExpenseQueryParams, ExpenseResponse } from '@repo/types/expense';

import { queryKeys } from '@repo/utils/api';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { expenseService } from '@/services/expense.service';
import { storage } from '@/services/storage.service';

type UseExpensesOptions = ExpenseQueryParams &
  Omit<
    UseQueryOptions<ExpenseResponse, Error>,
    'queryKey' | 'queryFn'
  >;

/**
 * Query: Get all expenses
 */
export function useExpenses(options?: UseExpensesOptions) {
  const {
    category,
    endDate,
    limit,
    page,
    sortBy,
    sortOrder,
    startDate,
    ...queryOptions
  } = options || {};

  const filters: ExpenseQueryParams | undefined =
    startDate || endDate || category || page || limit || sortBy || sortOrder
      ? { category, endDate, limit, page, sortBy, sortOrder, startDate }
      : undefined;

  return useQuery({
    enabled: queryOptions.enabled !== false && !!storage.get('auth_token', ''),
    queryFn: () => expenseService.getAll(filters),
    queryKey: queryKeys.expenses.list(filters),
    staleTime: 30_000,
    ...queryOptions,
  });
}

/**
 * Query: Get all expenses with infinite scroll
 */
export function useInfiniteExpenses(
  params: Omit<ExpenseQueryParams, 'page'> = {},
) {
  return useInfiniteQuery<
    ExpenseResponse,
    Error,
    InfiniteData<ExpenseResponse>,
    ReturnType<typeof queryKeys.expenses.list>,
    number
  >({
    enabled: !!storage.get('auth_token', ''),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      expenseService.getAll({ ...params, limit: 20, page: pageParam }),
    queryKey: queryKeys.expenses.list(params),
    staleTime: 30_000,
  });
}

/**
 * Query: Get expense by ID
 */
export function useExpense(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => expenseService.getById(id!),
    queryKey: queryKeys.expenses.detail(id!),
  });
}

/**
 * Mutation: Create expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt' | 'currency'>) =>
      expenseService.create(data),
    onError: () => {
      toast.error('Failed to create expense');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      toast.success('Expense created successfully');
    },
  });
}

/**
 * Mutation: Update expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: Partial<Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>>;
      id: string;
    }) => expenseService.update(id, data),
    onError: () => {
      toast.error('Failed to update expense');
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      queryClient.setQueryData(queryKeys.expenses.detail(updated._id), updated);
      toast.success('Expense updated successfully');
    },
  });
}

/**
 * Mutation: Delete expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onError: () => {
      toast.error('Failed to delete expense');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      toast.success('Expense deleted successfully');
    },
  });
}
