import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-[#e2e7e3]/12 bg-[#12110b]/80 px-3 py-1 text-sm text-[#e2e7e3] placeholder:text-[#889089] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2e7e3]/40 focus-visible:border-[#e2e7e3]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all backdrop-blur-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
