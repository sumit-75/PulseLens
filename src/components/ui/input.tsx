import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#e2e7e3]/15 bg-[#12110b] px-3.5 py-2 text-[13.5px] text-[#e2e7e3] placeholder:text-[#889089] placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2e7e3]/30 focus-visible:border-[#e2e7e3]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all backdrop-blur-sm shadow-inner',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
