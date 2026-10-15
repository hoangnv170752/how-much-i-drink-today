'use client';

import { cn } from '@/lib/utils';
import { DRINK_TYPES, type DrinkType } from '@/types';

interface DrinkTypePickerProps {
  value: DrinkType | null;
  onChange: (type: DrinkType) => void;
}

export function DrinkTypePicker({ value, onChange }: DrinkTypePickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Drink Type</label>
      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(DRINK_TYPES) as DrinkType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
              value === type
                ? 'border-primary bg-primary/10'
                : 'border-transparent bg-muted hover:bg-muted/80'
            )}
          >
            <span className="text-2xl">{DRINK_TYPES[type].emoji}</span>
            <span className="text-xs">{DRINK_TYPES[type].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
