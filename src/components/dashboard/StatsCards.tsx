'use client';

import * as React from 'react';
import { Terminal, AlertTriangle, AlertCircle, Server, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsProps {
  stats: {
    totalLogs: number;
    errorCount1h: number;
    warnCount1h: number;
    activeServicesCount: number;
  };
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsProps) {
  const items = [
    {
      title: 'Total Ingested Logs',
      value: stats.totalLogs.toLocaleString(),
      subtitle: 'Across all microservices',
      icon: Terminal,
      iconColor: 'text-indigo-400',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Errors (Last 1h)',
      value: stats.errorCount1h.toLocaleString(),
      subtitle: stats.errorCount1h > 0 ? 'Requires attention' : 'Healthy operational state',
      icon: AlertCircle,
      iconColor: stats.errorCount1h > 0 ? 'text-rose-400' : 'text-slate-400',
      bgGlow: stats.errorCount1h > 0 ? 'from-rose-500/10 to-transparent' : 'from-slate-500/5 to-transparent',
      borderColor: stats.errorCount1h > 0 ? 'border-rose-500/30' : 'border-slate-800',
    },
    {
      title: 'Warnings (Last 1h)',
      value: stats.warnCount1h.toLocaleString(),
      subtitle: 'Potential service latency/retries',
      icon: AlertTriangle,
      iconColor: stats.warnCount1h > 0 ? 'text-amber-400' : 'text-slate-400',
      bgGlow: stats.warnCount1h > 0 ? 'from-amber-500/10 to-transparent' : 'from-slate-500/5 to-transparent',
      borderColor: stats.warnCount1h > 0 ? 'border-amber-500/20' : 'border-slate-800',
    },
    {
      title: 'Active Services',
      value: stats.activeServicesCount.toString(),
      subtitle: 'Emitting real-time telemetry',
      icon: Server,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className={`relative overflow-hidden border ${item.borderColor} bg-gradient-to-br ${item.bgGlow} p-4 transition-all hover:border-slate-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">
                {item.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-7 w-20 bg-slate-800/70 animate-pulse rounded my-0.5" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-white">
                  {item.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
              <TrendingUp className="h-3 w-3 inline text-slate-600" />
              {item.subtitle}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
