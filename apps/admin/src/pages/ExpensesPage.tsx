/**
 * Expenses Page
 *
 * Manage business expenses with infinite scroll, filters, and CRUD operations
 */

import { useState } from 'react';
import type { ExpenseCategory } from '@repo/types/expense';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { InfiniteScrollTrigger } from '@/components/layout/shared/infinite-scroll-trigger';
import { useInfiniteExpenses } from '@/hooks/api/useExpenses';

export function ExpensesPage() {
  const [category, setCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteExpenses({
      category: (category === 'all' ? undefined : category) as ExpenseCategory | undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

  const totalExpenses = data?.pages[0]?.pagination.total || 0;

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Manage business expenses and track spending
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse bg-muted rounded-lg"
            />
          ))}
        </div>
      ) : totalExpenses === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No expenses found</p>
          <p className="text-sm text-muted-foreground mt-2">
            {category !== 'all' || startDate || endDate
              ? 'Try adjusting your filters'
              : 'Get started by adding your first expense'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {totalExpenses} {totalExpenses === 1 ? 'expense' : 'expenses'}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.pages.map((page) =>
              page.data.map((expense) => (
                <ExpenseCard key={expense._id} expense={expense} />
              ))
            )}
          </div>

          <InfiniteScrollTrigger
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </>
      )}

      <ExpenseFormModal
        mode="create"
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
