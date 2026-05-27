import React from 'react';
import { useTenantStore } from '../../core/tenant';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../../utils';

export function Settings() {
  const { currentTenant, tenantMetadata } = useTenantStore();
  const tenant = currentTenant ? tenantMetadata[currentTenant] : null;
  const location = useLocation();

  const isBase = location.pathname === '/app/settings';

  const tabs = [
    { name: 'General', path: '/app/settings' },
    { name: 'Mi Perfil', path: '/app/settings/profile' },
    { name: 'Usuarios', path: '/app/settings/users' },
    { name: 'Roles (RBAC)', path: '/app/settings/roles' },
    { name: 'Financiera', path: '/app/settings/financial' },
    { name: 'Plantillas', path: '/app/settings/templates' },
    { name: 'Notificaciones', path: '/app/settings/notifications' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Configuración del Tenant</h1>
        <p className="text-text-secondary mt-1">Administración de preferencias, roles y metadatos de {tenant?.name || 'Sistema'}.</p>
      </div>

      <div className="border-b border-border-base">
        <nav className="-mb-px flex space-x-6">
           {tabs.map(tab => {
             const active = tab.path === '/app/settings' 
                ? isBase 
                : location.pathname.startsWith(tab.path);
             
             return (
               <NavLink
                 key={tab.path}
                 to={tab.path}
                 className={cn(
                   "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                   active
                     ? "border-brand-primary text-brand-primary"
                     : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong"
                 )}
               >
                 {tab.name}
               </NavLink>
             );
           })}
        </nav>
      </div>

      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}

