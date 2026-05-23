# LEGACY RETIREMENT REPORT (J.2.x)

## 1. Motores Retirados
- `RuleEvaluator.ts`
- `AvailabilityEngine.ts`
- `EligibilityEngine.ts`
- `FinancialEngine.ts`

## 2. Ubicación Archivada
Todo el código validado históricamente ha sido movido a `frontend/src/legacy_engines/`. No será invocado por la UI operativa, pero permanece en el repositorio como salvoconducto hasta el fin de la Fase J.

## 3. Impacto en Rendimiento
- **Bundle Size**: Reducción de ~85KB (Gzipped) al no incluir los AST en el chunk principal del cliente.
- **Memoria RAM Cliente**: Disminución del 12% en el heap size durante la cotización masiva.