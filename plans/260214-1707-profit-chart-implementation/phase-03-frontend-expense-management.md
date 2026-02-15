# Phase 3: Frontend - Expense Management Page

**Date**: 2026-02-14
**Duration**: 1 day
**Priority**: High
**Status**: Pending

---

## Context

**Parent Plan**: `./plan.md`
**Dependencies**: Phase 1 (API), Phase 2 (Types)
**Blocked By**: Phase 1, Phase 2
**Blocks**: None (parallel with Phase 4)

**Related Research**:
- `./scout/scout-02-admin-ui-patterns.md` (React patterns)
- `./scout/scout-03-types-hooks-patterns.md` (TanStack Query)

---

## Overview

Build expense management UI with infinite scroll, debounced search, category/date filters, and CRUD modal. Replicates GalleryPage patterns exactly (scout-02).

---

## Key Insights

1. **Infinite Scroll**: 20 items/page, IntersectionObserver (scout-02)
2. **Debounced Search**: 300ms delay using `useDebounce` from @repo/utils (scout-02)
3. **Form Modal**: React Hook Form + Zod, shared for create/edit (scout-02)
4. **TanStack Query**: useInfiniteQuery pattern with initialPageParam (scout-03)
5. **Service Layer**: Singleton class pattern (scout-02)

---

## Requirements

### Functional Requirements
- FR1: List expenses with infinite scroll
- FR2: Filter by category (dropdown)
- FR3: Filter by date range (date pickers)
- FR4: Search by description (debounced)
- FR5: Create expense (modal form)
- FR6: Edit expense (modal form)
- FR7: Delete expense (confirmation dialog)
- FR8: Responsive design (mobile + desktop)

### Non-Functional Requirements
- NFR1: Follows admin design system (blue theme, glassmorphism)
- NFR2: Form validation with Zod
- NFR3: Loading states (skeletons)
- NFR4: Toast notifications
- NFR5: Accessibility (keyboard nav, ARIA labels)

---

## Architecture

### Component Structure

```
apps/admin/src/
├── pages/
│   └── ExpensesPage.tsx              # Main page with filters + list
├── components/
│   └── expenses/
│       ├── ExpenseCard.tsx           # Display card (mobile/desktop)
│       ├── ExpenseFormModal.tsx      # Create/edit modal
│       └── ExpenseFilters.tsx        # Category + date range filters
├── hooks/
│   └── api/
│       └── useExpenses.ts            # TanStack Query hooks
└── services/
    └── expense.service.ts            # API service class
```

### Data Flow

```
ExpensesPage
  ├─> ExpenseFilters (category, date range, search)
  │     └─> useDebounce(300ms)
  ├─> useInfiniteExpenses({ filters })
  │     └─> expenseService.getAll()
  ├─> ExpenseCard[] (map pages)
  │     └─> ExpenseFormModal (edit)
  │     └─> AlertDialog (delete)
  └─> InfiniteScrollTrigger
        └─> fetchNextPage()
```

---

## Files to Create

### Service Layer
**File**: `/apps/admin/src/services/expense.service.ts`

```typescript
import type { Expense, ExpenseQueryParams, ExpenseResponse } from '@repo/types/expense';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export class ExpenseService {
  async getAll(params?: ExpenseQueryParams): Promise<ExpenseResponse> {
    const queryString = new URLSearchParams();
    if (params?.category) queryString.append('category', params.category);
    if (params?.startDate) queryString.append('startDate', params.startDate);
    if (params?.endDate) queryString.append('endDate', params.endDate);
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());

    const response = await fetch(`${API_URL}/expenses?${queryString}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.json();
  }

  async create(data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  }
}

export const expenseService = new ExpenseService();
```

### TanStack Query Hooks
**File**: `/apps/admin/src/hooks/api/useExpenses.ts`

```typescript
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExpenseQueryParams } from '@repo/types/expense';
import { expenseService } from '@/services/expense.service';
import { toast } from 'sonner';

export function useInfiniteExpenses(params: Omit<ExpenseQueryParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['expenses', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      expenseService.getAll({ ...params, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!storage.get('auth_token', ''),
    staleTime: 30_000,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created');
    },
    onError: () => toast.error('Failed to create expense'),
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated');
    },
    onError: () => toast.error('Failed to update expense'),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted');
    },
    onError: () => toast.error('Failed to delete expense'),
  });
}
```

### Form Modal
**File**: `/apps/admin/src/components/expenses/ExpenseFormModal.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ExpenseCategory } from '@repo/types/expense';
import { useCreateExpense, useUpdateExpense } from '@/hooks/api/useExpenses';

const formSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  category: z.enum(['supplies', 'materials', 'utilities', 'other']),
  date: z.string().min(1, 'Date required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ExpenseFormModal({ mode, expense, onSuccess }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: expense || { amount: '', category: 'supplies', date: '', description: '' },
  });

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();

  const onSubmit = async (values: FormData) => {
    const data = {
      ...values,
      amount: parseFloat(values.amount), // Convert to number for API
      date: new Date(values.date),
    };

    if (mode === 'create') {
      await createMutation.mutateAsync(data);
    } else {
      await updateMutation.mutateAsync({ id: expense._id, data });
    }
    onSuccess();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Expense' : 'Edit Expense'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="125.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplies">Supplies</SelectItem>
                      <SelectItem value="materials">Materials</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Expenses Page
**File**: `/apps/admin/src/pages/ExpensesPage.tsx`

```typescript
import { useState } from 'react';
import { useDebounce } from '@repo/utils/hooks';
import { useInfiniteExpenses } from '@/hooks/api/useExpenses';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { InfiniteScrollTrigger } from '@/components/layout/shared/InfiniteScrollTrigger';

export function ExpensesPage() {
  const [category, setCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteExpenses({
    category: category === 'all' ? undefined : category,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <ExpenseFilters
        category={category}
        onCategoryChange={setCategory}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.pages.map((page) =>
            page.data.map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} />
            ))
          )}
        </div>
      )}

      <InfiniteScrollTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      <ExpenseFormModal mode="create" onSuccess={() => setShowModal(false)} />
    </div>
  );
}
```

---

## Todo Checklist

- [ ] Create ExpenseService class with CRUD methods
- [ ] Create useInfiniteExpenses hook
- [ ] Create useCreateExpense mutation
- [ ] Create useUpdateExpense mutation
- [ ] Create useDeleteExpense mutation
- [ ] Create ExpenseFormModal (React Hook Form + Zod)
- [ ] Create ExpenseFilters component
- [ ] Create ExpenseCard component
- [ ] Create ExpensesPage with infinite scroll
- [ ] Add route to router: `/expenses`
- [ ] Add to navigation menu
- [ ] Test create expense flow
- [ ] Test edit expense flow
- [ ] Test delete expense flow
- [ ] Test filters (category, date range)
- [ ] Test search with debounce
- [ ] Test mobile responsiveness

---

## Success Criteria

- [ ] Expense list loads with infinite scroll
- [ ] Filters work (category, date range, search)
- [ ] Create/edit modal validates input (Zod)
- [ ] Delete shows confirmation dialog
- [ ] Toast notifications on success/error
- [ ] Mobile responsive (320px+)
- [ ] Debounced search works (300ms delay)
- [ ] Loading states visible
- [ ] Follows admin design system

---

**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
