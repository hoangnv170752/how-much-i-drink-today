'use client';

import { useState } from 'react';
import { useHydroStore } from '@/lib/store/hydro-store';
import { BATHROOM_TYPES, type BathroomType } from '@/types';

export function AddBathroomButton() {
  const [isLoading, setIsLoading] = useState<BathroomType | null>(null);
  const addBathroomLog = useHydroStore((state) => state.addBathroomLog);

  const handleAdd = async (type: BathroomType) => {
    setIsLoading(type);
    try {
      await addBathroomLog(type);
    } catch (error) {
      console.error('Failed to add bathroom log:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      {(Object.keys(BATHROOM_TYPES) as BathroomType[]).map((type) => (
        <button
          key={type}
          onClick={() => handleAdd(type)}
          disabled={isLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-card border hover:bg-accent transition-colors disabled:opacity-50"
        >
          <span className="text-xl">{BATHROOM_TYPES[type].emoji}</span>
          <span className="text-sm font-medium">
            {isLoading === type ? 'Adding...' : BATHROOM_TYPES[type].label}
          </span>
        </button>
      ))}
    </div>
  );
}
