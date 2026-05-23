# FINANCIAL VALIDATION WORKFLOW (Fase 2.6)

## 1. Flujo de Aprobación Zero-Trust
1. **Carga**: Cliente/Comercial sube la Evidencia.
2. **Cola de Revisión**: El documento ingresa al Dashboard de Finanzas bajo estado `pending_validation`.
3. **Conciliación Humana**: Finanzas visualiza la evidencia en el TAC y la coteja visualmente contra su estado de cuenta bancario externo.
4. **Decisión**: 
   - **Rechazo**: Se marca como `rejected`, requiriendo que Comercial contacte al cliente. El Ledger no se toca.
   - **Aprobación**: Finanzas marca la evidencia como `approved`.