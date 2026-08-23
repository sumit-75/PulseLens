'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'center' | 'start' | 'end';
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const getPositionClasses = () => {
    if (side === 'left') return 'right-full top-1/2 -translate-y-1/2 mr-2';
    if (side === 'right') return 'left-full top-1/2 -translate-y-1/2 ml-2';

    // side === 'top'
    if (side === 'top') {
      if (align === 'end') return 'bottom-full right-0 mb-2';
      if (align === 'start') return 'bottom-full left-0 mb-2';
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }

    // side === 'bottom'
    if (align === 'end') return 'top-full right-0 mt-2';
    if (align === 'start') return 'top-full left-0 mt-2';
    return 'top-full left-1/2 -translate-x-1/2 mt-2';
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-[99999] whitespace-nowrap rounded-md border border-[#e2e7e3]/20 bg-[#16150f] px-2.5 py-1 text-xs text-[#e2e7e3] shadow-[0_8px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 font-medium pointer-events-none ring-1 ring-black/40',
            getPositionClasses(),
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
