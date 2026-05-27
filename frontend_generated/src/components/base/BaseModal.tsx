import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function BaseModal({ isOpen, onClose, title, description, children, footer, size = 'md' }: BaseModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)]",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-bg-inverted/40 backdrop-blur-sm" onClick={onClose} />
      <div 
        className={cn(
          "relative bg-bg-surface w-full rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] border border-border-base",
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between p-6 border-b border-border-base">
          <div>
            {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
            {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-text-tertiary hover:bg-bg-surface-hover hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 text-text-primary">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-border-base bg-bg-surface-hover rounded-b-2xl flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
