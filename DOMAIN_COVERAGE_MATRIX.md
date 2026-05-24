# DOMAIN COVERAGE MATRIX
**PROJECT**: Cotizador 2.0 Enterprise

| DOMAIN | EXISTE | ESTADO | ARCHIVOS / DIRECTORIOS REPRESENTATIVOS | DEPENDENCIAS | RIESGOS PRINCIPALES |
|---|---|---|---|---|---|
| **Backend** | YES | B | `backend/pb_migrations/*.js`<br>`backend/pb_hooks/*.pb.js`<br>`pocketbase.exe` | PocketBase | Acoplamiento a `.pb.js`, lógica concentrada en capa DB. |
| **Frontend** | YES | A | `frontend/src/views/`<br>`frontend/src/stores/`<br>`frontend/src/components/` | Vue 3, Vite, Tailwind, PB Client | Lógica de negocio (builders/rules) acoplada a UI. |
| **Seguridad** | YES | C | `backend/pb_hooks/rbac.pb.js.disabled`<br>`frontend/src/stores/tenantStore.ts` | PB Auth | **Zero Trust Violation**: Hook de backend inactivo (`.disabled`). |
| **Contratos** | YES | B | `pb_migrations/*contracts*.js`<br>`pb_hooks/contracts.pb.js`<br>`Views/ContractsView.vue` | PB DB, Vue | Complejidad de la máquina de estados en hooks JS. |
| **Firmas** | YES | B | `pb_hooks/signatures/providers/DocuSignProvider.js`<br>`pb_hooks/signature_webhooks.pb.js` | DocuSign API | Acoplamiento fuerte al proveedor DocuSign. |
| **Documentos** | YES | C | `1779429155_created_documents.js`<br>`documents.pb.js` | PB Filesystem | Carencia de ciclos de vida, hashing y reconciliación visible. |
| **Facturación** | NO | F | N/A | Ninguna | Dominio core inexistente en código fuente (solo documentado). |
| **Pagos** | NO | F | N/A | Ninguna | Motor de reconciliación y pasarelas de pago no implementados. |
| **Notificaciones** | YES | C | `1779429155_created_notifications.js`<br>`stores/notificationStore.ts` | Vue Store, PB DB | Sin integración de canales externos (email, SMS). Polling/In-app. |
| **Auditoría** | YES | B | `1779495986_created_audit_logs.js`<br>`scaffold_audits.js` | PB DB | Riesgo de escalabilidad de datos sin política de retención o rotación. |
