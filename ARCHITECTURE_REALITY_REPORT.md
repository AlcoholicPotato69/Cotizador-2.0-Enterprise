# ARCHITECTURE REALITY REPORT
**PROJECT**: Cotizador 2.0 Enterprise
**ROLE**: Enterprise Chief Architect
**DATE**: 2026-05-23
**SCOPE**: Reality check based exclusively on existing source code, migrations, schemas, hooks, and frontend configuration.

---

## 1. Backend
- **EXISTE**: YES
- **ESTADO**: B
- **EVIDENCIA**: Instancia de PocketBase (`pocketbase.exe`) con directorios `pb_migrations`, `pb_hooks`, y `pb_data` poblados. Existen scripts de inicialización y utilería en la raíz y en `development/`.
- **ARCHIVOS**: `backend/pb_migrations/*.js`, `backend/pb_hooks/main.pb.js`, `backend/pb_hooks/quotes.pb.js`, `backend/pb_hooks/contracts.pb.js`.
- **DEPENDENCIAS**: PocketBase Go Engine.
- **RIESGOS**: Lógica de negocio altamente acoplada a hooks de JavaScript de PocketBase (`.pb.js`). Riesgo de escalabilidad al mantener toda la lógica empresarial en un solo entorno de scripting.

## 2. Frontend
- **EXISTE**: YES
- **ESTADO**: A
- **EVIDENCIA**: Aplicación Vue 3 completa en el directorio `frontend/`. Utiliza Vite, TailwindCSS y TypeScript. Dispone de un sistema extenso de vistas, componentes, stores y layouts.
- **ARCHIVOS**: `frontend/package.json`, `frontend/src/views/*`, `frontend/src/stores/*`, `frontend/src/components/*`.
- **DEPENDENCIAS**: Vue 3, Vite, TailwindCSS, TypeScript, PocketBase JS Client.
- **RIESGOS**: Alta complejidad en la interfaz con múltiples constructores (`RuleBuilder.vue`, `PricingBuilder.vue`, `DocReqBuilder.vue`, `RbacBuilder.vue`). Riesgo de fuga de lógica de dominio al frontend (stores y constructores).

## 3. Seguridad
- **EXISTE**: YES
- **ESTADO**: C
- **EVIDENCIA**: Existen stores de frontend para `permissionsStore.ts`, `tenantStore.ts` y vistas como `PermissionDebugger.vue`. Sin embargo, el hook de backend para control de accesos basado en roles está inactivo.
- **ARCHIVOS**: `backend/pb_hooks/rbac.pb.js.disabled`, `frontend/src/stores/permissions.ts`, `frontend/src/stores/tenantStore.ts`.
- **DEPENDENCIAS**: PocketBase Auth, Frontend State Management.
- **RIESGOS**: **Violación de Zero Trust**. El hook `rbac.pb.js.disabled` indica que la validación en backend podría estar desactivada, confiando el acceso a reglas de interfaz o configuraciones débiles, exponiendo datos multi-tenant.

## 4. Contratos
- **EXISTE**: YES
- **ESTADO**: B
- **EVIDENCIA**: Migraciones exhaustivas para `contracts`, `contract_templates`, `contract_versions`, `contract_status_history`. Implementación en backend con hooks específicos para ciclos de vida de contratos. Vistas dedicadas en el frontend.
- **ARCHIVOS**: `backend/pb_migrations/1779509705_created_contracts.js` (y relacionados), `backend/pb_hooks/contracts.pb.js`, `backend/pb_hooks/contract_monitor.pb.js`, `frontend/src/views/ContractsView.vue`.
- **DEPENDENCIAS**: PocketBase DB, Frontend Views.
- **RIESGOS**: Complejidad en la máquina de estados de los contratos gestionada a través de múltiples hooks de base de datos.

## 5. Firmas
- **EXISTE**: YES
- **ESTADO**: B
- **EVIDENCIA**: Existen colecciones en la base de datos para firmas, eventos de firma, participantes y evidencias. Existe un hook y un proveedor configurado para DocuSign.
- **ARCHIVOS**: `backend/pb_hooks/signatures/providers/DocuSignProvider.js`, `backend/pb_hooks/signature_webhooks.pb.js`, `backend/pb_migrations/1779516660_created_contract_signatures.js`.
- **DEPENDENCIAS**: DocuSign API, PocketBase.
- **RIESGOS**: Acoplamiento fuerte al proveedor "DocuSign". Si se requiere un nuevo proveedor, la arquitectura en `pb_hooks/signatures` debe demostrar abstracción real.

## 6. Documentos
- **EXISTE**: YES
- **ESTADO**: C
- **EVIDENCIA**: Colección de base de datos creada, y archivo básico de hook presente, pero carece de un motor visible de hashing, retención o reconciliación en la inspección superficial del código fuente principal.
- **ARCHIVOS**: `backend/pb_migrations/1779429155_created_documents.js`, `backend/pb_hooks/documents.pb.js`.
- **DEPENDENCIAS**: PocketBase Filesystem.
- **RIESGOS**: Gestión del ciclo de vida del documento, expiración y purga de evidencias no es evidente en el código fuente base.

## 7. Facturación
- **EXISTE**: NO
- **ESTADO**: F
- **EVIDENCIA**: Ausencia total de colecciones, hooks o vistas de frontend dedicadas a la facturación (invoicing, billing). Existen menciones exclusivas en documentos markdown y scripts de documentación.
- **ARCHIVOS**: N/A
- **DEPENDENCIAS**: Ninguna.
- **RIESGOS**: Dominio comercial esencial no implementado. Impide cualquier ciclo financiero real.

## 8. Pagos
- **EXISTE**: NO
- **ESTADO**: F
- **EVIDENCIA**: Al igual que facturación, no existen tablas de ledger, pagos o pasarelas de pago. La carpeta `archive/` contiene un script `1710000017_financial_closing.js` pero no hay código activo.
- **ARCHIVOS**: N/A
- **DEPENDENCIAS**: Ninguna.
- **RIESGOS**: Funcionalidad financiera crítica faltante. Brecha entre la documentación (`PAYMENT_EVIDENCE_WORKFLOW.md`) y la realidad del código.

## 9. Notificaciones
- **EXISTE**: YES
- **ESTADO**: C
- **EVIDENCIA**: Existe una colección de base de datos para registrar notificaciones y un store en el frontend para despacharlas/consumirlas, pero carece de motores de integración externa (email/SMS) en los hooks inspeccionados.
- **ARCHIVOS**: `backend/pb_migrations/1779429155_created_notifications.js`, `frontend/src/stores/notificationStore.ts`.
- **DEPENDENCIAS**: Frontend Store, PocketBase DB.
- **RIESGOS**: Sistema de notificaciones aparentemente in-app únicamente. Riesgo de cuellos de botella si el volumen de notificaciones aumenta (polling en lugar de workers asíncronos reales).

## 10. Auditoría
- **EXISTE**: YES
- **ESTADO**: B
- **EVIDENCIA**: Colección de base de datos dedicada a `audit_logs`. Script en la raíz para andamiaje de auditorías.
- **ARCHIVOS**: `backend/pb_migrations/1779495986_created_audit_logs.js`, `scaffold_audits.js`.
- **DEPENDENCIAS**: PocketBase DB.
- **RIESGOS**: Volumen incontrolado. No hay evidencia de estrategias de particionamiento, rotación de logs o purga en frío, lo que afectará el rendimiento a escala Enterprise.
