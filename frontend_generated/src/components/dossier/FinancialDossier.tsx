import { BaseBadge } from '../base/BaseBadge';
import { BaseButton } from '../base/BaseButton';
import React from 'react';
import { BaseDossierViewer, DossierSection, DossierField } from './BaseDossierViewer';

interface FinancialDossierProps {
  invoice: any;
}

export function FinancialDossier({ invoice }: FinancialDossierProps) {
  const header = (
    <div>
      <h2 className="text-lg font-bold text-text-primary">Factura {invoice?.folio || '#INV-000'}</h2>
      <p className="text-sm text-text-secondary">Emitido a: {invoice?.clientName || '---'}</p>
    </div>
  );

  const actions = (
    <BaseBadge variant={invoice?.isPaid ? 'success' : 'warning'}>
      {invoice?.isPaid ? 'Pagada' : 'Pendiente'}
    </BaseBadge>
  );

  return (
    <BaseDossierViewer header={header} actions={actions}>
      <DossierSection title="Resumen Financiero">
        <DossierField label="Fecha de Emisión" value={invoice?.issueDate || '---'} />
        <DossierField label="Fecha de Vencimiento" value={invoice?.dueDate || '---'} />
        <DossierField label="Uso CFDI" value={invoice?.cfdiUse || 'G03 Gastos en general'} />
      </DossierSection>
      <DossierSection title="Montos Generados (Solo lectura)">
        <DossierField label="Subtotal" value={invoice?.subtotal || '$0.00'} />
        <DossierField label="Impuestos" value={invoice?.taxes || '$0.00'} />
        <DossierField label="Total" value={invoice?.total || '$0.00' } />
      </DossierSection>
    </BaseDossierViewer>
  );
}
