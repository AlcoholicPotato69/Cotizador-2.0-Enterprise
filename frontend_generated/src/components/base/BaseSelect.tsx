import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface BaseSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  hint?: string;
  options: { label: string; value: string | number }[];
}

export const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  ({ className, error, label, hint, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:bg-bg-surface-hover disabled:opacity-50 transition-colors shadow-sm appearance-none",
            error && "border-danger focus:ring-danger",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="mt-1 text-xs text-text-tertiary">{hint}</p>}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
BaseSelect.displayName = 'BaseSelect';
