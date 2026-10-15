'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HeroStats } from '@/components/dashboard/hero-stats';
import { DrinkTypeBreakdown } from '@/components/dashboard/drink-type-breakdown';
import { RecentLogs } from '@/components/dashboard/recent-logs';
import { EmptyState } from '@/components/dashboard/empty-state';
import { BathroomStats } from '@/components/dashboard/bathroom-stats';
import { AddBathroomButton } from '@/components/dashboard/add-bathroom-button';
import { useHydroStore } from '@/lib/store/hydro-store';

export default function DashboardPage() {
  const { todayLogs, isLoading, fetchTodayLogs } = useHydroStore();

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-[#6BBF4E]/20 border-t-[#6BBF4E] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#6BBF4E]/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = todayLogs.length === 0;

  return (
    <div className="relative space-y-4 pb-6">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 -top-20 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#3B82F6]/10 via-[#3B82F6]/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Stats Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg shadow-[#3B82F6]/10 bg-gradient-to-b from-white to-gray-50/80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-[#1D4ED8]/5" />
        <CardContent className="relative pt-6 pb-4">
          <HeroStats />
        </CardContent>
      </Card>

      {isEmpty ? (
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-b from-white to-gray-50/50">
          <CardContent className="pt-4 pb-2">
            <EmptyState />
          </CardContent>
        </Card>
      ) : (
        <>
          <DrinkTypeBreakdown />
          <RecentLogs />
        </>
      )}

      {/* Bathroom tracking section */}
      <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="pt-6 space-y-4">
          <BathroomStats />
          <AddBathroomButton />
        </CardContent>
      </Card>
    </div>
  );
}
