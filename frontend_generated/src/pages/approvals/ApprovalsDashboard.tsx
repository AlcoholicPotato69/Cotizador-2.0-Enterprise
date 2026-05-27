import React, { useState, useEffect } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseSelect } from '../../components/base/BaseSelect';
import { BaseBadge } from '../../components/base/BaseBadge';
import { PermissionGuard } from '../../core/PermissionGuard';
import { useNotificationStore } from '../../core/notifications';
import { useTenantStore } from '../../core/tenant';
import { Plus, RefreshCcw, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { api } from '../../core/api';

export function ApprovalsDashboard() {
  const { currentTenant } = useTenantStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);

  const [tenantContracts, setTenantContracts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchApprovals = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/approvals');
        if (mounted) {
          // Filter by tenant if API doesn't do it automatically, 
          // but usually API does it via X-Tenant-ID header. 
          // Assuming API returns tenant-specific data:
          setTenantContracts(res.data || []);
        }
      } catch (err) {
        if (mounted) console.error('Failed to fetch approvals:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchApprovals();
    return () => { mounted = false; };
  }, [currentTenant]);

  const stats = [
    { name: 'Pendientes', value: tenantContracts.filter(c => c.status === 'PENDING').length, color: '#f59e0b' },
    { name: 'Aprobados', value: tenantContracts.filter(c => c.status === 'APPROVED').length, color: '#10b981' },
    { name: 'Rechazados', value: tenantContracts.filter(c => c.status === 'REJECTED').length, color: '#ef4444' },
  ];

  // Utility to trigger UNDER_REVIEW notification
  const triggerReviewStatus = (contractId: string) => {
    useNotificationStore.getState().add({
      title: 'Revisión Necesaria',
      message: `El contrato ${contractId} ha entrado en estado UNDER_REVIEW y requiere tu aprobación.`,
      type: 'success'
    });
    toast.success(`Notificación enviada: El contrato ${contractId} está en revisión.`);
  };

  const handleSaveHierarchy = () => {
    toast.success('Jerarquía de aprobación guardada con éxito.');
    setIsHierarchyModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <BaseBreadcrumb items={[{ label: 'Aprobaciones' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Matriz de Aprobaciones</h1>
          <p className="text-sm text-text-secondary mt-1">Configuración y monitoreo de la matriz de autorizaciones y flujos.</p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permissions="admin.access">
            <BaseButton onClick={() => setIsHierarchyModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Nueva Jerarquía
            </BaseButton>
          </PermissionGuard>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseCard title="Estado de Contratos" className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </BaseCard>

        <BaseCard title="Flujos Pendientes de Acción" noPadding className="h-[350px] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <BaseDataTable 
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'type', label: 'Tipo' },
                { 
                  header: 'Estado',
                  accessorKey: 'status',
                  cell: (row: any) => {
                    switch(row.status) {
                      case 'APPROVED': return <BaseBadge variant="success">Aprobado</BaseBadge>;
                      case 'REJECTED': return <BaseBadge variant="danger">Rechazado</BaseBadge>;
                      case 'PENDING': return <BaseBadge variant="warning">Pendiente</BaseBadge>;
                      default: return <BaseBadge>{row.status}</BaseBadge>;
                    }
                  }
                },
                {
                  header: 'Acción',
                  accessorKey: 'actions',
                  cell: (row: any) => (
                    row.status === 'PENDING' && (
                      <BaseButton size="sm" variant="outline" onClick={() => triggerReviewStatus(row.id)}>
                        Poner en Revisión
                      </BaseButton>
                    )
                  )
                }
              ]} 
              data={tenantContracts} 
            />
          </div>
        </BaseCard>
      </div>

      <BaseModal
        title="Crear Jerarquía de Aprobación"
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseSelect 
            label="Tipo de Documento" 
            options={[
              { value: 'arrendamiento', label: 'Contrato de Arrendamiento' },
              { value: 'publicidad', label: 'Contrato de Publicidad' },
              { value: 'convenio', label: 'Convenio de Intercambio' }
            ]} 
          />
          <BaseInput 
            label="Condición de Monto Mínimo M.N. (Opcional)" 
            type="number"
            placeholder="Ej. 150000"
          />
          <BaseSelect 
            label="Primer Aprobador (Nivel 1)" 
            options={[
              { value: 'gerente_comercial', label: 'Gerencia Comercial' },
              { value: 'director_operaciones', label: 'Dirección de Operaciones' }
            ]} 
          />
          <BaseSelect 
            label="Aprobador Final (Nivel 2)" 
            options={[
              { value: 'director_general', label: 'Dirección General' },
              { value: 'comite', label: 'Comité Técnico' }
            ]} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsHierarchyModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleSaveHierarchy}>Guardar Jerarquía</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
