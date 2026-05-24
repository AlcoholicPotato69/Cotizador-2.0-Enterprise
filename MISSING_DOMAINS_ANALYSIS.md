# Missing Domains Analysis

## 1. Snapshot / Versioning Domain
**Missing:** The directive states that Facturación must ONLY read `contract_versions.snapshot_data`. Currently, `contract_versions` is not explicitly defined as a top-level architectural concept.
**Impact:** Without this, Billing will be forced to join Clientes, Quotes, and Spaces, violating the directive.
**Solution:** Create a `Versioning Engine` that automatically generates frozen JSON snapshots of the entire aggregate (Contract + Client + Space + Pricing) upon contract signature.

## 2. State Machine / Workflow Domain
**Missing:** Complex flows (Spaces, Quotes, Contracts, Signatures) are defined, but there is no centralized engine to enforce allowed transitions.
**Impact:** State transition logic will be scattered across PocketBase hooks, leading to inconsistent states and bypassed rules.
**Solution:** A dedicated `State Machine Engine` or explicit matrix configuration within the `Settings Domain` to guard all status changes.

## 3. Blacklist & Compliance Domain
**Missing:** Clients have states `LEAD->PROSPECTO->CLIENTE->INACTIVO`. But enterprise systems require `BLACKLIST` and `ARCHIVADO` for AML (Anti-Money Laundering) and GDPR.
**Impact:** Legal compliance failure.
**Solution:** Introduce a `Compliance Domain` to handle background checks, blacklists, and data retention/archival policies.

## 4. Contract Renewal Engine
**Missing:** Renewals (`exact_clone`, `administrative`, `legal_renewal`, `commercial`) require complex logic to duplicate and link aggregates.
**Impact:** Manual renewals will cause data lineage loss.
**Solution:** Explicit `Renewal Engine` that manages the lineage (`parent_contract_id`, `renewal_type`).
