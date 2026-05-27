import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import { PermissionGuard } from '../../core/PermissionGuard';
import { Plus } from 'lucide-react';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { toast } from 'sonner';

export function AgreementsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    toast.success('Borrador de convenio creado exitosamente');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'Convenios' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Convenios</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión de patrocinios, intercambios y cortesías.</p>
        </div>
        <PermissionGuard permissions="admin.access">
          <BaseButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Convenio
          </BaseButton>
        </PermissionGuard>
      </div>
      <BaseCard noPadding>
         <BaseDataTable columns={[{ key: 'id', label: 'ID' }, { key: 'type', label: 'Tipo' }, { key: 'status', label: 'Estado' }]} data={[]} />
      </BaseCard>

      <BaseModal
        title="Crear Nuevo Convenio"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseSelect 
            label="Tipo de Convenio" 
            options={[
              { value: 'sponsor', label: 'Patrocinio' },
              { value: 'exchange', label: 'Intercambio' },
              { value: 'courtesy', label: 'Cortesía' }
            ]} 
          />
          <BaseSelect 
            label="Cliente / Entidad" 
            options={[
              { value: 'Gobierno Estatal', label: 'Gobierno Estatal' },
              { value: 'Universidad Local', label: 'Universidad Local' }
            ]} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleCreate}>Generar Convenio</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
