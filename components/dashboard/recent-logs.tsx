'use client';

import { useRecentLogs } from '@/lib/store/hydro-store';
import { DRINK_TYPES } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

export function RecentLogs() {
  const recentLogs = useRecentLogs();

  if (recentLogs.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      <CardContent className="pt-5 pb-4">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#6BBF4E] to-[#3D6F2B]" />
            Recent Activity
          </h2>
          <div className="space-y-2">
            {recentLogs.map((log, index) => (
              <div
                key={log.id}
                className="group flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-50/40 ring-1 ring-gray-100 hover:ring-[#6BBF4E]/30 hover:from-[#6BBF4E]/5 hover:to-transparent transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-sm ring-1 ring-gray-100 group-hover:ring-[#6BBF4E]/30 transition-all">
                    <span className="text-xl">{DRINK_TYPES[log.drink_type].emoji}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {log.amount_ml}ml {DRINK_TYPES[log.drink_type].label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {formatDistanceToNow(new Date(log.logged_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
