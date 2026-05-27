import React from 'react';
import { BaseDossierViewer, DossierSection, DossierField } from './BaseDossierViewer';
import { WorkflowBadge } from '../workflow/WorkflowBadge';

interface ContractDossierProps {
  contract: any;
}

export function ContractDossier({ contract }: ContractDossierProps) {
  const header = (
    <div>
      <h2 className="text-lg font-bold text-text-primary">Contrato {contract?.code || '#CTR-000'}</h2>
      <p className="text-sm text-text-secondary">Cliente: {contract?.clientName || '---'}</p>
    </div>
  );

  const actions = (
    <WorkflowBadge state={contract?.status || 'DRAFT'} />
  );

  return (
    <BaseDossierViewer header={header} actions={actions}>
      <DossierSection title="Detalles del Contrato">
        <DossierField label="Tipo" value={contract?.type || 'Comercial'} />
        <DossierField label="Fecha de Inicio" value={contract?.startDate || '---'} />
        <DossierField label="Fecha de Fin" value={contract?.endDate || '---'} />
      </DossierSection>
      <DossierSection title="Términos">
        <DossierField label="Vigencia" value="12 Meses" />
        <DossierField label="Renovación Automática" value="Mínimo 30 días de preaviso" />
      </DossierSection>
    </BaseDossierViewer>
  );
}
