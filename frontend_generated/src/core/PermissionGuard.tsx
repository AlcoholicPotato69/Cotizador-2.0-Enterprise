import React from 'react';
import { usePermissionStore, Permission } from './permissions';

interface PermissionGuardProps {
  permissions: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permissions, children, fallback = null }: PermissionGuardProps) {
  const hasPermission = usePermissionStore(state => state.hasPermission);
  
  if (hasPermission(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
