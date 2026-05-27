import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface BaseInfoCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const BaseInfoCard = forwardRef<HTMLInputElement, BaseInfoCardProps>(
  ({ className, title, description, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-surface rounded-xl border border-border-base p-6 shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-4 mb-4">
          {icon && (
            <div className="p-2 bg-brand-subtle text-brand-primary rounded-lg border border-brand-subtle">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text-primary">{title}</h3>
            {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
          </div>
        </div>
        <div>
          {children}
        </div>
      </div>
    );
  }
);
BaseInfoCard.displayName = 'BaseInfoCard';
