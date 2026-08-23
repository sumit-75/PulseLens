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
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-[#e2e7e3]/15 bg-[#12110b] px-3 py-1.5 text-sm text-[#e2e7e3] shadow-sm transition-all hover:bg-[#181711] focus:outline-none focus:ring-2 focus:ring-[#e2e7e3]/30 active:scale-[0.99]',
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

      {/* Dropdown Menu Content */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 max-h-60 min-w-[180px] w-full overflow-y-auto rounded-xl border border-[#e2e7e3]/15 bg-[#15140e] p-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
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
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-left transition-colors font-medium',
                  isSelected
                    ? 'bg-[#e2e7e3]/15 text-[#e2e7e3] font-semibold'
                    : 'text-[#a6aea7] hover:bg-[#201e16] hover:text-[#e2e7e3]'
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 text-[#e2e7e3] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
