import React from 'react';
import { cn } from '../../utils';
import { X } from 'lucide-react';

interface BaseTagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function BaseTag({ label, onRemove, className, color = 'secondary' }: BaseTagProps) {
  const colors = {
    primary: "bg-brand-primary text-text-inverted border border-brand-primary",
    secondary: "bg-bg-surface-hover text-text-primary border border-border-strong",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium transition-colors",
      colors[color],
      className
    )}>
      {label}
      {onRemove && (
        <button 
          type="button"
          onClick={onRemove}
          className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
