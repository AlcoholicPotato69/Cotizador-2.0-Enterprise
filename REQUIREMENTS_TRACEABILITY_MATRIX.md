# Requirements Traceability Matrix (RTM)

**Role:** Product Owner
**Project:** Cotizador 2.0 Enterprise
**Phase:** 4 - Business Rule & Requirements Validation

Esta matriz vincula las reglas operativas críticas de la empresa ("Plaza Mayor" y "Casa de Piedra") con los Test Cases técnicos definidos por el equipo de QA.

| ID Regla de Negocio (BR) | Descripción Operativa | Prioridad (MoSCoW) | Test Case Técnico Vinculado | Estado de Cobertura |
| :--- | :--- | :--- | :--- | :--- |
| **BR-SEC-001** | Segregación Absoluta de Marcas: Ningún empleado de Plaza Mayor podrá ver ni editar información operativa (clientes, contratos, espacios) de Casa de Piedra y viceversa. | MUST | `TC-TENANT-001`, `TC-TENANT-002` | **CUBIERTO** |
| **BR-SEC-002** | Control de Roles Comerciales: Solo el personal con el perfil adecuado podrá acceder a las opciones de cotización, edición y lectura según los dominios de la empresa. | MUST | `TC-RBAC-001`, `TC-API-001`, `TC-API-002` | **CUBIERTO** |
| **BR-SEC-003** | Propagación de Permisos en Tiempo Real: Si un empleado cambia de puesto o permisos, sus accesos a los sistemas deben actualizarse inmediatamente. | MUST | `TC-RBAC-002` | **CUBIERTO** |
| **BR-SEC-004** | Fail-Safe Authentication & Accesos Reales: El sistema no debe permitir acceso a herramientas ni visualización de datos usando cuentas falsas o saltándose el flujo real de validación del backend. | MUST | `TC-FRONT-001` | **CUBIERTO** |
| **BR-SEC-005** | Fallo Seguro de Creación de Accesos: Si falla la configuración técnica de permisos para un empleado de nueva creación, la cuenta no debe activarse. | MUST | `TC-RBAC-003` | **CUBIERTO** |
| **BR-BIZ-001** | Validación de Descuentos Comerciales: La aplicación de descuentos sobre las cotizaciones base requiere evaluación de límites y/o aprobación gerencial. | MUST | *N/A* | **BRECHA (GAP)** |
| **BR-BIZ-002** | Estados y Ciclo de Vida del Contrato: Las reservas de espacio y los contratos deben transitar por un ciclo de vida estricto y auditable (Draft, Signed, Executed). | MUST | *N/A* | **BRECHA (GAP)** |
| **BR-BIZ-003** | Integridad Documental: Todo documento legal generado y firmado no puede ser alterado ni modificado sin dejar rastro de auditoría. | MUST | *N/A* | **BRECHA (GAP)** |

*Nota del Product Owner:* Los requisitos de seguridad e infraestructura base (Multi-tenant y RBAC - BR-SEC) están completamente mapeados y trazados por QA. Se requiere una actualización de los casos de prueba para cubrir los requisitos operativos comerciales (BR-BIZ) antes del lanzamiento final.
