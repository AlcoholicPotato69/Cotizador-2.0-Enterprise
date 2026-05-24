# Enterprise Architecture Review

## Objective
To perform a complete architectural audit of the Cotizador 2.0 Enterprise system to freeze the architecture before building the engines.

## Domain Evaluation

### 1. Settings Domain
**Analysis:** Currently, settings are implicitly scattered or grouped under a monolithic `Tenants` domain. A dedicated `Settings Domain` is required to handle `tenant_settings`, `billing_settings`, `contract_settings`, `space_settings`, and `notification_settings`.
**Justification:** Decentralized settings lead to schema drift and tight coupling. A centralized, tenant-aware settings domain ensures configuration is strictly managed and versioned.

### 2. Approval Engine
**Analysis:** The approval workflow for quotes, contracts, and cancellations is currently implicit or missing from the core domains. It needs an explicit `Approval Engine` (`approval_requests`, `approval_steps`, `decisions`, `templates`).
**Justification:** Hardcoding approval logic into `Quotes` or `Contracts` violates Single Responsibility Principle. A generic Approval Engine allows multi-stage, sequential, or parallel approvals independently.

### 3. Document Domain
**Analysis:** Must be an independent domain. Currently mentioned as "Documents".
**Justification:** Documents must be immutable, heavily audited, and access-controlled (RBAC/Zero Trust). Embedding documents into entities (like `contracts`) breaks isolation and complicates storage strategies (e.g., S3 offloading, hash chain verification).

### 4. Space Occupancy Domain
**Analysis:** The system must separate the physical space, the commercial contract, and the actual occupancy state (`space_occupancy`, `history`).
**Justification:** Space availability is a temporal state. Coupling it directly to contracts causes race conditions. An independent domain handles the `DISPONIBLE -> PRE_RESERVADO -> RESERVADO -> CONTRATADO -> BLOQUEADO -> MANTENIMIENTO -> LIBERADO` state machine properly.

### 5. Reporting Domain
**Analysis:** Requires strict read-only access (CQRS pattern) or event-driven materialization.
**Justification:** Reporting must not block operational databases. It should consume from `Audit` or domain events.

### 6. Notification Domain
**Analysis:** Requires templates, routing, and delivery tracking.
**Justification:** Essential for asynchronous communication without blocking core transactions.

### 7. Audit Domain
**Analysis:** Is `audit_logs` sufficient? No.
**Justification:** A single `audit_logs` collection is a bottleneck and lacks structured payload definition for complex domains. Audit must support hash chains, tamper evidence, and structured differential logs (Before/After JSON), perhaps segregated by domain.

## Flow Validations
- **Espacios:** The 7-step state machine requires an event-driven transition matrix.
- **Clientes:** Needs `BLACKLIST` and `ARCHIVADO` for GDPR/Compliance.
- **Cotizaciones & Contratos:** State machines are standard but require transition guards (Approval Engine).
- **Firmas:** Needs a complex state machine for delegation and parallel signing.
- **Facturación:** Must ONLY read `contract_versions.snapshot_data`. Currently, this implies a missing `contract_versions` strategy.
- **Pagos:** Requires manual audit tracking.
