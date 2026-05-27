import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseSelect } from '../../components/base/BaseSelect';
import { BaseBadge } from '../../components/base/BaseBadge';
import { Plus, CheckCircle, ShieldAlert, Store, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function RegulationsDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', target: 'general', status: 'ACTIVE' });

  // Data that supports both General rules and Space-Specific rules
  const [data, setData] = useState([
    { id: 'REG-001', name: 'Reglamento General de Arrendamiento', target: 'General', status: 'ACTIVE', version: 'v3.2', updatedAt: '2026-05-10' },
    { id: 'REG-002', name: 'Lineamientos Protección Civil', target: 'General', status: 'ACTIVE', version: 'v2.0', updatedAt: '2026-01-15' },
    { id: 'REG-003', name: 'Reglamento Ruido y Decibeles', target: 'Salón Principal', status: 'ACTIVE', version: 'v1.1', updatedAt: '2025-11-20' },
    { id: 'REG-004', name: 'Políticas de Áreas Verdes', target: 'Jardín Norte', status: 'DRAFT', version: 'v1.0', updatedAt: '2026-05-27' },
  ]);

  const handleCreate = () => {
    if (!formData.name) return toast.error('El nombre es requerido');
    const newReg = {
      id: `REG-00${data.length + 1}`,
      name: formData.name,
      target: formData.target === 'general' ? 'General' : formData.target,
      status: formData.status,
      version: 'v1.0',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setData([newReg, ...data]);
    setIsModalOpen(false);
    toast.success('Reglamento creado exitosamente');
    setFormData({ name: '', target: 'general', status: 'DRAFT' });
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre del Reglamento', accessorKey: 'name' },
    { 
      header: 'Alcance / Aplicabilidad', 
      accessorKey: 'target',
      cell: (row: any) => (
        <span className="flex items-center gap-2">
          {row.target === 'General' ? <ShieldAlert className="w-4 h-4 text-brand-primary" /> : <Store className="w-4 h-4 text-text-tertiary" />}
          <span className={row.target === 'General' ? 'font-semibold' : ''}>{row.target}</span>
        </span>
      )
    },
    { header: 'Versión', accessorKey: 'version' },
    { 
      header: 'Estado', 
      accessorKey: 'status',
      cell: (row: any) => {
        if (row.status === 'ACTIVE') return <BaseBadge variant="success"><CheckCircle className="w-3 h-3 mr-1 inline"/> Activo</BaseBadge>;
        return <BaseBadge variant="warning"><XCircle className="w-3 h-3 mr-1 inline"/> Borrador</BaseBadge>;
      }
    },
    { header: 'Última Actualización', accessorKey: 'updatedAt' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-200">
      <BaseBreadcrumb items={[{ label: 'Reglamentos' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Reglamentos</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión centralizada de reglas, aplicables a nivel general o a espacios específicos.</p>
        </div>
        <div className="flex gap-2">
          <BaseButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Reglamento
          </BaseButton>
        </div>
      </div>
      
      <BaseCard noPadding className="min-h-[400px]">
        <div className="p-4 border-b border-border-base bg-bg-surface-hover">
           <p className="text-sm text-text-secondary">Si un espacio tiene un reglamento específico asignado, este anulará o complementará al reglamento general en el momento de crear el contrato.</p>
        </div>
        <BaseDataTable 
          columns={columns} 
          data={data} 
        />
      </BaseCard>

      <BaseModal
        title="Crear Documento de Reglamento"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseInput 
            label="Título del Reglamento" 
            placeholder="Ej. Lineamientos de Seguridad de Proveedores" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <BaseSelect 
            label="Alcance del Reglamento" 
            value={formData.target}
            onChange={(e) => setFormData({...formData, target: e.target.value})}
            options={[
              { value: 'general', label: 'Aplicación General (Para todos los espacios)' },
              { value: 'Salón Principal', label: 'Espacio Específico: Salón Principal' },
              { value: 'Jardín Norte', label: 'Espacio Específico: Jardín Norte' },
              { value: 'Pabellón B', label: 'Espacio Específico: Pabellón B' },
            ]} 
          />
          <BaseSelect 
            label="Estado Inicial" 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { value: 'ACTIVE', label: 'Activo (Aplicable inmediatamente)' },
              { value: 'DRAFT', label: 'Borrador (En Revisión)' }
            ]} 
          />
          
          <div className="mt-4 p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-md text-sm text-brand-primary">
            Al crear el registro, podrá cargar el documento PDF oficial desde el visor central para anexarlo al módulo e implementar el análisis OCR/NLP.
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleCreate}>Guardar Reglamento</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
