import React from 'react';
import { cn } from '../../utils';
import { BaseInput } from './BaseInput';

export interface BaseDateRangeProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  className?: string;
}

export function BaseDateRange({ startDate, endDate, onStartDateChange, onEndDateChange, className }: BaseDateRangeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BaseInput 
        type="date" 
        value={startDate} 
        onChange={(e) => onStartDateChange?.(e.target.value)}
        className="w-full"
      />
      <span className="text-text-secondary">-</span>
      <BaseInput 
        type="date" 
        value={endDate} 
        onChange={(e) => onEndDateChange?.(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
