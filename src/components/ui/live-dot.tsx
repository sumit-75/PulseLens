'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LiveDotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ping?: boolean;
}

export function LiveDot({ size = 'md', className, ping = true }: LiveDotProps) {
  const sizeMap = {
    sm: {
      wrapper: 'h-2 w-2',
      dot: 'h-2 w-2',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.85)]',
    },
    md: {
      wrapper: 'h-2.5 w-2.5',
      dot: 'h-2.5 w-2.5',
      glow: 'shadow-[0_0_10px_rgba(52,211,153,0.9)]',
    },
    lg: {
      wrapper: 'h-3 w-3',
      dot: 'h-3 w-3',
      glow: 'shadow-[0_0_12px_rgba(52,211,153,0.95)]',
    },
  };

  const { wrapper, dot, glow } = sizeMap[size];

  return (
    <span className={cn('relative inline-flex items-center justify-center shrink-0', wrapper, className)}>
      {ping && (
        <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75')} />
      )}
      <span className={cn('relative inline-flex rounded-full bg-emerald-400', dot, glow)} />
    </span>
  );
}
