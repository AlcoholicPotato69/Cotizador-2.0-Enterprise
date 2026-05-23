import { pb } from '../services/pb';

export interface PaymentScheduleRule {
  type: 'upfront' | 'split' | 'custom' | 'postpaid';
  installments: number;
  percentages: number[]; // e.g., [50, 50] or [30, 40, 30]
}

export class ContractManager {

  /**
   * Genera el Contrato congelando todas las capas subyacentes de la Cotización
   * y aplicando el esquema de pagos (Payment Schedule) vigente.
   */
  static async generateContractFromQuote(quoteId: string, tenantId: string): Promise<any> {
    
    // 1. Fetch live Quote and Settings
    const quote = await pb.collection('cotizaciones').getOne(quoteId);
    
    // 2. Fetch live Payment Schedule configured in Tenant Administration Center
    const settings = await pb.collection('tenant_settings').getFirstListItem(`tenant="${tenantId}"`);
    const activeSchedule = settings.payment_schedule || { type: 'upfront', installments: 1, percentages: [100] };

    // 3. Assemble the Mega Financial Snapshot
    const financialSnapshot = {
      base_total: quote.desglose_precios?.subtotal,
      taxes_amount: quote.desglose_precios?.taxes?.reduce((sum: number, t: any) => sum + t.amount, 0) || 0,
      discounts_amount: quote.desglose_precios?.promotionRules?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
      grand_total: quote.precio_final,
      currency: 'MXN'
    };

    // 4. Create the Contract record (The new Financial Hub)
    const contractData = {
      tenant: tenantId,
      cotizacion: quoteId,
      oper_status: 'draft',
      fin_status: 'pending',
      
      // Deep Frozen Snapshots
      quote_snapshot: JSON.parse(JSON.stringify(quote)),
      client_snapshot: quote.client_snapshot,
      tenant_snapshot: quote.tenant_snapshot,
      pricing_snapshot: quote.pricing_snapshot,
      promotion_snapshot: quote.promotion_snapshot,
      tax_snapshot: quote.tax_snapshot,
      branding_snapshot: quote.branding_snapshot,
      template_snapshot: quote.template_snapshot,
      
      // New Financial Snapshots
      financial_snapshot: financialSnapshot,
      payment_schedule_snapshot: JSON.parse(JSON.stringify(activeSchedule)) // VERSIONING PAYMENT SCHEDULE
    };

    const contract = await pb.collection('contracts_registry').create(contractData);
    
    // Update quote status
    await pb.collection('cotizaciones').update(quoteId, { status: 'finalizada' });
    
    return contract;
  }

  /**
   * Validates if a contract can be safely closed based on Closure Rules.
   */
  static async canCloseContract(contractId: string): Promise<{ canClose: boolean, reasons: string[] }> {
    const reasons: string[] = [];
    const contract = await pb.collection('contracts_registry').getOne(contractId);
    
    // 1. Validate Balance
    if (contract.fin_status !== 'paid') {
      reasons.push("El contrato no puede cerrarse porque tiene un saldo pendiente de cobro.");
    }

    // 2. Validate Financial Events Integrity (Reconciliation)
    const events = await pb.collection('financial_events').getFullList({ filter: `contract="${contractId}"` });
    const missingInvoices = events.some(e => e.event_type === 'payment' && !e.snapshot?.invoice_id);
    if (missingInvoices) {
      reasons.push("Existen pagos que aún no han sido facturados o conciliados.");
    }

    // 3. CFDI Validation
    const cfdis = events.filter(e => e.event_type === 'invoice');
    const rejectedCfdis = cfdis.some(e => e.reconciliation_status === 'mismatch');
    if (rejectedCfdis) {
      reasons.push("Existen facturas con estado de Reconciliación 'mismatch' o fallido.");
    }

    return {
      canClose: reasons.length === 0,
      reasons
    };
  }
}
