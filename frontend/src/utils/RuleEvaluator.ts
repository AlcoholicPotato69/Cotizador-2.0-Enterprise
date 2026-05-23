/**
 * Universal Rule Engine Evaluator
 * 
 * Este módulo procesa las condiciones JSON almacenadas en `rule_registry`
 * contra un contexto en tiempo real, devolviendo true o false de forma segura.
 */

// Define The Logical Operators
type Operator = "EQUALS" | "NOT_EQUALS" | "GREATER_THAN" | "LESS_THAN" | "INCLUDES" | "NOT_INCLUDES" | "AND" | "OR" | "NOT";

export interface RuleCondition {
  operator?: Operator;
  field?: string;
  op?: Operator;
  value?: any;
  rules?: RuleCondition[];
}

export interface RuleAction {
  type: string; // e.g. "surcharge", "discount", "block"
  value: any;
  unit?: string; // e.g. "percentage", "fixed"
  stop_processing?: boolean;
  is_exclusive?: boolean;
}

export interface RuleRecord {
  id: string;
  name: string;
  priority: number;
  version: number;
  conditions: RuleCondition;
  actions: RuleAction[];
}

/**
 * Función recursiva que resuelve la condición.
 */
const evaluateCondition = (condition: RuleCondition, context: any): boolean => {
  // Manejo de Agrupadores Lógicos (AND, OR, NOT)
  if (condition.operator) {
    if (!condition.rules || !Array.isArray(condition.rules)) return false;

    switch (condition.operator) {
      case "AND":
        return condition.rules.every(r => evaluateCondition(r, context));
      case "OR":
        return condition.rules.some(r => evaluateCondition(r, context));
      case "NOT":
        // NOT expects exactly 1 rule inside the array usually
        return !evaluateCondition(condition.rules[0], context);
      default:
        return false;
    }
  }

  // Manejo de Evaluación Simple
  if (!condition.field || !condition.op) return false;

  const actualValue = extractContextValue(context, condition.field);
  const targetValue = condition.value;

  switch (condition.op) {
    case "EQUALS": return actualValue === targetValue;
    case "NOT_EQUALS": return actualValue !== targetValue;
    case "GREATER_THAN": return Number(actualValue) > Number(targetValue);
    case "LESS_THAN": return Number(actualValue) < Number(targetValue);
    case "INCLUDES":
      if (Array.isArray(actualValue)) return actualValue.includes(targetValue);
      if (typeof actualValue === 'string') return actualValue.includes(targetValue);
      return false;
    case "NOT_INCLUDES":
      if (Array.isArray(actualValue)) return !actualValue.includes(targetValue);
      if (typeof actualValue === 'string') return !actualValue.includes(targetValue);
      return true;
    default:
      return false;
  }
};

/**
 * Navega por un objeto usando notación de puntos (ej. "tenant.slug")
 */
const extractContextValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * Entrada principal: Evalúa un arreglo de reglas priorizadas contra un contexto.
 * Retorna las reglas que aplicaron (cuyas condiciones fueron true).
 * Si alguna tiene stop_processing o is_exclusive, detiene la cadena.
 */
export const evaluateRules = (rules: RuleRecord[], context: any): RuleRecord[] => {
  // Ordenar por prioridad descendente (100 primero, 1 al final). 
  // En caso de empate, la version mayor gana.
  const sortedRules = [...rules].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.version - a.version;
  });
  
  const appliedRules: RuleRecord[] = [];

  for (const rule of sortedRules) {
    const isMatch = evaluateCondition(rule.conditions, context);
    if (isMatch) {
      appliedRules.push(rule);
      
      // Checar si hay stop_processing
      const shouldStop = rule.actions.some(action => action.stop_processing === true);
      if (shouldStop) {
        break; // Detiene la evaluación por completo (Ej. Eligibility)
      }

      // Checar si la regla es exclusiva
      const isExclusive = rule.actions.some(action => action.is_exclusive === true);
      if (isExclusive) {
        // Al ser exclusiva, descartamos silenciosamente las reglas de menor prioridad
        // simplemente rompiendo el ciclo.
        break; 
      }
    }
  }

  return appliedRules;
};
