import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils';

export interface BaseCurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  error?: string;
  label?: string;
  hint?: string;
  value?: number;
  onChange?: (value: number) => void;
}

export const BaseCurrencyInput = forwardRef<HTMLInputElement, BaseCurrencyInputProps>(
  ({ className, error, label, hint, id, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>(
      value !== undefined ? value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : ''
    );

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const numericValue = parseFloat(e.target.value.replace(/[^0-9.-]+/g,""));
      if (!isNaN(numericValue)) {
        setDisplayValue(numericValue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }));
        onChange?.(numericValue);
      } else {
        setDisplayValue('');
        onChange?.(0);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      const numericValue = parseFloat(displayValue.replace(/[^0-9.-]+/g,""));
      if (!isNaN(numericValue)) {
        setDisplayValue(numericValue.toString());
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    };

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
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={cn(
              "flex h-10 w-full rounded-lg border border-border-strong bg-bg-surface pl-4 pr-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:bg-bg-surface-hover disabled:opacity-50 transition-colors shadow-sm",
              error && "border-danger focus:ring-danger",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="mt-1 text-xs text-text-tertiary">{hint}</p>}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
BaseCurrencyInput.displayName = 'BaseCurrencyInput';
