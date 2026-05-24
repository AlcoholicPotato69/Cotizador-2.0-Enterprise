# Domain Dependency Graph

## Overview
This document maps the dependencies between domains, detecting hidden or circular dependencies.

## Dependency Matrix

```mermaid
graph TD
    %% Core Domains
    Identity[Identity Domain] --> RBAC[RBAC Domain]
    Tenant[Tenant Domain] --> Settings[Settings Domain]
    
    %% Entity Domains
    Client[Client Domain] --> Tenant
    Space[Space Domain] --> Tenant
    
    %% Operational Domains
    Quote[Quote Domain] --> Client
    Quote --> Space
    Quote --> Settings
    
    Contract[Contract Domain] --> Quote
    Contract --> Client
    Contract --> Settings
    
    %% Cross-Cutting Domains (The Danger Zones for Circular Dependencies)
    Approval[Approval Engine] --> Quote
    Approval --> Contract
    %% Issue: Quote needs Approval to transition state, Approval needs Quote context.
    %% Resolution: Approval Engine must be generic and operate on Polymorphic IDs or webhooks.
    
    Occupancy[Space Occupancy Domain] --> Space
    Occupancy --> Contract
    %% Issue: Contract creation blocks space, space release updates contract.
    %% Resolution: Event-driven choreography instead of synchronous calls.
    
    Billing[Billing / Facturación] --> ContractVersion[Contract Versions]
    %% STRICT ISOLATION: Billing MUST NOT access Quote, Space, or Client directly.
    
    Payment[Payment Domain] --> Billing
    
    Signature[Signature Engine] --> Contract
    Signature --> Document[Document Domain]
    
    Notification[Notification Domain] -.-> AllDomains[All Operational Domains]
    Audit[Audit Domain] -.-> AllDomains
```

## Critical Findings
1. **Facturación Isolation:** The strict rule that Billing must only read `contract_versions.snapshot_data` breaks standard relational design, enforcing an Event-Sourced or Snapshot-based architectural dependency. This prevents circular references but requires a robust Snapshot Engine.
2. **Space Occupancy vs Contract:** A direct foreign key creates a tight coupling. We must use domain events (`ContractSigned` -> `UpdateOccupancy`).
3. **Approval Engine:** Must not have hard foreign keys to `quotes` or `contracts`. It must use generic `entity_type` and `entity_id` to avoid bidirectional coupling.
