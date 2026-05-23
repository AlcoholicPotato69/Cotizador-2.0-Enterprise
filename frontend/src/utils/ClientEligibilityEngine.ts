/**
 * Client Eligibility Engine
 * 
 * Evalúa las reglas de elegibilidad del cliente (vencimientos, bloqueos)
 * basándose 100% en el Universal Rule Engine.
 * Devuelve el Snapshot Audit Trail necesario.
 */

import { evaluateRules } from './RuleEvaluator';
import type { RuleRecord } from './RuleEvaluator';

export interface EligibilityResult {
  eligible: boolean;
  canQuote: boolean;
  canContract: boolean;
  reasons: string[];
  rulesApplied: string[];
}

export const evaluateClientEligibility = (
  clientContext: any, 
  eligibilityRules: RuleRecord[]
): EligibilityResult => {
  
  // Resultado por defecto (Asumimos válido hasta que una regla diga lo contrario)
  const result: EligibilityResult = {
    eligible: true,
    canQuote: true,
    canContract: true,
    reasons: [],
    rulesApplied: []
  };

  // 1. Ejecutamos el Universal Rule Engine
  // Solo pasamos reglas del tipo "eligibility"
  const appliedRules = evaluateRules(eligibilityRules, clientContext);

  // 2. Traducimos las "Actions" de las reglas aplicadas al resultado final
  appliedRules.forEach(rule => {
    // Audit Trail (Rule Traceability Obligatoria)
    result.rulesApplied.push(`${rule.name} v${rule.version}`);

    rule.actions.forEach(action => {
      if (action.type === 'block_quote') {
        result.canQuote = false;
        result.eligible = false;
        result.reasons.push(action.value || 'Bloqueo Comercial para Cotizar');
      }
      
      if (action.type === 'block_contract') {
        result.canContract = false;
        result.eligible = false;
        result.reasons.push(action.value || 'Documentación pendiente/vencida para Contratar');
      }

      if (action.type === 'warning') {
        // Un warning no bloquea, pero se registra
        result.reasons.push(`[Aviso] ${action.value}`);
      }
    });
  });

  return result;
};
