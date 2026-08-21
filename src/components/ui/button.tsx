import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-600/35 border border-indigo-500/30',
        secondary:
          'bg-slate-800/80 text-slate-100 border border-slate-700/60 hover:bg-slate-700/80 hover:border-slate-600',
        outline:
          'border border-slate-800 bg-transparent text-slate-200 hover:bg-slate-800/60 hover:text-white hover:border-slate-700',
        ghost:
          'text-slate-300 hover:bg-slate-800/60 hover:text-white',
        destructive:
          'bg-rose-600/90 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 border border-rose-500/30',
        success:
          'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 border border-emerald-500/30',
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
