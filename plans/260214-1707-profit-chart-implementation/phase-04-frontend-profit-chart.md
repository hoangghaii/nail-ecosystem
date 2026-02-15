# Phase 4: Frontend - Profit Chart Component

**Date**: 2026-02-14
**Duration**: 1 day
**Priority**: High
**Status**: Pending

---

## Context

**Parent Plan**: `./plan.md`
**Dependencies**: Phase 1 (Analytics API), Phase 2 (Types)
**Blocked By**: Phase 1, Phase 2
**Blocks**: None

**Related Research**:
- `./research/researcher-01-recharts-financial-charts.md` (Recharts best practices)
- `./scout/scout-02-admin-ui-patterns.md` (dashboard card pattern)

---

## Overview

Build Recharts-based profit visualization with revenue/expense/profit lines, date range selector, summary cards, and responsive design. Integrates into DashboardPage.

---

## Key Insights from Research

1. **ResponsiveContainer**: ALWAYS wrap LineChart (research-01)
2. **Currency Formatting**: Use `Intl.NumberFormat` in tooltips (research-01)
3. **Mobile Optimization**: Disable animations, rotate X-axis labels (research-01)
4. **Performance**: <1000 points smooth; >5000 needs aggregation (research-01)
5. **Accessibility**: Use `accessibilityLayer={true}` in Recharts 3.0+ (research-01)
6. **Multi-line Pattern**: Revenue (blue), Expenses (red), Profit (green) (research-01)

---

## Requirements

### Functional Requirements
- FR1: Line chart with revenue/expense/profit lines
- FR2: Date range selector (Last 7/30/90 days, Custom)
- FR3: Summary cards (total revenue, expenses, profit)
- FR4: Responsive design (mobile 320px+, desktop)
- FR5: Custom tooltip with currency formatting
- FR6: Legend with toggle (future enhancement)
- FR7: Loading skeleton state

### Non-Functional Requirements
- NFR1: Chart loads in <2 seconds
- NFR2: Follows admin design system (blue theme)
- NFR3: Accessible (WCAG 2.2 AA)
- NFR4: Mobile-optimized (no animations, rotated labels)
- NFR5: Memoized to prevent re-renders

---

## Architecture

### Component Structure

```
apps/admin/src/
├── components/
│   └── analytics/
│       ├── ProfitChart.tsx           # Main chart component
│       ├── ProfitSummaryCards.tsx    # Revenue/Expense/Profit cards
│       ├── DateRangeSelector.tsx     # Preset + custom date picker
│       └── ChartTooltip.tsx          # Custom Recharts tooltip
├── hooks/
│   └── api/
│       └── useAnalytics.ts           # TanStack Query hook
└── services/
    └── analytics.service.ts          # API service
```

### Data Flow

```
DashboardPage
  └─> ProfitChart
        ├─> DateRangeSelector
        │     └─> setState(dateRange)
        ├─> useAnalytics({ startDate, endDate })
        │     └─> analyticsService.getProfit()
        ├─> ProfitSummaryCards ({ revenue, expenses, profit })
        └─> ResponsiveContainer
              └─> LineChart
                    ├─> Line (revenue, blue)
                    ├─> Line (expenses, red)
                    ├─> Line (profit, green)
                    └─> Tooltip (ChartTooltip)
```

---

## Files to Create

### Analytics Service
**File**: `/apps/admin/src/services/analytics.service.ts`

```typescript
import type { ProfitAnalytics, ProfitQueryParams } from '@repo/types/analytics';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export class AnalyticsService {
  async getProfit(params: ProfitQueryParams): Promise<ProfitAnalytics> {
    const queryString = new URLSearchParams();
    queryString.append('startDate', params.startDate);
    queryString.append('endDate', params.endDate);
    if (params.groupBy) queryString.append('groupBy', params.groupBy);

    const response = await fetch(`${API_URL}/analytics/profit?${queryString}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.json();
  }
}

export const analyticsService = new AnalyticsService();
```

### TanStack Query Hook
**File**: `/apps/admin/src/hooks/api/useAnalytics.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import type { ProfitQueryParams } from '@repo/types/analytics';
import { analyticsService } from '@/services/analytics.service';

export function useProfitAnalytics(params: ProfitQueryParams) {
  return useQuery({
    queryKey: ['analytics', 'profit', params],
    queryFn: () => analyticsService.getProfit(params),
    enabled: !!storage.get('auth_token', '') && !!params.startDate && !!params.endDate,
    staleTime: 60_000, // 60s cache for aggregated data
  });
}
```

### Custom Tooltip
**File**: `/apps/admin/src/components/analytics/ChartTooltip.tsx`

```typescript
import { TooltipProps } from 'recharts';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });
};

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border rounded-lg p-3 shadow-lg" role="tooltip">
      <p className="text-sm font-medium mb-2">{dateFormatter(label)}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          <span className="font-medium">{entry.name}:</span>{' '}
          {currencyFormatter.format(entry.value || 0)}
        </p>
      ))}
    </div>
  );
}
```

### Date Range Selector
**File**: `/apps/admin/src/components/analytics/DateRangeSelector.tsx`

```typescript
import { useState } from 'react';
import { addDays, format } from 'date-fns';

type DateRange = { startDate: string; endDate: string };

