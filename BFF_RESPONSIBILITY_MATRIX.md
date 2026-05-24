# BFF (Backend for Frontend) RESPONSIBILITY MATRIX

| Responsabilidad | Ubicación Actual (Opción A) | Ubicación Futura (Opción B) | Beneficio |
| :--- | :--- | :--- | :--- |
| **Persistencia (CRUD simple)** | PocketBase (SQLite) | PocketBase (Vía API) | Aislamiento de datos |
| **RBAC / Tenant Isolation** | PocketBase API Rules | BFF Middleware + PB API Rules | Defensa en Profundidad |
| **Snapshot Generation** | PB Goja Hooks | BFF Service | Testabilidad, Fácil acceso a utilidades JSON |
| **Hash Chaining (Audit)** | PB Goja Hooks | BFF Service | Soporte criptográfico maduro (Node Crypto) |
| **State Machines (Aprobaciones)**| PB Goja Hooks | BFF Service | Posibilidad de usar motores de Workflows maduros (XState, BPMN) |
| **Validaciones de Reglas** | PB Goja Hooks / UI | BFF Service | Centralización y Pureza de Código |
| **Integraciones Externas** | No Soportado / Goja | BFF Service | Llamadas REST a Intelisis, DocuSign con SDKs oficiales |
| **Notificaciones (Email/SMS)** | PB Hooks | BFF Queue | Colas robustas asíncronas |
