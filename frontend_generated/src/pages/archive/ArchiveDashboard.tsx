import React from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';

export function ArchiveDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'Archivo Físico y Legal Hold' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Archivo</h1>
          <p className="text-sm text-text-secondary mt-1">Políticas de retención y purga.</p>
        </div>
      </div>
      <BaseCard className="mb-6">
        <div className="flex items-center justify-center p-8 text-text-tertiary">
           No hay retenciones legales activas
        </div>
      </BaseCard>
    </div>
  );
}
