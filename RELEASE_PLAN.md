# RELEASE PLAN

## Authority: TECHNICAL DIRECTOR
## Project: Cotizador 2.0 Enterprise

---

El plan de liberación define cómo se desplegarán las funcionalidades hacia los entornos productivos. Todos los *Releases* están sujetos a la aprobación final basada en la **Certificación QA**.

### RELEASE 1.0: Core Foundation & Security (BLOCKED 🔴)
**Objetivo:** Establecer la base segura, gestión de cotizaciones y contratos con Zero Trust y Multi-Tenant funcional.
**Requisitos Previos de Aprobación:**
- `QA_REPORT.md` (PASSED)
- `SECURITY_REPORT.md` (PASSED)
- `GO_NO_GO_REPORT.md` (GO)

**Entregables:**
- Auth, Roles y Permisos (RBAC Activo).
- Gestión de Cotizaciones (Quotes & Versions).
- Gestión de Contratos (Contracts).
- Base del Frontend SPA funcional y sin mocks.
- Audit Logs operativos e inmutables.

---

### RELEASE 1.1: Compliance & Signatures
**Objetivo:** Operaciones legales y de firma vinculante.
**Requisitos Previos de Aprobación:** Release 1.0 desplegado y estable. Aprobación de Arquitectura.

**Entregables:**
- Flujos de firmas (Multi-Signer).
- Integración real con proveedores (DocuSign/Manual).
- Evidence Vault (Bóveda de evidencias) funcional y verificada.
- Motores de Expiración y Retención.

---

### RELEASE 2.0: Financial Integrations
**Objetivo:** Monetización y facturación.
**Requisitos Previos de Aprobación:** Aprobación explícita del *Product Owner* para reglas de negocio financieras. Release 1.1 operativo.

**Entregables:**
- Invoice Management.
- Payment Tracking.

---

### RELEASE 2.1: Scale & Enterprise Reporting
**Objetivo:** Optimización y visibilidad empresarial para Plaza Mayor y Casa de Piedra.
**Requisitos Previos de Aprobación:** Reporte exitoso de Load Testing.

**Entregables:**
- Tableros de Inteligencia de Negocio.
- Exportaciones financieras consolidadas.
