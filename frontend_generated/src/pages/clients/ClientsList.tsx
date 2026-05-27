import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseButton } from '../../components/base/BaseButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { api } from '../../core/api';

export function ClientsList() {
  const navigate = useNavigate();

  const [clients, setClients] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        if (mounted) setClients(res.data || []);
      } catch (error) {
        if (mounted) console.error('Failed to fetch clients', error);
      }
    };
    fetchClients();
    return () => { mounted = false; };
  }, []);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'name' },
    { header: 'Tipo', accessorKey: 'type' },
    { header: 'Teléfono', accessorKey: 'phone' },
    { 
      header: 'Estado', 
      accessorKey: 'status',
      cell: (row: any) => {
        const variant = row.status === 'CLIENT' ? 'success' : row.status === 'PROSPECT' ? 'primary' : 'secondary';
        return <BaseBadge variant={variant as any}>{row.status}</BaseBadge>;
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Directorio de Clientes</h1>
          <p className="text-text-secondary mt-1">Gestión de leads, prospectos y clientes activos.</p>
        </div>
        <BaseButton>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </BaseButton>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 md:max-w-md relative">
            <BaseInput 
              placeholder="Buscar clientes por nombre, RFC..." 
              className="pl-10"
            />
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
          </div>
        </div>
        
        <BaseDataTable 
          data={clients} 
          columns={columns} 
          onRowClick={(row) => navigate(`/app/clients/${row.id}`)}
        />
      </div>
    </div>
  );
}
