'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AMOUNT_PRESETS } from '@/types';

interface AmountInputProps {
  value: number | '';
  onChange: (amount: number | '') => void;
}

export function AmountInput({ value, onChange }: AmountInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Amount (ml)</label>

      <div className="flex gap-2">
        {AMOUNT_PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={value === preset ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(preset)}
            className="flex-1"
          >
            {preset === 1000 ? '1L' : `${preset}ml`}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Input
          type="number"
          placeholder="Custom amount"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? '' : parseInt(val, 10));
          }}
          min={1}
          max={5000}
          className="pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          ml
        </span>
      </div>
    </div>
  );
}
