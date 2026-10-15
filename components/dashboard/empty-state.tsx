'use client';

import { Droplets, Plus } from 'lucide-react';

const QUICK_ADD_OPTIONS = [
  { label: 'Glass of Water', emoji: '💧', amount: 250 },
  { label: 'Water Bottle', emoji: '🫗', amount: 500 },
  { label: 'Coffee/Tea', emoji: '☕', amount: 300 },
];

export function EmptyState() {
  return (
    <div className="relative py-8 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-4 w-8 h-10 rounded-full bg-gradient-to-b from-[#6BBF4E]/20 to-[#6BBF4E]/5 blur-sm animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-16 right-8 w-6 h-8 rounded-full bg-gradient-to-b from-[#6BBF4E]/15 to-[#6BBF4E]/5 blur-sm animate-float" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-20 left-1/4 w-5 h-6 rounded-full bg-gradient-to-b from-[#6BBF4E]/10 to-transparent blur-sm animate-float" style={{ animationDelay: '1.4s' }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center text-center space-y-6">
        {/* Illustrated empty glass */}
        <div className="relative w-24 h-28">
          {/* Glass shape */}
          <div className="absolute inset-0 rounded-b-3xl rounded-t-xl bg-gradient-to-b from-gray-100 to-gray-50 border border-gray-200/50 shadow-inner overflow-hidden">
            {/* Empty water level indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[#6BBF4E]/20 to-transparent" />
            {/* Glass reflection */}
            <div className="absolute top-2 left-2 w-1 h-12 rounded-full bg-white/60" />
          </div>
          {/* Droplet icon floating above */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-float">
            <div className="relative">
              <Droplets className="w-8 h-8 text-[#6BBF4E]" />
              <div className="absolute inset-0 bg-[#6BBF4E]/20 blur-md rounded-full" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Start Your Hydration Journey
          </h3>
          <p className="text-sm text-muted-foreground max-w-[240px]">
            Track your daily water intake and stay healthy. Tap the button below to log your first drink!
          </p>
        </div>

        {/* Quick add suggestions */}
        <div className="w-full space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Quick add suggestions
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ADD_OPTIONS.map((option, i) => (
              <button
                key={i}
                className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-b from-[#6BBF4E]/5 to-[#6BBF4E]/10 border border-[#6BBF4E]/20 hover:border-[#6BBF4E]/40 hover:from-[#6BBF4E]/10 hover:to-[#6BBF4E]/15 transition-all duration-200"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {option.emoji}
                </span>
                <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  {option.amount}ml
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Call to action hint */}
        <div className="flex items-center gap-2 text-sm text-[#6BBF4E] font-medium">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#6BBF4E] text-white">
            <Plus className="w-4 h-4" />
          </div>
          <span>Tap + to log a drink</span>
        </div>
      </div>
    </div>
  );
}
