# Final Domain Sequence

To safely build the system without circular dependencies or regressions, the following sequence MUST be strictly adhered to:

### Phase 1: Foundation (Zero Dependencies)
1. **Audit Domain:** (Must exist before anything else to log their creation).
2. **Tenant Domain:** (Required for partitioning).
3. **Identity & RBAC Domain:** (Required for access control).
4. **Settings Domain:** (Provides configuration for all subsequent domains).

### Phase 2: Core Entities (Depends on Phase 1)
5. **Client Domain:** (Includes Compliance/Blacklist).
6. **Space Domain:** (Physical definition).
7. **Document Domain:** (Independent vault).

### Phase 3: Commercial Engines (Depends on Phase 2)
8. **Quotes Domain.**
9. **Approval Engine:** (Generic engine, hooked into Quotes).

### Phase 4: Execution & Occupancy (Depends on Phase 3)
10. **Contract Domain:** (Generates the Aggregate).
11. **Snapshot / Versioning Engine:** (Freezes Contract + Client + Space data).
12. **Space Occupancy Domain:** (Reacts to Contract signatures).
13. **Signature Engine:** (Executes DAG workflows for signing).

### Phase 5: Financials & Operations (Depends on Phase 4)
14. **Billing / Facturación:** (Strictly reads ONLY from Snapshot Engine).
15. **Payment Domain:** (Updates Billing status).

### Phase 6: Cross-Cutting (Depends on all)
16. **Notification Domain.**
17. **Reporting Domain.**
