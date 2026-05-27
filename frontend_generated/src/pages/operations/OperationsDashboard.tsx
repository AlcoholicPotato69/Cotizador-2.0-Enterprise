import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseLoading } from '../../components/base/BaseLoading';
import { Plus, RefreshCcw } from 'lucide-react';

export function OperationsDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'Operaciones' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Operaciones</h1>
          <p className="text-sm text-text-secondary mt-1">Colas de trabajos de fondo y sistema.</p>
        </div>
        <div className="flex gap-2">
          <BaseButton variant="outline" onClick={() => setIsLoading(!isLoading)}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Actualizar
          </BaseButton>
          <BaseButton>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo
          </BaseButton>
        </div>
      </div>
      
      <BaseCard noPadding className="min-h-[400px]">
        {isLoading ? (
          <BaseLoading fullHeight />
        ) : (
          <BaseDataTable 
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'status', label: 'Estado' },
              { key: 'updatedAt', label: 'Última Actualización' }
            ]} 
            data={data} 
          />
        )}
      </BaseCard>
    </div>
  );
}
