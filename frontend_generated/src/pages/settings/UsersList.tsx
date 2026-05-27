import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import React, { useState } from 'react';
import { Plus, Search, Edit2 } from 'lucide-react';
import { PermissionGuard } from '../../core/PermissionGuard';
import { usePermissionStore } from '../../core/permissions';
import { toast } from 'sonner';
import { getPermissionsByCategory } from '../../core/permissionsData';
import { api } from '../../core/api';

export function UsersList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const hasPermission = usePermissionStore(state => state.hasPermission);

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        if (mounted) {
          setUsers(res.data || []);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch users', err);
          setError('Error al cargar usuarios');
          setIsLoading(false);
        }
      }
    };
    fetchUsers();
    return () => { mounted = false; };
  }, []);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    toast.success(selectedUser ? 'Usuario y permisos actualizados correctamente' : 'Usuario creado correctamente');
    setIsModalOpen(false);
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'firstName', cell: (row: any) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Sin Nombre' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Rol', accessorKey: 'roles', cell: (row: any) => row.roles?.length ? row.roles.join(', ') : 'Sin rol' },
    { 
      header: 'Estado', 
      accessorKey: 'isActive',
      cell: (row: any) => {
        const isAvailable = row.isActive === true;
        return <BaseBadge variant={isAvailable ? 'success' : 'danger'}>{isAvailable ? 'ACTIVO' : 'SUSPENDIDO'}</BaseBadge>;
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: (row: any) => (
        <PermissionGuard permissions="users.manage">
          <BaseButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
            <Edit2 className="w-4 h-4" />
          </BaseButton>
        </PermissionGuard>
      )
    }
  ];

  const permissionCategories = getPermissionsByCategory();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Directorio de Usuarios</h1>
          <p className="text-text-secondary mt-1">Gestión del personal y acceso al sistema.</p>
        </div>
        <PermissionGuard permissions="users.manage">
          <BaseButton onClick={handleCreate}>
            <Plus className="w-5 h-5 mr-2" />
            Añadir Usuario
          </BaseButton>
        </PermissionGuard>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 md:max-w-md relative">
            <BaseInput 
              placeholder="Buscar usuarios..." 
              className="pl-10 h-10"
            />
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-text-secondary">Cargando usuarios...</div>
        ) : error ? (
          <div className="text-center py-4 text-danger">{error}</div>
        ) : (
          <BaseDataTable 
            data={users} 
            columns={columns} 
            onRowClick={(row) => { if (hasPermission('users.manage')) handleEdit(row) }}
          />
        )}
      </div>

      <BaseModal
        title={selectedUser ? 'Editar Usuario y Permisos' : 'Nuevo Usuario'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar" key={selectedUser?.id || 'new'}>
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider border-b border-border-base pb-2">Información General</h3>
             <BaseInput label="Nombre completo" defaultValue={selectedUser?.name} placeholder="Ej. Juan Pérez" />
             <BaseInput label="Correo electrónico" type="email" defaultValue={selectedUser?.email} placeholder="juan@ejemplo.com" />
             {selectedUser && (
               <BaseInput 
                 label="Cambiar Contraseña (Opcional)" 
                 type="password" 
                 placeholder="Dejar en blanco para no cambiar" 
                 onChange={(e) => {
                   if (e.target.value.length > 0 && e.target.value.length < 8) {
                     e.target.setCustomValidity('Mínimo 8 caracteres');
                   } else {
                     e.target.setCustomValidity('');
                   }
                 }}
               />
             )}
             <div className="grid grid-cols-2 gap-4">
               <BaseSelect 
                 label="Rol base de sistema" 
                 options={[
                   { value: 'Director Comercial', label: 'Director Comercial' },
                   { value: 'Ventas Senior', label: 'Ventas Senior' },
                   { value: 'Audit', label: 'Audit' }
                 ]} 
                 defaultValue={selectedUser?.role || 'Ventas Senior'}
               />
               <BaseSelect 
                 label="Estado" 
                 options={[
                   { value: 'ACTIVO', label: 'Activo' },
                   { value: 'SUSPENDIDO', label: 'Suspendido' }
                 ]} 
                 defaultValue={selectedUser?.status || 'ACTIVO'}
               />
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border-base">
             <div>
               <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Overrides de Permisos (Excepciones)</h3>
               <p className="text-xs text-text-secondary mt-1">
                 Otorga permisos directos a este usuario de manera independiente a su rol base. 
               </p>
             </div>
             
             {permissionCategories.map((category) => (
                <div key={category.name} className="space-y-3">
                  <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider bg-bg-surface-hover p-2 rounded border border-border-base">{category.name}</h4>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {category.permissions.map(perm => {
                       // Mock logic to show some checked as overrides
                       const isOverride = selectedUser && Math.random() > 0.8;
                       return (
                          <label key={perm.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-bg-surface-hover cursor-pointer border border-transparent hover:border-border-base transition-colors group">
                            <input 
                              type="checkbox" 
                              className="mt-1 h-4 w-4 rounded border-border-strong text-brand-primary focus:ring-brand-primary cursor-pointer" 
                              defaultChecked={isOverride} 
                            />
                            <div>
                              <span className="text-sm text-text-primary font-medium group-hover:text-brand-primary transition-colors block">{perm.name}</span>
                              <span className="text-xs text-text-tertiary block mt-0.5">{perm.description}</span>
                            </div>
                          </label>
                       );
                    })}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-3 mt-6 sticky bottom-0 bg-bg-surface pt-4 border-t border-border-base">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleSave}>Guardar Cambios</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
