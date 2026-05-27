import React, { ReactNode } from 'react';
import { cn } from '../../utils';

export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  noPadding?: boolean;
}

export function BaseCard({ children, title, subtitle, headerAction, className, noPadding = false, ...props }: BaseCardProps) {
  return (
    <div className={cn("bg-bg-surface border border-border-base rounded-lg overflow-hidden", className)} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-border-base bg-bg-surface flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
            {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={cn("bg-bg-surface", !noPadding && "p-6")}>
        {children}
      </div>
    </div>
  );
}
