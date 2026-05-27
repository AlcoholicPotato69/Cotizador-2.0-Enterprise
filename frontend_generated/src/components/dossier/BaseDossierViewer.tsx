import React from 'react';
import { cn } from '../../utils';

interface DossierSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DossierSection({ title, children }: DossierSectionProps) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 border-b border-border-base pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

import { BaseBadge } from '../base/BaseBadge';

interface DossierFieldProps {
  label: string;
  value: React.ReactNode;
  isBadge?: boolean;
}

export function DossierField({ label, value, isBadge }: DossierFieldProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-border-base/50 last:border-0">
      <dt className="text-sm font-medium text-text-secondary">{label}</dt>
      <dd className="text-sm text-text-primary sm:col-span-2">
        {isBadge ? <BaseBadge>{value as string}</BaseBadge> : value || <span className="text-text-tertiary italic">No especificado</span>}
      </dd>
    </div>
  );
}

interface BaseDossierViewerProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function BaseDossierViewer({ header, children, className, actions }: BaseDossierViewerProps) {
  return (
    <div className={cn("bg-bg-surface border border-border-strong rounded-xl shadow-sm overflow-hidden", className)}>
      <div className="p-6 border-b border-border-strong bg-bg-surface-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {header}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
