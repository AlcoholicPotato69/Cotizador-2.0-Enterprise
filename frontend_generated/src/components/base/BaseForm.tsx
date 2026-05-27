import { BaseButton } from '../base/BaseButton';
import React from 'react';
import { cn } from '../../utils';

interface BaseFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export function BaseForm({
  children,
  className,
  onCancel,
  isLoading,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  onSubmit,
  ...props
}: BaseFormProps) {
  return (
    <form className={cn("space-y-6 animate-in fade-in duration-300", className)} onSubmit={onSubmit} {...props}>
      <div className="space-y-6">
        {children}
      </div>
      
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-base mt-6">
        {onCancel && (
          <BaseButton type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </BaseButton>
        )}
        <BaseButton type="submit" variant="primary" isLoading={isLoading}>
          {submitLabel}
        </BaseButton>
      </div>
    </form>
  );
}
