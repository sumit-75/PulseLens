import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        info:
          'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        warn:
          'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        error:
          'bg-rose-500/10 text-rose-400 border border-rose-500/25',
        success:
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        outline:
          'border border-slate-700 text-slate-300 bg-slate-900/50',
        service:
          'bg-slate-800/80 text-slate-300 border border-slate-700/50 normal-case font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
