/**
 * Chart Tooltip Component
 *
 * Custom Recharts tooltip with currency formatting
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: 'currency',
});

const dateFormatter = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
};

type TooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
};

export function ChartTooltip({ active, label, payload }: TooltipProps) {
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
