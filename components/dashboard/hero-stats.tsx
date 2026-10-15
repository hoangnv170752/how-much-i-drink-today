'use client';

import { useTotalMl, useProgress, useDailyGoal } from '@/lib/store/hydro-store';
import { Droplets } from 'lucide-react';

export function HeroStats() {
  const totalMl = useTotalMl();
  const progress = useProgress();
  const dailyGoal = useDailyGoal();

  const clampedProgress = Math.min(progress, 100);
  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  // Water fill height based on progress (0-100%)
  const waterHeight = Math.min(progress, 100);

  return (
    <div className="relative flex flex-col items-center gap-6 py-4">
      {/* Background decorative drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-8 w-3 h-4 rounded-full bg-[#3B82F6]/10 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-12 right-12 w-2 h-3 rounded-full bg-[#3B82F6]/15 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-16 left-16 w-2.5 h-3.5 rounded-full bg-[#3B82F6]/10 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-8 right-8 w-2 h-3 rounded-full bg-[#3B82F6]/15 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main circular progress with water fill */}
      <div className="relative w-56 h-56">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#3B82F6]/20 to-[#1D4ED8]/10 blur-xl" />

        {/* Glass container */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white to-gray-50 shadow-lg ring-1 ring-black/5 overflow-hidden">
          {/* Water fill */}
          <div
            className="absolute inset-0 flex flex-col justify-end overflow-hidden"
            style={{ clipPath: 'circle(50% at 50% 50%)' }}
          >
            {/* Water body */}
            <div
              className="relative w-full transition-all duration-700 ease-out"
              style={{ height: `${waterHeight}%` }}
            >
              {/* Gradient water fill - blue tones */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D4ED8] via-[#3B82F6] to-[#60A5FA]" />

              {/* Wave effect at top */}
              <svg
                className="absolute -top-2 left-1/2 w-[200%] animate-wave"
                viewBox="0 0 400 20"
                preserveAspectRatio="none"
                style={{ height: '20px' }}
              >
                <path
                  d="M0,10 C100,20 150,0 200,10 C250,20 300,0 400,10 L400,20 L0,20 Z"
                  fill="#60A5FA"
                  opacity="0.6"
                />
              </svg>
              <svg
                className="absolute -top-1 left-1/2 w-[200%] animate-wave-slow"
                viewBox="0 0 400 20"
                preserveAspectRatio="none"
                style={{ height: '16px', animationDelay: '-1s' }}
              >
                <path
                  d="M0,10 C80,0 120,20 200,10 C280,0 320,20 400,10 L400,20 L0,20 Z"
                  fill="#3B82F6"
                  opacity="0.8"
                />
              </svg>

              {/* Bubbles */}
              {progress > 0 && (
                <>
                  <div className="absolute bottom-4 left-1/4 w-2 h-2 rounded-full bg-white/40 animate-float" style={{ animationDelay: '0s' }} />
                  <div className="absolute bottom-8 left-1/2 w-1.5 h-1.5 rounded-full bg-white/30 animate-float" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute bottom-6 right-1/4 w-1 h-1 rounded-full bg-white/35 animate-float" style={{ animationDelay: '0.6s' }} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200/50"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out drop-shadow-sm"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative">
            <Droplets className="w-8 h-8 text-[#3B82F6] drop-shadow-sm" />
            {progress >= 100 && (
              <div className="absolute inset-0 rounded-full bg-[#3B82F6]/20 animate-ripple" />
            )}
          </div>
          <span className="mt-2 text-4xl font-bold tracking-tight text-foreground drop-shadow-sm">
            {totalMl.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            of {dailyGoal.toLocaleString()} ml
          </span>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-1.5">
        {progress >= 100 ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎉</span>
            <p className="text-lg font-semibold bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] bg-clip-text text-transparent">
              Goal reached!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3">
              <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] transition-all duration-700 ease-out"
                  style={{ width: `${clampedProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground">{Math.round(progress)}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {(dailyGoal - totalMl).toLocaleString()} ml to go
            </p>
          </>
        )}
      </div>
    </div>
  );
}
