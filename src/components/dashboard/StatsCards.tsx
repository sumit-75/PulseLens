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
      iconColor: 'text-[#e2e7e3]',
      bgGlow: 'from-[#e2e7e3]/8 to-transparent',
      borderColor: 'border-[#e2e7e3]/15',
    },
    {
      title: 'Errors (Last 1h)',
      value: stats.errorCount1h.toLocaleString(),
      subtitle: stats.errorCount1h > 0 ? 'Requires attention' : 'Healthy operational state',
      icon: AlertCircle,
      iconColor: stats.errorCount1h > 0 ? 'text-rose-400' : 'text-[#889089]',
      bgGlow: stats.errorCount1h > 0 ? 'from-rose-500/10 to-transparent' : 'from-[#e2e7e3]/4 to-transparent',
      borderColor: stats.errorCount1h > 0 ? 'border-rose-500/30' : 'border-[#e2e7e3]/10',
    },
    {
      title: 'Warnings (Last 1h)',
      value: stats.warnCount1h.toLocaleString(),
      subtitle: 'Potential service latency/retries',
      icon: AlertTriangle,
      iconColor: stats.warnCount1h > 0 ? 'text-amber-400' : 'text-[#889089]',
      bgGlow: stats.warnCount1h > 0 ? 'from-amber-500/10 to-transparent' : 'from-[#e2e7e3]/4 to-transparent',
      borderColor: stats.warnCount1h > 0 ? 'border-amber-500/25' : 'border-[#e2e7e3]/10',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className={`relative overflow-hidden border ${item.borderColor} bg-gradient-to-br ${item.bgGlow} p-5 transition-all hover:border-[#e2e7e3]/30 bg-[#15140e]/90 shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-[#a6aea7]">
                {item.title}
              </span>
              <div className="p-2 rounded-xl bg-[#181711] border border-[#e2e7e3]/10">
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-8 w-24 bg-[#232018] animate-pulse rounded my-0.5" />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e7e3] font-mono">
                  {item.value}
                </span>
              )}
            </div>

            <p className="text-xs text-[#889089] mt-1.5 flex items-center gap-1.5 truncate font-normal">
              <TrendingUp className="h-3.5 w-3.5 inline text-[#889089]" />
              {item.subtitle}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
