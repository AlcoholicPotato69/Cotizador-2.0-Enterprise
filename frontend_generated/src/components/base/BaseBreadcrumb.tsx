import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BaseBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BaseBreadcrumb({ items, className }: BaseBreadcrumbProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/app" className="text-text-secondary hover:text-text-primary transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.label} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-text-tertiary mx-1" />
              {isLast || !item.path ? (
                <span className="text-sm font-medium text-text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
