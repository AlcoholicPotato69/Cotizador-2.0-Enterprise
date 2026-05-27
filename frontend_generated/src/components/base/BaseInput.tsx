import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:bg-bg-surface-hover disabled:opacity-50 transition-colors shadow-sm",
            error && "border-danger focus:ring-danger",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-xs text-text-tertiary">{hint}</p>}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
BaseInput.displayName = 'BaseInput';
