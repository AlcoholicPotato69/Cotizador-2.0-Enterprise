import React from 'react';
import { cn } from '../../utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BaseTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export function BaseTabs({ tabs, activeTab, onChange, className, variant = 'underline' }: BaseTabsProps) {
  if (variant === 'pills') {
    return (
      <div className={cn("flex space-x-2", className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                isActive 
                  ? "bg-brand-primary text-text-inverted" 
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                {tab.label}
              </div>
            </button>
          )
        })}
      </div>
    );
  }

  return (
    <div className={cn("border-b border-border-base", className)}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors",
                isActive
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-text-tertiary",
                tab.disabled && "opacity-50 cursor-not-allowed hover:border-transparent"
              )}
            >
              {tab.icon && <span className={isActive ? "text-brand-primary" : "text-text-tertiary"}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
