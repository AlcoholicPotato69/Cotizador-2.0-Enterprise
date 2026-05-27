import React from 'react';
import { useTenantStore } from '../../core/tenant';
import { cn } from '../../utils';
import { MapPin } from 'lucide-react';

export interface BaseTenantSwitcherProps {
  className?: string;
  collapsed?: boolean;
}

export function BaseTenantSwitcher({ className, collapsed = false }: BaseTenantSwitcherProps) {
  const { currentTenant, tenantMetadata, setTenant } = useTenantStore();
  const tenant = currentTenant ? tenantMetadata[currentTenant] : null;

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="flex items-center gap-2 w-full">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-white font-bold overflow-hidden p-1"
          style={{ backgroundColor: tenant?.primaryColor || '#000' }}
        >
          {tenant?.shortName === 'CP' ? (
             <img src="/logocp2.png" alt="CP" className="w-full h-full object-contain brightness-0 invert" />
          ) : tenant?.shortName === 'PM' ? (
             <img src="/logo.png" alt="PM" className="w-full h-full object-contain brightness-0 invert" />
          ) : (
            tenant?.shortName || <MapPin className="w-4 h-4" />
          )}
        </div>
        {!collapsed && (
          <select
            value={currentTenant || ''}
            onChange={(e) => setTenant(e.target.value as any)}
            className="w-full bg-transparent border-none text-sm font-semibold tracking-tight focus:outline-none cursor-pointer truncate appearance-none"
            style={{ color: tenant?.primaryColor }}
          >
            {Object.values(tenantMetadata).map((t) => (
              <option key={t.id} value={t.id} className="text-text-primary text-base font-medium">
                {t.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
