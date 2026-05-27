import React from 'react';
import { cn } from '../../utils';
import { Bell } from 'lucide-react';

export interface BaseNotificationCenterProps {
  notifications?: any[];
  className?: string;
  onOpen?: () => void;
}

export function BaseNotificationCenter({ notifications = [], className, onOpen }: BaseNotificationCenterProps) {
  return (
    <button onClick={onOpen} className={cn("relative p-2 text-text-secondary hover:bg-bg-surface-hover rounded-full transition-colors", className)}>
      <Bell className="w-5 h-5" />
      {notifications.length > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full" />
      )}
    </button>
  );
}
