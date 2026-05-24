# PROJECT GLOSSARY

## Authority: TECHNICAL DIRECTOR & PROGRAM GOVERNANCE

- **Zero Trust:** Filosofía donde ninguna petición se asume segura por defecto. Todo acceso debe ser validado por el RBAC y Tenant Isolation.
- **Source Purity:** El principio de mantener el frontend limpio de lógica de negocio, reglas financieras o persistencia de estado simulado (mocks).
- **Provider Abstraction Pattern:** Arquitectura de backend para conectar múltiples proveedores (e.g., DocuSign y Firmas Manuales) mediante interfaces unificadas.
- **Evidence Vault:** Almacenamiento inmutable de eventos críticos (firmas, cambios de contrato, log de auditorías) utilizando Hash Chains para prevenir manipulación (Tamper-evident).
- **Frozen State:** Estado en el cual el código no puede ser alterado bajo ninguna circunstancia hasta obtener aprobación explícita de la Gobernanza (Technical Director, Enterprise Architect, Product Owner).
- **Unreliable (Certification):** Cualquier reporte, prueba o aseveración generada sin respaldo de evidencia demostrable mediante scripts de prueba o análisis de código ejecutable.
