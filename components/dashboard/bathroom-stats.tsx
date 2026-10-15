'use client';

import { useBathroomStats } from '@/lib/store/hydro-store';
import { BATHROOM_TYPES, type BathroomType } from '@/types';

export function BathroomStats() {
  const stats = useBathroomStats();

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Bathroom Visits</h2>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(BATHROOM_TYPES) as BathroomType[]).map((type) => (
          <div
            key={type}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border transition-transform hover:scale-[1.02]"
          >
            <span className="text-2xl">{BATHROOM_TYPES[type].emoji}</span>
            <div>
              <span className="text-xl font-bold">{stats[type]}</span>
              <span className="text-xs text-muted-foreground ml-1">times</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
