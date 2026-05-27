import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

export interface BaseLoadingProps {
  text?: string;
  className?: string;
  fullHeight?: boolean;
}

export function BaseLoading({ text = "Cargando...", className, fullHeight = false }: BaseLoadingProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullHeight ? "min-h-[400px] h-full" : "py-12",
      className
    )}>
      <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
      {text && <p className="text-sm text-text-secondary">{text}</p>}
    </div>
  );
}
