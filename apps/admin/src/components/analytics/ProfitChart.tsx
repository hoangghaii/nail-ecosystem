/**
 * Profit Chart Component
 *
 * Recharts-based visualization with revenue/expense/profit lines
 */

import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card } from "@/components/ui/card";
import { useProfitAnalytics } from "@/hooks/api/useAnalytics";

import { ChartTooltip } from "./ChartTooltip";
import { DateRangeSelector } from "./DateRangeSelector";
import { ProfitSummaryCards } from "./ProfitSummaryCards";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useMemo(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(query);
      const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [query]);

  return matches;
};

export function ProfitChart() {
  const [dateRange, setDateRange] = useState({
    endDate: format(new Date(), "yyyy-MM-dd"),
    startDate: format(addDays(new Date(), -30), "yyyy-MM-dd"),
  });

  const { data, error, isLoading } = useProfitAnalytics({
    endDate: dateRange.endDate,
    groupBy: "day",
    startDate: dateRange.startDate,
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const yAxisFormatter = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-[180px] bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Profit Overview</h2>
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Failed to load profit data. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-2xl font-bold">Profit Overview</h2>
          <DateRangeSelector onChange={setDateRange} />
        </div>
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No data available for the selected date range.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl font-bold">Profit Overview</h2>
        <DateRangeSelector onChange={setDateRange} />
      </div>

      <ProfitSummaryCards
        revenue={data.revenue}
        expenses={data.expenses}
        profit={data.profit}
      />

      <Card className="p-6">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <LineChart
            data={data.chartData}
            margin={{
              bottom: isMobile ? 60 : 5,
              left: isMobile ? -20 : 20,
              right: 30,
              top: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 80 : 30}
              interval={isMobile ? Math.floor(data.chartData.length / 4) : 0}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Revenue"
              isAnimationActive={!isMobile}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Expenses"
              isAnimationActive={!isMobile}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Profit"
              isAnimationActive={!isMobile}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
