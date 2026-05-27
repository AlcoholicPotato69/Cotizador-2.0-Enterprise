import React from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';

export function WorkflowDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'Flujos de Trabajo' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Workflow</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión de Aprobaciones y FSM.</p>
        </div>
      </div>
      <BaseCard title="Tareas Pendientes" className="mb-6">
        <div className="flex items-center justify-center p-8 text-text-tertiary">
          No hay tareas pendientes en sus flujos de trabajo
        </div>
      </BaseCard>
    </div>
  );
}
