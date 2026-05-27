import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseInput } from '../../components/base/BaseInput';
import { Search, ShieldAlert, CheckCircle, Info, Activity } from 'lucide-react';
import { useTenantStore } from '../../core/tenant';
import { api } from '../../core/api';

export function AuditDashboard() {
  const { currentTenant } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit');
        if (mounted) setLogs(res.data || []);
      } catch (error) {
        if (mounted) console.error('Failed to fetch audit logs', error);
      }
    };
    fetchLogs();
    return () => { mounted = false; };
  }, [currentTenant]);

  const filteredLogs = logs.filter(log => 
    Object.values(log).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { header: 'ID Evento', accessorKey: 'id', cell: (row: any) => <span className="font-mono text-xs text-text-tertiary">{row.id}</span> },
    { header: 'Fecha y Hora', accessorKey: 'date' },
    { header: 'Usuario', accessorKey: 'user', cell: (row: any) => <span className="font-semibold text-text-primary">{row.user}</span> },
    { 
      header: 'Acción', 
      accessorKey: 'action', 
      cell: (row: any) => <span className="px-2 py-1 bg-bg-surface-hover rounded text-xs font-mono font-medium">{row.action}</span> 
    },
    { header: 'Recurso Afectado', accessorKey: 'resource' },
    { header: 'Dirección IP', accessorKey: 'ip', cell: (row: any) => <span className="font-mono text-xs">{row.ip}</span> },
    { 
      header: 'Resultado', 
      accessorKey: 'status',
      cell: (row: any) => {
        switch(row.status) {
          case 'SUCCESS': return <span className="inline-flex items-center gap-1 text-success text-xs font-semibold"><CheckCircle className="w-3 h-3"/> OK</span>;
          case 'UNAUTHORIZED': return <span className="inline-flex items-center gap-1 text-warning text-xs font-semibold"><ShieldAlert className="w-3 h-3"/> Bloqueado</span>;
          case 'FAILED': return <span className="inline-flex items-center gap-1 text-danger text-xs font-semibold"><Activity className="w-3 h-3"/> Fallo</span>;
          default: return <span className="inline-flex items-center gap-1 text-text-tertiary text-xs font-semibold"><Info className="w-3 h-3"/> Info</span>;
        }
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-200">
      <BaseBreadcrumb items={[{ label: 'Centro de Auditoría' }]} className="mb-6" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Auditoría (Logs)</h1>
          <p className="text-sm text-text-secondary mt-1">
            Trazabilidad completa de accesos, operaciones y mutaciones en base de datos para <strong className="uppercase">{currentTenant}</strong>.
          </p>
        </div>
        <div className="flex-1 md:max-w-md relative w-full">
          <BaseInput 
            placeholder="Buscar por usuario, IP, acción o recurso..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 w-full"
          />
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
        </div>
      </div>

      <BaseCard noPadding>
        <BaseDataTable columns={columns} data={filteredLogs} />
      </BaseCard>
    </div>
  );
}
