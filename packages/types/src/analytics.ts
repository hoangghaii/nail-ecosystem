export type ProfitAnalytics = {
  revenue: number;
  expenses: number;
  profit: number;
  bookingsCount: number;
  expensesCount: number;
  chartData: ChartDataPoint[];
};

export type ChartDataPoint = {
  date: string; // "2026-02-01" (ISO date string) or "2026-W05" (week) or "2026-02" (month)
  revenue: number;
  expenses: number;
  profit: number;
};

export type ProfitQueryParams = {
  startDate: string; // ISO 8601
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
};
