import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowBadge } from '../../components/workflow/WorkflowBadge';
import { PermissionGuard } from '../../core/PermissionGuard';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../core/api';

export function QuotesList() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [quotes, setQuotes] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [quotesRes, clientsRes, spacesRes] = await Promise.all([
          api.get('/quotes'),
          api.get('/clients'),
          api.get('/spaces')
        ]);
        if (mounted) {
          setQuotes(quotesRes.data || []);
          setClients(clientsRes.data || []);
          setSpaces(spacesRes.data || []);
        }
      } catch (error) {
        if (mounted) toast.error('Error al cargar datos');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { 
      header: 'Cliente', 
      accessorKey: 'client',
      cell: (row: any) => row.client?.name || row.clientId
    },
    { 
      header: 'Total', 
      accessorKey: 'totalAmount',
      cell: (row: any) => row.totalAmount ? `$${row.totalAmount.toLocaleString()} MXN` : 'N/A'
    },
    { 
      header: 'Fecha', 
      accessorKey: 'createdAt',
      cell: (row: any) => new Date(row.createdAt).toLocaleDateString()
    },
    { 
      header: 'Estado', 
      accessorKey: 'status',
      cell: (row: any) => <WorkflowBadge state={row.status || 'DRAFT'} />
    },
  ];

  const handleCreate = () => {
    setIsModalOpen(false);
    navigate('/app/quotes/new');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Cotizaciones</h1>
          <p className="text-text-secondary mt-1">Gestión de cotizaciones y propuestas comerciales.</p>
        </div>
        <PermissionGuard permissions="quotes.create">
          <BaseButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nueva Cotización
          </BaseButton>
        </PermissionGuard>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 md:max-w-md relative">
            <BaseInput 
              placeholder="Buscar por ID, cliente..." 
              className="pl-10"
            />
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
          </div>
          <BaseButton variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </BaseButton>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Cargando cotizaciones...</div>
        ) : (
          <BaseDataTable 
            data={quotes} 
            columns={columns} 
            onRowClick={(row) => navigate(`/app/quotes/${row.id}`)}
          />
        )}
      </div>

      <BaseModal
        title="Crear Nueva Cotización"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseSelect 
            label="Cliente" 
            options={[
              { value: '', label: 'Seleccionar...' },
              ...clients.map(c => ({ value: c.id, label: c.name }))
            ]} 
          />
          <BaseSelect 
            label="Tipo de Espacio" 
            options={[
              { value: '', label: 'Seleccionar...' },
              ...spaces.map(s => ({ value: s.id, label: s.name }))
            ]} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleCreate}>Crear Cotización</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
