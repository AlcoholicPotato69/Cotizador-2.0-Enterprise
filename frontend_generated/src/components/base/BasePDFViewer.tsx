import React from 'react';
import { cn } from '../../utils';

export interface BasePDFViewerProps {
  url?: string;
  className?: string;
}

export function BasePDFViewer({ url, className }: BasePDFViewerProps) {
  return (
    <div className={cn("w-full h-[600px] bg-bg-surface-hover border border-border-base rounded-md flex items-center justify-center text-text-tertiary", className)}>
      {url ? `Mostrando PDF: ${url}` : "Visor de PDF no configurado"}
    </div>
  );
}
