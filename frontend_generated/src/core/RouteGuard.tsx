import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissionStore, Permission } from './permissions';
import { useTenantStore, TenantId } from './tenant';
import { BaseErrorState } from '../components/base/BaseErrorState';
import { ShieldAlert } from 'lucide-react';

interface RouteGuardProps {
  permissions?: Permission | Permission[];
  tenantMode?: 'all' | 'admin_only' | 'commercial_only' | 'specific';
  allowedTenants?: TenantId[];
  children: React.ReactNode;
}

export function RouteGuard({ 
  permissions, 
  tenantMode = 'all', 
  allowedTenants = [], 
  children 
}: RouteGuardProps) {
  const hasPermission = usePermissionStore(state => state.hasPermission);
  const currentTenant = useTenantStore(state => state.currentTenant);

  // 1. Tenant Check
  let tenantAllowed = true;
  if (tenantMode === 'admin_only') {
    tenantAllowed = currentTenant === 'admin';
  } else if (tenantMode === 'commercial_only') {
    tenantAllowed = currentTenant === 'plaza_mayor' || currentTenant === 'casa_de_piedra';
  } else if (tenantMode === 'specific' && currentTenant) {
    tenantAllowed = allowedTenants.includes(currentTenant);
  }

  // 2. Permission Check
  const permAllowed = permissions ? hasPermission(permissions) : true;

  if (!tenantAllowed || !permAllowed) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <BaseErrorState 
          icon={<ShieldAlert className="w-12 h-12 text-danger" />}
          title="Acceso Denegado" 
          description={
            !tenantAllowed 
              ? "Este módulo no está disponible bajo el tenant actual." 
              : "No tienes los permisos necesarios para ver esta página."
          }
          actionLabel="Volver al Inicio"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return <>{children}</>;
}
