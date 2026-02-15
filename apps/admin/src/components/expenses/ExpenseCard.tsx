/**
 * Expense Card Component
 *
 * Displays expense item with edit/delete actions
 */

import { useState } from 'react';
import type { Expense } from '@repo/types/expense';
import { Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useDeleteExpense } from '@/hooks/api/useExpenses';
import { ExpenseFormModal } from './ExpenseFormModal';

type ExpenseCardProps = {
  expense: Expense;
};

const categoryLabels: Record<string, string> = {
  supplies: 'Supplies',
  materials: 'Materials',
  utilities: 'Utilities',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  supplies: 'bg-blue-100 text-blue-700',
  materials: 'bg-green-100 text-green-700',
  utilities: 'bg-amber-100 text-amber-700',
  other: 'bg-gray-100 text-gray-700',
};

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteExpense();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(expense._id);
    setShowDeleteDialog(false);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: expense.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[expense.category]}`}
              >
                {categoryLabels[expense.category]}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(expense.date)}
              </div>
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-primary">
              <DollarSign className="h-5 w-5" />
              {formatCurrency(expense.amount)}
            </div>
          </div>
        </CardHeader>

        {expense.description && (
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{expense.description}</p>
          </CardContent>
        )}

        <CardFooter className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="flex-1"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {showEditModal && (
        <ExpenseFormModal
          mode="edit"
          expense={expense}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
