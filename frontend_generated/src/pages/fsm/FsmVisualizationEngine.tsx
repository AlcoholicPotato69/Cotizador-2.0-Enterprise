import React from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';

export function FsmVisualizationEngine() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'FSM Engine' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">FSM Visualization Engine</h1>
          <p className="text-sm text-text-secondary mt-1">Explorador visual de máquinas de estados finitos del ERP.</p>
        </div>
      </div>
      
      <BaseCard className="min-h-[500px] flex items-center justify-center p-8 bg-black/5 border-dashed border-2">
         <div className="text-center text-text-tertiary">
            Motor de renderizado de Mermaid.js o flujos visuales
         </div>
      </BaseCard>
    </div>
  );
}
