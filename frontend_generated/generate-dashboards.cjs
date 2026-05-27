const fs = require('fs');
const path = require('path');

const modules = [
  { path: 'src/pages/reviews/ReviewsDashboard.tsx', title: 'Centro de Revisiones', breadcrumb: 'Revisiones', desc: 'Gestión de revisiones de documentos y contratos.' },
  { path: 'src/pages/approvals/ApprovalsDashboard.tsx', title: 'Matriz de Aprobaciones', breadcrumb: 'Aprobaciones', desc: 'Configuración y monitoreo de la matriz de autorizaciones.' },
  { path: 'src/pages/regulations/RegulationsDashboard.tsx', title: 'Centro de Reglamentos', breadcrumb: 'Reglamentos', desc: 'Políticas y reglamentos de espacios.' },
  { path: 'src/pages/storage/StorageDashboard.tsx', title: 'Centro de Almacenamiento', breadcrumb: 'Storage', desc: 'Uso de cuotas y archivos huérfanos.' },
  { path: 'src/pages/operations/OperationsDashboard.tsx', title: 'Centro de Operaciones', breadcrumb: 'Operaciones', desc: 'Colas de trabajos de fondo y sistema.' },
  { path: 'src/pages/featureFlags/FeatureFlagsDashboard.tsx', title: 'Feature Flags', breadcrumb: 'Feature Flags', desc: 'Control de versiones y lanzamiento de características.' },
  { path: 'src/pages/tenants/TenantsDashboard.tsx', title: 'Gestión de Tenants', breadcrumb: 'Tenants', desc: 'Administración de instancias y Multi-Tenant.' },
  { path: 'src/pages/numbering/NumberingDashboard.tsx', title: 'Centro de Folios', breadcrumb: 'Folios', desc: 'Secuencias y numeración automática.' },
  { path: 'src/pages/snapshots/SnapshotsDashboard.tsx', title: 'Centro de Snapshots', breadcrumb: 'Snapshots', desc: 'Históricos y versionado congelado de entidades.' },
  { path: 'src/pages/activity/ActivityDashboard.tsx', title: 'Centro de Actividad', breadcrumb: 'Actividad', desc: 'Línea de tiempo de actividad global.' },
  { path: 'src/pages/processes/ProcessDashboard.tsx', title: 'Directorio de Procesos', breadcrumb: 'Procesos', desc: 'Orquestación de operaciones de negocio.' },
  { path: 'src/pages/legal/LegalDashboard.tsx', title: 'Centro Jurídico', breadcrumb: 'Jurídico', desc: 'Vigilancia legal y firmas de contratos.' },
  { path: 'src/pages/observability/ObservabilityDashboard.tsx', title: 'Observabilidad', breadcrumb: 'Observabilidad', desc: 'Métricas, logs y salud del sistema de despliegue.' },
  { path: 'src/pages/tasks/TasksDashboard.tsx', title: 'Centro de Tareas', breadcrumb: 'Mis Tareas', desc: 'Inbox operativo y aprobaciones pendientes del usuario.' },
  { path: 'src/pages/settings/FinancialSettings.tsx', title: 'Configuración Financiera', breadcrumb: 'Finanzas', desc: 'Configuración de monedas, impuestos y bancos.' },
  { path: 'src/pages/command/CommandCenter.tsx', title: 'Command Center', breadcrumb: 'Comandos', desc: 'Control centralizado y búsqueda rápida.' }
];

for (const mod of modules) {
  const dir = path.dirname(mod.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const content = `import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseLoading } from '../../components/base/BaseLoading';
import { Plus, RefreshCcw } from 'lucide-react';

export function ${path.basename(mod.path, '.tsx')}() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: '${mod.breadcrumb}' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">${mod.title}</h1>
          <p className="text-sm text-text-secondary mt-1">${mod.desc}</p>
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
`;
  fs.writeFileSync(mod.path, content);
}

// Generate the FSM Visualization Engine
const fsmDir = 'src/pages/fsm';
if (!fs.existsSync(fsmDir)) fs.mkdirSync(fsmDir, { recursive: true });
const fsmContent = `import React from 'react';
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
`;
fs.writeFileSync(path.join(fsmDir, 'FsmVisualizationEngine.tsx'), fsmContent);

console.log('Successfully created all dashboards');
