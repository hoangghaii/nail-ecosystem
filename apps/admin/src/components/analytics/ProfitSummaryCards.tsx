/**
 * Profit Summary Cards Component
 *
 * Displays revenue, expenses, and profit totals
 */

import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

type ProfitSummaryCardsProps = {
  revenue: number;
  expenses: number;
  profit: number;
};

export function ProfitSummaryCards({
  revenue,
  expenses,
  profit,
}: ProfitSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(revenue)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(expenses)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(profit)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
