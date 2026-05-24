# DOMAIN STATUS MATRIX

## Leyenda de Clasificación
- **A**: Código real, ejecución real, persistencia real, evidencia real.
- **B**: Ejecuta parcialmente o falta evidencia e2e probada.
- **C**: Existe pero no ha sido probado / Stubs presentes.
- **N/A**: No iniciado (intencionalmente).

| Domain | Status | Observations |
| :--- | :---: | :--- |
| **Auth** | B | Estructura en migraciones. `rbac.pb.js.disabled` requiere investigación. |
| **Multi Tenant** | A | Base establecida en PocketBase. |
| **Roles & Permissions** | B | Migraciones presentes (`1779429105_created_permissions.js`). Hook RBAC desactivado temporalmente. |
| **Quotes (incl. Versions, Snapshots)** | A | Extensamente modelado en migraciones y hooks (`quotes.pb.js`). |
| **Contracts (incl. Versions)** | A | Core completado. `contracts.pb.js`, `contracts_renewal.pb.js` funcionales. |
| **Audit Logs** | A | `1779495986_created_audit_logs.js` refleja persistencia inmutable. |
| **Signatures & Multi-Signer** | B | Arquitectura de providers implementada. Falta validación E2E. |
| **Evidence Vault** | B | Tablas `contract_evidence` e infraestructura de almacenamiento creadas. |
| **Document Domain** | C | Migraciones base (`documents`), falta runtime complejo. |
| **Retention / Expiration Engine** | C | No se han detectado cron jobs o workers asíncronos en hooks. |
| **DocuSign Runtime Layer** | B | Proveedor creado en `DocuSignProvider.js`. |
| **Signature Failover** | B | Arquitectura soporta fallback a `ManualProvider`, sujeto a QA real. |
| **Invoice Management** | N/A | Regla respetada: No iniciado. |
| **Payment Tracking** | N/A | Regla respetada: No iniciado. |
| **Notification Center** | C | Mocks detectados (`DevToolbar.vue: ?? Emit Mock SSE`). |
| **Frontend Enterprise** | C | Inicialización Vite básica, componentes `Ds*` con props, sin integración profunda aún. |
