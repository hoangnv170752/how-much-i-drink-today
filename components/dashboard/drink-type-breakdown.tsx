'use client';

import { useDrinkTypeBreakdown } from '@/lib/store/hydro-store';
import { DRINK_TYPES, type DrinkType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

const TYPE_COLORS: Record<DrinkType, { bg: string; text: string; ring: string }> = {
  water: { bg: 'from-emerald-50 to-emerald-100/50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  coffee: { bg: 'from-amber-50 to-amber-100/50', text: 'text-amber-700', ring: 'ring-amber-200' },
  soda: { bg: 'from-orange-50 to-orange-100/50', text: 'text-orange-700', ring: 'ring-orange-200' },
  alcohol: { bg: 'from-purple-50 to-purple-100/50', text: 'text-purple-700', ring: 'ring-purple-200' },
  other: { bg: 'from-gray-50 to-gray-100/50', text: 'text-gray-700', ring: 'ring-gray-200' },
};

export function DrinkTypeBreakdown() {
  const breakdown = useDrinkTypeBreakdown();

  return (
    <Card className="border-0 shadow-md bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      <CardContent className="pt-5 pb-4">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#6BBF4E] to-[#3D6F2B]" />
            Today&apos;s Breakdown
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(DRINK_TYPES) as DrinkType[]).map((type) => {
              const colors = TYPE_COLORS[type];
              const amount = breakdown[type];
              const hasAmount = amount > 0;

              return (
                <div
                  key={type}
                  className={`
                    relative flex flex-col items-center p-3 rounded-xl
                    bg-gradient-to-b ${colors.bg}
                    ring-1 ${colors.ring}
                    transition-all duration-200
                    ${hasAmount ? 'hover:scale-105 hover:shadow-md' : 'opacity-50'}
                  `}
                >
                  <span className={`text-2xl mb-1 ${hasAmount ? '' : 'grayscale'}`}>
                    {DRINK_TYPES[type].emoji}
                  </span>
                  <span className={`text-base font-bold ${colors.text}`}>
                    {amount}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    ml
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
