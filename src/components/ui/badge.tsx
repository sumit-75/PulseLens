import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#e2e7e3]/10 text-[#e2e7e3] border border-[#e2e7e3]/20',
        info:
          'bg-sky-500/10 text-sky-300 border border-sky-500/25',
        warn:
          'bg-amber-500/10 text-amber-300 border border-amber-500/25',
        error:
          'bg-rose-500/10 text-rose-300 border border-rose-500/25',
        success:
          'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25',
        outline:
          'border border-[#e2e7e3]/15 text-[#e2e7e3] bg-[#15140e]/60',
        service:
          'bg-[#191710] text-[#e2e7e3] border border-[#e2e7e3]/12 normal-case font-mono font-medium px-2.5 py-1 text-xs sm:text-[13px] rounded-md',
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
