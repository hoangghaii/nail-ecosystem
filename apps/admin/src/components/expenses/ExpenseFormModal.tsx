/**
 * Expense Form Modal Component
 *
 * Shared form for creating and editing expenses
 */

import type { Expense } from '@repo/types/expense';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateExpense, useUpdateExpense } from '@/hooks/api/useExpenses';

const formSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount (e.g., 125.50)'),
  category: z.enum(['supplies', 'materials', 'utilities', 'other']),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ExpenseFormModalProps = {
  expense?: Expense;
  mode: 'create' | 'edit';
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function ExpenseFormModal({
  expense,
  mode,
  onOpenChange,
  open,
}: ExpenseFormModalProps) {
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();

  const form = useForm<FormData>({
    defaultValues: {
      amount: '',
      category: 'supplies',
      date: '',
      description: '',
    },
    resolver: zodResolver(formSchema),
  });

  // Reset form when expense changes or modal opens
  useEffect(() => {
    if (expense && mode === 'edit') {
      const dateStr = expense.date
        ? format(new Date(expense.date), 'yyyy-MM-dd')
        : '';
      form.reset({
        amount: expense.amount.toString(),
        category: expense.category,
        date: dateStr,
        description: expense.description || '',
      });
    } else if (mode === 'create') {
      form.reset({
        amount: '',
        category: 'supplies',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
      });
    }
  }, [expense, mode, form, open]);

  const onSubmit = async (values: FormData) => {
    const data = {
      amount: parseFloat(values.amount),
      category: values.category,
      date: new Date(values.date),
      description: values.description || undefined,
    };

    if (mode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (expense) {
      await updateMutation.mutateAsync({ data, id: expense._id });
    }

    onOpenChange(false);
    form.reset();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Expense' : 'Edit Expense'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Record a new business expense.'
              : 'Update expense information.'}
          </DialogDescription>
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
                    <Input
                      placeholder="125.50"
                      {...field}
                      disabled={isPending}
                    />
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
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
                    <Input type="date" {...field} disabled={isPending} />
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
                    <Textarea
                      placeholder="Add notes about this expense..."
                      rows={3}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                    ? 'Create Expense'
                    : 'Update Expense'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
