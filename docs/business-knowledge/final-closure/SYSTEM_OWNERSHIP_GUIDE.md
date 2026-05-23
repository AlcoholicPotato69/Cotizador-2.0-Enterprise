# SYSTEM OWNERSHIP GUIDE

## Propiedad Operativa de Componentes

| Dominio | Propietario de Negocio | Rol Técnico Principal | Responsabilidad |
|---------|------------------------|-----------------------|-----------------|
| **Tenant Config / Precios** | Gerencia Comercial | `commercial.manager` | Mantener Tarifas y Reglas actualizadas. |
| **Disponibilidad / Salones** | Gerencia Operaciones | `ops.manager` | Mantener bloqueos, calendarios y aforos. |
| **Contratos / Firmas** | Jurídico | `legal.manage` | Redacción de plantillas legales (`template_builder`). |
| **Ledger Financiero / SPEI** | Finanzas | `finance.manager` | Validación de evidencia, asignación de referencia bancaria y conciliación. |
| **Generación de CFDI** | Finanzas | `invoice.approve` | Aprobación dual, visualización y revisión del XML. |
| **Infraestructura (Backups)** | IT / TAC Admin | `system.admin` | Mantener WORM S3 y auditar *Zero Trust Logs*. |