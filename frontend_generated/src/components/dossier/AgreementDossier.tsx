import React from 'react';
import { BaseDossierViewer, DossierSection, DossierField } from './BaseDossierViewer';
import { WorkflowBadge } from '../workflow/WorkflowBadge';

interface AgreementDossierProps {
  agreement: any;
}

export function AgreementDossier({ agreement }: AgreementDossierProps) {
  const header = (
    <div>
      <h2 className="text-lg font-bold text-text-primary">Acuerdo {agreement?.code || '#AGR-000'}</h2>
      <p className="text-sm text-text-secondary">Sponsor/Partner: {agreement?.clientName || '---'}</p>
    </div>
  );

  const actions = (
    <WorkflowBadge state={agreement?.status || 'UNDER_REVIEW'} />
  );

  return (
    <BaseDossierViewer header={header} actions={actions}>
      <DossierSection title="Condiciones del Acuerdo">
        <DossierField label="Tipo" value={agreement?.type || 'Cortesía'} />
        <DossierField label="Válido hasta" value={agreement?.validUntil || '---'} />
        <DossierField label="Aprobador" value={agreement?.approvedBy || '---'} />
      </DossierSection>
      <DossierSection title="Observaciones">
        <DossierField label="Notas" value={agreement?.notes || 'Sin notas adicionales.'} />
      </DossierSection>
    </BaseDossierViewer>
  );
}
