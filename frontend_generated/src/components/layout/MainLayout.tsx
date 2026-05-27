import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from './ToastContainer';
import { useThemeStore } from '../../core/theme';
import { useTenantStore } from '../../core/tenant';

export function MainLayout() {
  const { currentTenant, tenantMetadata } = useTenantStore();
  const location = useLocation();

  useEffect(() => {
    const tenant = currentTenant ? tenantMetadata[currentTenant] : null;
    if (tenant && tenant.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', tenant.primaryColor);
      if (tenant.hoverColor) {
        document.documentElement.style.setProperty('--brand-hover', tenant.hoverColor);
      }
    } else {
      document.documentElement.style.removeProperty('--brand-primary');
      document.documentElement.style.removeProperty('--brand-hover');
    }
  }, [currentTenant, tenantMetadata]);

  return (
    <div className="flex h-screen w-full bg-bg-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
