import { BaseCard } from '../../components/base/BaseCard';
import { BaseButton } from '../../components/base/BaseButton';
import React, { useState } from 'react';
import { Shield, Key, Plus, Check } from 'lucide-react';
import { PermissionGuard } from '../../core/PermissionGuard';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseInput } from '../../components/base/BaseInput';
import { toast } from 'sonner';
import { getPermissionsByCategory, PERMISSIONS_METADATA } from '../../core/permissionsData';
import { api } from '../../core/api';

export function RolesPermissions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const fetchRoles = async () => {
      try {
        const res = await api.get('/rbac');
        if (mounted) {
          setRoles(res.data || []);
          setIsLoadingRoles(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch roles', err);
          setRolesError('Error al cargar roles');
          setIsLoadingRoles(false);
        }
      }
    };
    fetchRoles();
    return () => { mounted = false; };
  }, []);

  const handleCreateRole = () => {
    toast.success('Nuevo rol creado exitosamente');
    setIsModalOpen(false);
  };

  const openMatrix = (roleName: string) => {
    setSelectedRole(roleName);
    setIsMatrixModalOpen(true);
  };

  const handleSaveMatrix = () => {
    toast.success(`Matriz de permisos para ${selectedRole} actualizada`);
    setIsMatrixModalOpen(false);
  };

  const permissionCategories = getPermissionsByCategory();

  const checkLogicalConflict = (permId: string) => {
    if (!selectedRole) return false;
    // Simulate logical conflicts for visual validation
    if (selectedRole === 'Ventas Senior' && ['manage_settings', 'view_settings', 'view_audit', 'view_observability', 'manage_roles'].includes(permId)) {
      return true;
    }
    if (selectedRole === 'Director Comercial' && ['manage_settings', 'view_observability'].includes(permId)) {
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Roles y Subpermisos (RBAC)</h1>
          <p className="text-text-secondary mt-1">Configuración de matrices de acceso y perfiles de seguridad.</p>
        </div>
        <PermissionGuard permissions="roles.manage">
          <BaseButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Rol
          </BaseButton>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoadingRoles && <div className="col-span-full text-center py-4 text-text-secondary">Cargando roles...</div>}
        {rolesError && <div className="col-span-full text-center py-4 text-danger">{rolesError}</div>}
        {!isLoadingRoles && !rolesError && roles.map((role) => (
          <BaseCard key={role.id || role.name} title={role.name} headerAction={<Shield className="w-5 h-5 text-text-secondary" />}>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">{role.description}</p>
              <div className="flex items-center gap-2 mt-4 text-sm font-medium text-text-tertiary">
                 <Key className="w-4 h-4" />
                 <span>{role.users} usuarios asignados</span>
              </div>
            </div>
            <PermissionGuard permissions="roles.manage">
              <div className="mt-4 pt-4 border-t border-border-base text-right">
                 <button className="text-sm font-medium text-brand-primary hover:text-brand-hover hover:underline transition-colors" onClick={() => openMatrix(role.name)}>
                  Modificar Matriz de Permisos &rarr;
                </button>
              </div>
            </PermissionGuard>
          </BaseCard>
        ))}
      </div>

      <BaseModal
        title="Crear Nuevo Rol"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseInput label="Nombre del Rol" placeholder="Ej. Ejecutivo de Ventas" />
          <BaseInput label="Descripción Corta" placeholder="Ventas y cierres de contratos..." />
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleCreateRole}>Crear Rol</BaseButton>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        title={`Matriz de Permisos: ${selectedRole}`}
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        size="lg"
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-sm text-text-secondary">Conceda o revoque permisos específicos para este rol. Los permisos en <span className="text-danger font-medium">rojo</span> indican un posible conflicto lógico con la jerarquía base.</p>
          
          {permissionCategories.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider bg-bg-surface-hover p-2 rounded border border-border-base">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {category.permissions.map(perm => {
                  const isConflict = checkLogicalConflict(perm.id);
                  return (
                    <label key={perm.id} className={`flex items-start gap-3 p-2 rounded-md transition-colors cursor-pointer border group ${isConflict ? 'bg-danger/5 border-danger/20 hover:border-danger/40' : 'bg-transparent border-transparent hover:border-border-base hover:bg-bg-surface-hover'}`}>
                      <input 
                        type="checkbox" 
                        className={`mt-1 h-4 w-4 rounded cursor-pointer ${isConflict ? 'border-danger/50 text-danger focus:ring-danger' : 'border-border-strong text-brand-primary focus:ring-brand-primary'}`} 
                        defaultChecked={selectedRole === 'Administrador Global' || Math.random() > 0.5 || isConflict} 
                      />
                      <div>
                        <span className={`text-sm font-medium transition-colors block ${isConflict ? 'text-danger' : 'text-text-primary group-hover:text-brand-primary'}`}>
                          {perm.name}
                        </span>
                        <span className={`text-xs block mt-0.5 ${isConflict ? 'text-danger/80' : 'text-text-tertiary'}`}>
                          {isConflict ? '⚠ Conflicto de jerarquía' : perm.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6 border-t border-border-base pt-4">
          <BaseButton variant="ghost" onClick={() => setIsMatrixModalOpen(false)}>Cancelar</BaseButton>
          <BaseButton variant="primary" onClick={handleSaveMatrix}>Guardar Matriz</BaseButton>
        </div>
      </BaseModal>
    </div>
  );
}
