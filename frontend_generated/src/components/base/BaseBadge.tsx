import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils';

interface BaseBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'info';
  children?: React.ReactNode;
  className?: string;
}

export function BaseBadge({ className, variant = 'primary', children, ...props }: BaseBadgeProps) {
  const variants = {
    primary: "bg-brand-primary text-text-inverted border border-brand-primary",
    secondary: "bg-bg-surface-hover text-text-primary border border-border-base",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    info: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    ghost: "bg-transparent text-text-secondary hover:bg-bg-surface-hover",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
