import React from 'react';
import { cn } from '../../utils';
import { User } from 'lucide-react';

interface BaseAvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function BaseAvatar({ src, alt, initials, size = 'md', className }: BaseAvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  return (
    <div className={cn(
      "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-border-strong flex-shrink-0",
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : initials ? (
        <span className="font-semibold text-text-primary uppercase">{initials.substring(0, 2)}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-text-secondary" />
      )}
    </div>
  );
}
