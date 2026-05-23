# BACKUP MIGRATION ASSESSMENT (J.0)
## 1. Inventario de Motores
- **Rule Engine**: Actualmente en Frontend (`RuleEvaluator.ts`).
- **Availability**: Frontend (`AvailabilityEngine.ts`).
- **Effective Permissions**: Frontend (`EffectivePermissionsEngine.ts`).

## 2. Dependencias
- Componentes: `QuotesView.vue`, `PricingBuilder.vue`.
- Stores: `permissions.ts`, `tenant.ts`.

## 3. Riesgos
- **CRÍTICO**: Romper Snapshots o contratos históricos de Casa de Piedra.
- **ALTO**: Desfase en el cálculo del precio base entre UI y BD.

## 4. Plan de Transición
1. Estado Actual -> 2. Modo Híbrido (Shadow Mode) -> 3. Backend Autoritativo -> 4. Frontend Presentacional.

## 5. Rollback
Desactivar los hooks en `pb_hooks/` restaurará automáticamente la autoridad al cliente Vue en caso de falla.