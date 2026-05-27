import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils';
import { usePermissionStore, Permission } from '../../core/permissions';

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  permission?: Permission | Permission[];
  hideIfUnauthorized?: boolean;
}

export function BaseButton({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  permission,
  hideIfUnauthorized = false,
  ...props
}: BaseButtonProps) {
  const hasPermission = usePermissionStore(state => state.hasPermission);
  const isAuthorized = permission ? hasPermission(permission) : true;

  if (!isAuthorized && hideIfUnauthorized) {
    return null;
  }

  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
  
  const variants = {
    primary: "bg-brand-primary text-text-inverted hover:bg-brand-hover focus:ring-brand-primary shadow-sm",
    secondary: "bg-bg-surface-hover text-text-primary border border-border-base hover:border-border-strong focus:ring-bg-surface-hover",
    outline: "border-2 border-border-strong text-text-primary hover:bg-bg-surface-hover focus:ring-brand-primary",
    ghost: "bg-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary focus:ring-bg-surface-hover",
    danger: "bg-danger text-text-inverted hover:opacity-90 focus:ring-danger shadow-sm",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading || !isAuthorized}
      title={!isAuthorized ? "No tienes permisos para esta acción" : props.title}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
