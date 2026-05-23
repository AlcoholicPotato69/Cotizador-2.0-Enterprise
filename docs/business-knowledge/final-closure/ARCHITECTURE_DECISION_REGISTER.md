# ARCHITECTURE DECISION REGISTER (ADR)

## 1. Selección de Playwright sobre PDFKit
- **Por qué**: PDFKit requería coordenadas (X, Y) destruyendo el Template Builder HTML/CSS. Playwright captura el DOM idéntico garantizando aislamiento Multi-Tenant y fidelidad 100%.
## 2. Congelamiento de Pasarelas de Pago (Stripe)
- **Por qué**: La operación real del negocio utiliza transferencias (SPEI) controladas mediante Referencias Bancarias estáticas. Implementar Stripe o Webhooks agregaba complejidad ficticia sobre un modelo de negocio inexistente.
## 3. Arquitectura Snapshot-Driven
- **Por qué**: Si el precio de un salón cambia hoy, los contratos firmados ayer no deben cambiar. Guardar el Snapshot en JSON congeló la verdad histórica.
## 4. Backend Enforcement vs Frontend Validation
- **Por qué**: El Frontend puede ser manipulado. Zero-Trust exige que PocketBase (API Rules y Hooks) sea el único juez matemático.
## 5. CFDI Workflow Manual sobre Automatización
- **Por qué**: Cerrar el flujo contable humano evita timbrar facturas duplicadas o erróneas en un entorno sin integración ERP oficial validada.