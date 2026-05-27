import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface BaseStatsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const BaseStatsCard = forwardRef<HTMLInputElement, BaseStatsCardProps>(
  ({ className, title, value, icon, trend, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-surface rounded-xl border border-border-base p-6 shadow-sm flex flex-col",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-bg-surface-hover text-text-secondary rounded-lg border border-border-strong">
            {icon}
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trend.isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            )}>
              {trend.value}
            </span>
          )}
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary tracking-tight">{value}</p>
        </div>
      </div>
    );
  }
);
BaseStatsCard.displayName = 'BaseStatsCard';
