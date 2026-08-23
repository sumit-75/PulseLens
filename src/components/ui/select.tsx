'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select option...',
  className,
  triggerClassName,
  icon,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left z-30', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2.5 rounded-lg border border-[#e2e7e3]/15 bg-[#12110b] px-3.5 py-2 text-sm text-[#e2e7e3] shadow-sm transition-all hover:bg-[#181711] focus:outline-none focus:ring-2 focus:ring-[#e2e7e3]/30 active:scale-[0.99] whitespace-nowrap',
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-[#889089] shrink-0">{icon}</span>}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[#889089] shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-[#e2e7e3]'
          )}
        />
      </button>

      {/* Dropdown Menu Content with high z-index and shadow */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-[9999] max-h-64 min-w-[200px] w-full overflow-y-auto rounded-xl border border-[#e2e7e3]/20 bg-[#16150f] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/40">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-left transition-colors font-medium whitespace-nowrap',
                  isSelected
                    ? 'bg-[#e2e7e3] text-[#0e0d08] font-bold shadow-sm'
                    : 'text-[#a6aea7] hover:bg-[#232018] hover:text-[#e2e7e3]'
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 text-[#0e0d08] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
