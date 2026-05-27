import React from 'react';
import { cn } from '../../utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  iconBg?: string;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export interface BaseTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function BaseTimeline({ items, className }: BaseTimelineProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      case 'danger': return 'bg-danger/10 text-danger border-danger/20';
      case 'info': return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
      default: return 'bg-bg-surface-hover text-text-secondary border-border-base';
    }
  };

  return (
    <div className={cn("flow-root", className)}>
      <ul role="list" className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border-base" aria-hidden="true" />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className={cn(
                  "relative px-1 pt-1",
                )}>
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border ring-8 ring-bg-surface",
                    item.iconBg || getStatusColor(item.status)
                  )}>
                    {item.icon ? (
                      React.cloneElement(item.icon as any, { className: 'h-4 w-4' })
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary mr-2">
                      {item.title}
                    </span>
                    <span className="whitespace-nowrap">{item.date}</span>
                  </div>
                  {item.description && (
                     <div className="mt-2 text-sm text-text-secondary">
                       <p>{item.description}</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
