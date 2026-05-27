import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';
import { Calendar } from 'lucide-react';

export interface BaseDatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const BaseDatePicker = forwardRef<HTMLInputElement, BaseDatePickerProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="date"
            className={cn(
              "flex h-10 w-full rounded-lg border border-border-strong bg-bg-surface pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:bg-bg-surface-hover disabled:opacity-50 transition-colors shadow-sm appearance-none",
              error && "border-danger focus:ring-danger",
              className
            )}
            {...props}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-text-tertiary" />
          </div>
        </div>
        {hint && !error && <p className="mt-1 text-xs text-text-tertiary">{hint}</p>}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
BaseDatePicker.displayName = 'BaseDatePicker';
