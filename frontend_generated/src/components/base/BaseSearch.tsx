import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils';

export interface BaseSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function BaseSearch({ value, onChange, onClear, placeholder = 'Buscar...', className, ...props }: BaseSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-border-base rounded-md leading-5 bg-bg-surface placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-text-primary"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
