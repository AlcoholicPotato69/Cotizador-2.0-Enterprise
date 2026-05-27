import React, { useState, useEffect } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import { PermissionGuard } from '../../core/PermissionGuard';
import { Plus } from 'lucide-react';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { toast } from 'sonner';
import { api } from '../../core/api';

export function ContractsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [contractsRes, clientsRes] = await Promise.all([
          api.get('/contracts'),
          api.get('/clients')
        ]);
        if (mounted) {
          setContracts(contractsRes.data || []);
          setClients(clientsRes.data || []);
        }
      } catch (error) {
        if (mounted) toast.error('Error al cargar contratos');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleCreate = async () => {
    if (!selectedClient || !selectedTemplate) {
      toast.error('Por favor, selecciona un cliente y una plantilla');
      return;
    }
    
    setIsCreating(true);
    try {
      const res = await api.post('/contracts', {
        clientId: selectedClient,
        templateId: selectedTemplate,
        status: 'DRAFT'
      });
      setContracts([res.data, ...contracts]);
      toast.success('Borrador de contrato creado exitosamente');
      setIsModalOpen(false);
      setSelectedClient('');
      setSelectedTemplate('');
    } catch (error) {
      toast.error('Error al crear el contrato');
    } finally {
      setIsCreating(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', accessorKey: 'id' },
    { 
      key: 'client', 
      label: 'Cliente', 
      accessorKey: 'client',
      cell: (row: any) => row.client?.name || row.clientId
    },
    { 
      key: 'status', 
      label: 'Estado', 
      accessorKey: 'status'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'Contratos' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Contratos</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión del ciclo de vida de contratos.</p>
        </div>
        <PermissionGuard permissions="admin.access">
          <BaseButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Contrato
          </BaseButton>
        </PermissionGuard>
      </div>
      <BaseCard noPadding>
        {isLoading ? (
           <div className="p-8 text-center text-text-secondary">Cargando contratos...</div>
        ) : (
           <BaseDataTable columns={columns} data={contracts} />
        )}
      </BaseCard>

      <BaseModal
        title="Crear Nuevo Contrato"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="p-3 bg-brand-primary/10 rounded-lg text-sm text-brand-primary">
            Normalmente, los contratos se generan automáticamente al aprobar una cotización. Utiliza esta opción solo para contratos manuales.
          </div>
          <BaseSelect 
            label="Cliente" 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            options={[
              { value: '', label: 'Seleccionar...' },
              ...clients.map(c => ({ value: c.id, label: c.name }))
            ]} 
          />
          <BaseSelect 
            label="Plantilla de Contrato"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            options={[
              { value: '', label: 'Seleccionar...' },
              { value: 'arrendamiento', label: 'Arrendamiento de Espacio P.M.' },
              { value: 'publicidad', label: 'Contrato Mupis 2026' }
            ]} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isCreating}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleCreate} isLoading={isCreating}>Generar Contrato</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