export function DateRangeSelector({ onChange }: { onChange: (range: DateRange) => void }) {
  const [preset, setPreset] = useState('30');

  const handlePresetChange = (days: string) => {
    setPreset(days);
    const endDate = new Date();
    const startDate = addDays(endDate, -parseInt(days));
    onChange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });
  };

  return (
    <div className="flex gap-2">
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Last 7 Days</SelectItem>
          <SelectItem value="30">Last 30 Days</SelectItem>
          <SelectItem value="90">Last 90 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      {preset === 'custom' && (
        <>
          <Input type="date" placeholder="Start date" />
          <Input type="date" placeholder="End date" />
        </>
      )}
    </div>
  );
}
```

### Summary Cards
**File**: `/apps/admin/src/components/analytics/ProfitSummaryCards.tsx`

```typescript
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);

export function ProfitSummaryCards({ revenue, expenses, profit }: {
  revenue: number;
  expenses: number;
  profit: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(revenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(profit)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Main Chart Component
**File**: `/apps/admin/src/components/analytics/ProfitChart.tsx`

```typescript
import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProfitAnalytics } from '@/hooks/api/useAnalytics';
import { ChartTooltip } from './ChartTooltip';
import { DateRangeSelector } from './DateRangeSelector';
import { ProfitSummaryCards } from './ProfitSummaryCards';
import { Card } from '@/components/ui/card';
import { addDays, format } from 'date-fns';

export function ProfitChart() {
  const [dateRange, setDateRange] = useState({
    startDate: format(addDays(new Date(), -30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data, isLoading } = useProfitAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    groupBy: 'day',
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

  const yAxisFormatter = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  if (isLoading) {
    return <div className="h-96 animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profit Overview</h2>
        <DateRangeSelector onChange={setDateRange} />
      </div>

      {data && (
        <>
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
                  top: 5,
                  right: 30,
                  left: isMobile ? -20 : 20,
                  bottom: isMobile ? 60 : 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 80 : 30}
                  interval={isMobile ? 7 : 0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
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
        </>
      )}
    </div>
  );
}
```

---

## Installation

```bash
cd /Users/hainguyen/Documents/nail-project
npm install recharts date-fns --workspace=admin
```

**Bundle Size**: Recharts ~50KB gzipped (acceptable)

---

## Integration with Dashboard

**File**: `/apps/admin/src/pages/DashboardPage.tsx`

```typescript
import { ProfitChart } from '@/components/analytics/ProfitChart';

export function DashboardPage() {
  return (
    <div className="container py-6 space-y-8">
      {/* Existing dashboard stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* ... existing stat cards ... */}
      </div>

      {/* Profit Chart */}
      <ProfitChart />

      {/* Other dashboard widgets */}
    </div>
  );
}
```

---

## Todo Checklist

### Setup
- [ ] Install recharts and date-fns: `npm install recharts date-fns --workspace=admin`
- [ ] Create AnalyticsService class
- [ ] Create useProfitAnalytics hook

### Components
- [ ] Create ChartTooltip with Intl.NumberFormat
- [ ] Create DateRangeSelector (preset + custom)
- [ ] Create ProfitSummaryCards (3 cards)
- [ ] Create ProfitChart with ResponsiveContainer
- [ ] Add mobile optimization (rotate labels, disable animations)
- [ ] Add loading skeleton state
- [ ] Add error state handling

### Integration
- [ ] Add ProfitChart to DashboardPage
- [ ] Test with real data (create expenses, complete bookings)
- [ ] Test date range selector
- [ ] Test mobile responsiveness (320px+)
- [ ] Test tooltip formatting
- [ ] Verify chart performance (<2s load)

### Polish
- [ ] Add empty state (no data in range)
- [ ] Add color-blind friendly palette
- [ ] Test accessibility (keyboard nav)
- [ ] Verify admin design system compliance

---

## Success Criteria

- [ ] Chart displays revenue/expense/profit lines
- [ ] Date range selector works (preset + custom)
- [ ] Summary cards show correct totals
- [ ] Tooltip formats currency correctly
- [ ] Mobile responsive (rotated X-axis, no animations)
- [ ] Chart loads in <2 seconds
- [ ] Follows admin blue theme
- [ ] No console errors
- [ ] Accessible (WCAG 2.2 AA)

---

## Performance Checklist (Research-01)

- [ ] ResponsiveContainer wraps LineChart
- [ ] Memoize chart component with React.memo
- [ ] Disable animations on mobile (`isAnimationActive={!isMobile}`)
- [ ] Remove dots on lines (`dot={false}`)
- [ ] Use Intl.NumberFormat (cached instance)
- [ ] Cache query results (staleTime: 60s)
- [ ] Test with 1000+ data points

---

## Accessibility Checklist (Research-01)

- [ ] Custom tooltip has `role="tooltip"`
- [ ] Chart wrapped in `<figure>` with `<figcaption>`
- [ ] Semantic color names in legend
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Color contrast meets WCAG 2.2 AA
- [ ] Avoid red/green only (use labels + colors)

---

## Risk Assessment

**Risk**: Recharts bundle size impact
- **Impact**: Low (~50KB gzipped)
- **Mitigation**: Code-split with React.lazy if needed

**Risk**: Performance with large datasets
- **Impact**: Medium (>1000 points may lag)
- **Mitigation**: Backend aggregation (groupBy=week/month)

**Risk**: Mobile chart readability
- **Impact**: Medium (cramped on small screens)
- **Mitigation**: Rotate X-axis labels, disable animations, larger touch targets

---

## Next Steps

After Phase 4:
1. Proceed to Phase 5 (Testing & Documentation)
2. Create seed data for testing (expenses + bookings)
3. User acceptance testing with stakeholders
4. Document chart usage in user guide

---

**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
