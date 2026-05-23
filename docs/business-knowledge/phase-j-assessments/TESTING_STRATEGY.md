# TESTING STRATEGY (J.4)

## 1. Unit Tests (Vitest)
Se implementa Vitest para la validación algorítmica aislada de los 6 motores principales.
- **Motores Evaluados**: `RuleEvaluator`, `AvailabilityEngine`, `EligibilityEngine`, `EffectivePermissionsEngine`, `SnapshotEngine`, `FinancialEngine`.
- **Ejecución**: `npm run test:unit` en CI/CD pipeline.

## 2. Integration Tests
Validación del flujo transaccional en Base de Datos:
- Cotización -> Contrato -> Pago -> Recibo -> Factura.

## 3. End-to-End Tests (Playwright)
Se mapean exactamente los 14 escenarios descritos en el `BUSINESS_ACCEPTANCE_REPORT.md` simulando el comportamiento real de un agente en Plaza Mayor y Casa de Piedra.