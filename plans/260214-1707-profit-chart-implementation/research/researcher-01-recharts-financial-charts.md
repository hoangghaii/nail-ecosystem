# Recharts Financial Charts: Research Report
**Date**: 2025-02-14 | **Focus**: Production-ready profit chart patterns

---

## 1. Recommended Recharts Configuration

Recharts: React-specific, SVG-based, declarative. **Best for**: <5k points. **Limitation**: Dense financial data→ApexCharts. **Advantage**: responsive setup.

```tsx
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={data} accessibilityLayer={true}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
    <Tooltip content={<CustomTooltip />} />
    <Line dataKey="profit" stroke="#059669" dot={false} />
  </LineChart>
</ResponsiveContainer>
```

---

## 2. Responsive Mobile Design

Use `ResponsiveContainer` + media-query hook. Mobile: 300px height, rotate XAxis, hide legend, disable animations (~200ms improvement).

```tsx
<LineChart margin={{ left: isMobile ? -25 : 60, bottom: isMobile ? 80 : 20 }}>
  <XAxis angle={isMobile ? -45 : 0} interval={isMobile ? 7 : 0} />
  <Line isAnimationActive={!isMobile} />
</LineChart>
```

---

## 3. Currency & Date Formatting in Tooltips

```tsx
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  });
  const dateStr = new Date(label).toLocaleDateString('en-US',
    { month: 'short', day: 'numeric', year: '2-digit' }
  );
  return (
    <div className="bg-white p-3 border rounded" role="tooltip">
      <p>{dateStr}</p>
      {payload.map(e => (
        <p key={e.name} style={{ color: e.color }}>
          {e.name}: {formatter.format(e.value)}
        </p>
      ))}
    </div>
  );
};
```

**Key**: `Intl.NumberFormat` for locale currency; ISO dates prevent timezone bugs.

---

## 4. Date Range Filtering Performance

Keep full dataset; filter client-side with debounce.

```tsx
const debouncedFilter = useDebounce((range) => setDateRange(range), 300);
const filteredData = useMemo(() =>
  data.filter(d => d.date >= start && d.date <= end),
  [data, dateRange]
);
```

**For large datasets**: Aggregate backend (daily→weekly); request ~200-300 points max.

---

## 5. Performance Optimization Checklist

| Issue | Solution | Impact |
|-------|----------|--------|
| Re-renders | `React.memo()` | ~50ms |
| 5k+ points | Data aggregation | ~300ms |
| Hover lag | Native debounce | ~100ms |
| Large SVG | Remove dots on dense | ~150ms |
| Mobile animations | `isAnimationActive={false}` | ~200ms |

**Benchmark**: ~1000 points smooth; 5000+ requires optimization.

---

## 6. Accessibility (WCAG 2.2 AA)

Enable in Recharts 3.0+:
```tsx
<LineChart accessibilityLayer={true} data={data}>
  {/* ARIA labels, keyboard nav (arrow keys) */}
</LineChart>
```

Manual: Semantic HTML `<figure><figcaption>`, tooltip `role="tooltip"`, data table fallback for screen readers, avoid red/green only.

**Gap**: No table fallback built-in; provide separate.

---

## 7. Multi-Line Pattern (Revenue/Expense/Profit)

```tsx
<LineChart data={data}>
  <Line dataKey="revenue" stroke="#3b82f6" name="Revenue" />
  <Line dataKey="expense" stroke="#ef4444" name="Expense" />
  <Line dataKey="profit" stroke="#059669" dot={false} />
  <Legend wrapperStyle={{ paddingTop: '20px' }} />
</LineChart>
```

Colorblind-safe palette, toggle via legend, clear labels.

---

## 8. Production Checklist

- [ ] `ResponsiveContainer` always
- [ ] `Intl.NumberFormat` for currency
- [ ] Test 1000+ points; optimize if >200ms
- [ ] Memoize chart component
- [ ] `accessibilityLayer={true}` (v3.0+)
- [ ] Data table for screen readers
- [ ] Mobile testing (landscape/portrait)
- [ ] Debounce filters; cache results
- [ ] ISO dates; no timezone ambiguity
- [ ] Loading skeleton

---

## Unresolved Questions

1. Single profit line vs multi-line (revenue/expense/profit)?
2. Date granularity: daily/weekly/monthly?
3. Legend toggle for metric visibility?
4. CSV/PDF export needed?

---

## Sources

- [Recharts: Analytics Dashboards](https://embeddable.com/blog/what-is-recharts)
- [Best React Chart Libraries 2025](https://embeddable.com/blog/react-chart-libraries)
- [Awesome React Charts Tips](https://leanylabs.com/blog/awesome-react-charts-tips/)
- [Accessible Interactive Charts](https://www.deque.com/blog/how-to-make-interactive-charts-accessible/)
- [Recharts Accessibility](https://github.com/recharts/recharts/wiki/Recharts-and-accessibility)
- [Accessible Data Visualisations](https://www.a11y-collective.com/blog/accessible-charts/)
- [Custom Style Recharts](https://www.paigeniedringhaus.com/blog/build-and-custom-style-recharts-data-charts/)
- [Custom Tooltips Recharts](https://medium.com/@rutudhokchaule/implementing-custom-tooltips-and-legends-using-recharts-98b6e3c8b712)
