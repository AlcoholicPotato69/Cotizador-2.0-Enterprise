# KNOWN ISSUES REGISTER (TECHNICAL DEBT)
> Documento de honestidad absoluta derivado del Implementation Conformance Audit.

| Gravedad | Módulo / Área | Problema Encontrado | Impacto en Producción | Acción Correctiva Requerida |
| :---: | :--- | :--- | :--- | :--- |
| **HIGH** | Client Module (Frontend) | Las vistas están estáticas. Falta conexión CRUD bidireccional contra el SDK de PocketBase en `ClientFormView.vue`. | Interfaz inutilizable para captura de datos reales. | Implementar adaptadores DTO y llamadas HTTP nativas en la Fase 4.3.6. |
| **HIGH** | Backend Hooks | Inexistencia del motor de **Legal Hold** (Inmutabilidad Documental) documentado en arquitectura. | Un administrador podría borrar un contrato firmado evadiendo la pista de auditoría. | Crear interceptor específico en JS para `onRecordDeleteRequest` en `document_registry`. |
| **HIGH** | Backend Hooks | Lógica financiera (Double Entry Ledger) no existe en el motor JS. | Descuadres financieros no detectados en transacciones manuales. | Construir `financial.pb.js` antes de la fase de Pagos. |
| **MEDIUM** | Mocks (Frontend) | Usuarios hardcodeados/Mock en `DevToolbar`. | Autenticación real de PB omitida temporalmente en modo dev local. | Enlazar el AuthStore directamente a la API de PocketBase real. |
| **MEDIUM** | Typescript / Vite | Restos de configuraciones huérfanas en migraciones PB. | Las migraciones antiguas con `Dao()` provocaban crasheos. Fueron archivadas temporalmente. | Las bases de datos en blanco requerirán que las migraciones antiguas sean reescritas al estándar v0.23 o consolidadas en el esquema json base. |
| **LOW** | Client Detail (Timeline) | Pestaña de actividad no alimentada por el Audit Trail real de PocketBase. | Información vacía en panel. | Cablear a la tabla `audit_logs`. |
