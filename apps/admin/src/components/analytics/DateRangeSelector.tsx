/**
 * Date Range Selector Component
 *
 * Preset date ranges and custom date picker
 */

import { addDays, format } from 'date-fns';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DateRange = { endDate: string; startDate: string; };

type DateRangeSelectorProps = {
  onChange: (range: DateRange) => void;
};

export function DateRangeSelector({ onChange }: DateRangeSelectorProps) {
  const [preset, setPreset] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handlePresetChange = (days: string) => {
    setPreset(days);

    if (days === 'custom') {
      // Don't auto-update when switching to custom
      return;
    }

    const endDate = new Date();
    const startDate = addDays(endDate, -parseInt(days));
    onChange({
      endDate: format(endDate, 'yyyy-MM-dd'),
      startDate: format(startDate, 'yyyy-MM-dd'),
    });
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      onChange({
        endDate: customEndDate,
        startDate: customStartDate,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="space-y-2 flex-shrink-0">
        <Label htmlFor="preset">Date Range</Label>
        <Select value={preset} onValueChange={handlePresetChange}>
          <SelectTrigger id="preset" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {preset === 'custom' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="customStart">Start Date</Label>
            <Input
              id="customStart"
              type="date"
              value={customStartDate}
              onChange={(e) => {
                setCustomStartDate(e.target.value);
                if (e.target.value && customEndDate) {
                  handleCustomDateChange();
                }
              }}
              className="w-[160px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customEnd">End Date</Label>
            <Input
              id="customEnd"
              type="date"
              value={customEndDate}
              onChange={(e) => {
                setCustomEndDate(e.target.value);
                if (customStartDate && e.target.value) {
                  onChange({
                    endDate: e.target.value,
                    startDate: customStartDate,
                  });
                }
              }}
              className="w-[160px]"
            />
          </div>
        </>
      )}
    </div>
  );
}
