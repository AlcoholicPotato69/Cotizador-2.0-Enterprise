import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { cn } from '../../utils';
import { BaseButton } from './BaseButton';

export interface BaseErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function BaseErrorState({
  title = "Ocurrió un error",
  message,
  description,
  onRetry,
  className,
  icon,
  actionLabel,
  onAction
}: BaseErrorStateProps) {
  const displayMessage = description || message || "Ha ocurrido un problema al cargar esta información. Por favor, intenta de nuevo.";
  const handleAction = onAction || onRetry;
  const displayActionLabel = actionLabel || "Reintentar";

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-4">
        {icon || <AlertTriangle className="w-8 h-8 text-danger" />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {displayMessage}
      </p>
      {handleAction && (
        <BaseButton variant="outline" onClick={handleAction}>
          {!actionLabel && <RefreshCcw className="w-4 h-4 mr-2" />}
          {displayActionLabel}
        </BaseButton>
      )}
    </div>
  );
}
