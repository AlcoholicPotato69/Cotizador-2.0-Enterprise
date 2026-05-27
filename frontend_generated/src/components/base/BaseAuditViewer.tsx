import React from 'react';
import { cn } from '../../utils';
import { BaseCard } from './BaseCard';

export interface BaseAuditViewerProps {
  logs?: any[];
  className?: string;
}

export function BaseAuditViewer({ logs = [], className }: BaseAuditViewerProps) {
  return (
    <BaseCard className={cn("min-h-[400px] flex items-center justify-center text-text-tertiary", className)}>
      Visualizador de Auditoría / Hash Chain Viewer
    </BaseCard>
  );
}
