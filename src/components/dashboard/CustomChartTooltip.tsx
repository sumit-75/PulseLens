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
    <div className="rounded-xl border border-[#e2e7e3]/20 bg-[#15140e]/95 p-3 shadow-2xl backdrop-blur-md text-xs font-sans animate-in fade-in duration-100 text-[#e2e7e3]">
      <div className="flex items-center justify-between gap-4 mb-1.5 pb-1.5 border-b border-[#e2e7e3]/10">
        <span className="text-[11px] font-mono text-[#e2e7e3] font-semibold">
          {item?.service || 'service'}
        </span>
        <span className="text-[10px] text-[#889089] font-mono">
          {item?.timestamp ? formatDate(item.timestamp) : ''}
        </span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <span className="text-[#889089] font-medium">
          {item?.name || data.name}:
        </span>
        <span className="font-bold text-sm font-mono text-[#e2e7e3]">
          {typeof data.value === 'number'
            ? data.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : data.value}{' '}
          <span className="text-[11px] text-[#889089] font-normal">{unit}</span>
        </span>
      </div>
    </div>
  );
}
