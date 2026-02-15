/**
 * Chart Tooltip Component
 *
 * Custom Recharts tooltip with currency formatting
 */

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

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
};

export function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg" role="tooltip">
      <p className="text-sm font-medium mb-2">{dateFormatter(label || '')}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          <span className="font-medium">{entry.name}:</span>{' '}
          {currencyFormatter.format(entry.value || 0)}
        </p>
      ))}
    </div>
  );
}
