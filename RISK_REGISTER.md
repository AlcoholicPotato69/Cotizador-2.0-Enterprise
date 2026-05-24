# RISK REGISTER

## Authority: TECHNICAL DIRECTOR & PROGRAM GOVERNANCE

| ID | Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|---|
| RSK-001 | Falso positivo en arquitectura (documentos no reflejan código) | Alto | Muy Alta | Enterprise Architect debe generar un mapa real leyendo el código fuente antes de autorizar diseños. |
| RSK-002 | Funcionalidades de negocio implementadas sin control (Mocks/Hardcoding) | Alto | Alta | QA debe rechazar todo sin pruebas. Congelar el código asegura que no se propague. |
| RSK-003 | Seguridad Comprometida (RBAC desactivado, fugas de Tenant) | Crítico | Alta | Security Architect no puede basarse en `SECURITY_MODEL.md`, debe leer migraciones y hooks reales de PocketBase. |
