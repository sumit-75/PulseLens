import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2e7e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0d08] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#e2e7e3] text-[#0e0d08] font-semibold shadow-lg shadow-[#e2e7e3]/10 hover:bg-[#f0f4f1] border border-[#e2e7e3]',
        secondary:
          'bg-[#191710] text-[#e2e7e3] border border-[#e2e7e3]/12 hover:bg-[#232018] hover:border-[#e2e7e3]/20',
        outline:
          'border border-[#e2e7e3]/15 bg-transparent text-[#e2e7e3] hover:bg-[#191710] hover:text-white hover:border-[#e2e7e3]/30',
        ghost:
          'text-[#a6aea7] hover:bg-[#191710] hover:text-[#e2e7e3]',
        destructive:
          'bg-rose-500/15 text-rose-300 shadow-lg shadow-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30',
        success:
          'bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-lg px-6 text-base',
        icon: 'h-9 w-9 p-0',
        iconSm: 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
