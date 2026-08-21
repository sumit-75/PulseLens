'use client';

import * as React from 'react';
import { formatDate } from '@/lib/utils';

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color?: string;
    payload?: {
      timestamp: string;
      service: string;
      name: string;
      value: number;
    };
  }>;
  label?: string;
  unit?: string;
}

export function CustomChartTooltip({
  active,
  payload,
  unit = '',
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const item = data.payload;

  return (
    <div className="rounded-xl border border-slate-700/80 bg-[#0d0f19]/95 p-3 shadow-2xl backdrop-blur-md text-xs font-sans animate-in fade-in duration-100">
      <div className="flex items-center justify-between gap-4 mb-1.5 pb-1.5 border-b border-slate-800/80">
        <span className="text-[11px] font-mono text-indigo-300 font-semibold">
          {item?.service || 'service'}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          {item?.timestamp ? formatDate(item.timestamp) : ''}
        </span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <span className="text-slate-400 font-medium">
          {item?.name || data.name}:
        </span>
        <span className="font-bold text-sm font-mono text-white">
          {typeof data.value === 'number'
            ? data.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : data.value}{' '}
          <span className="text-[11px] text-slate-400 font-normal">{unit}</span>
        </span>
      </div>
    </div>
  );
}
