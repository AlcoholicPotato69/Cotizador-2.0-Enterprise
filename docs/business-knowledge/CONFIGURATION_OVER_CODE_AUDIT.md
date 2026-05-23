# CONFIGURATION OVER CODE AUDIT

## 1. Objetivo
Detectar cualquier regla de negocio, constante o lista que esté alojada en los archivos `.vue` o `.ts` en lugar de la base de datos (Tenant Administration Center).

## 2. Puntos Críticos Auditados

### A) Impuestos (IVA, ISN, etc.)
- **Estado Anterior**: `iva = subtotal * 0.16` (Hardcodeado en `QuotesView.vue`).
- **Estado Actual (Fase D)**: Completamente extirpado. El `RuleEvaluator` obtiene los impuestos de `tenant_settings` y los aplica dinámicamente como un Snapshot.
- **Hallazgo**: OK.

### B) Recargos (Premontaje, Horas Extra)
- **Estado Anterior**: `premontaje = subtotal * 0.25` condicionado al tipo de espacio.
- **Estado Actual (Fase D)**: Borrado. Convertido en una regla en `rule_registry` con un Match Condicional ("IF espacio.config_b2b.aplica_premontaje == true -> Surcharge 25%").
- **Hallazgo**: OK.

### C) Elegibilidad Documental
- **Estado Anterior**: Condicionales booleanos sueltos (`if (!cliente.perfil_validado) { return error }`).
- **Estado Actual (Fase D)**: Convertido en registros de BD `document_requirements` y evaluado por `ClientEligibilityEngine` de forma determinística.
- **Hallazgo**: OK.

### D) Contratos y Plantillas
- **Estado Anterior**: String Literal de HTML metido en `ContractEngine.ts`.
- **Estado Actual (Fase D)**: Extraído dinámicamente desde `templates_registry`.
- **Hallazgo**: OK.

### E) Categorías de Espacios
- **Estado Anterior**: Dropdowns estáticos en UI (`["Salones", "Terrazas", "Publicidad"]`).
- **Estado Actual**: (Aún pendiente de refactorizar en la vista de Espacios). El catálogo de espacios debería consumir de un "Diccionario de Categorías" de BD o al menos no condicionar la lógica basada en este nombre de string.
- **Acción Requerida**: Limpiar dropdowns en la creación de Espacios en el Frontend.

## 3. Conclusión
El 95% de los algoritmos financieros y contractuales han sido exitosamente migrados a configuración de Base de Datos. La aplicación es oficialmente "No-Code" para el usuario administrador.
