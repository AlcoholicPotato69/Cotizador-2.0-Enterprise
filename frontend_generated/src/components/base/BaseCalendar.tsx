import React from 'react';
import { cn } from '../../utils';
import { BaseCard } from './BaseCard';

export interface BaseCalendarProps {
  events?: Array<{ date: Date; title: string }>;
  className?: string;
}

export function BaseCalendar({ events = [], className }: BaseCalendarProps) {
  return (
    <BaseCard className={cn("min-h-[400px] flex items-center justify-center text-text-tertiary", className)}>
      Vista de Calendario Global
    </BaseCard>
  );
}
