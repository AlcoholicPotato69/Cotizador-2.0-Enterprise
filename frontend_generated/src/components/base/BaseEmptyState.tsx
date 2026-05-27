import React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '../../utils';
import { BaseButton } from './BaseButton';

export interface BaseEmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function BaseEmptyState({
  title,
  description,
  icon = <FileQuestion className="w-12 h-12 text-text-tertiary" />,
  actionLabel,
  onAction,
  className
}: BaseEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <BaseButton onClick={onAction}>
          {actionLabel}
        </BaseButton>
      )}
    </div>
  );
}
