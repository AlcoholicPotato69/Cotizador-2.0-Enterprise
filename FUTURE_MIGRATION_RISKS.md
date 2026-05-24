# Future Migration Risks

## 1. SQLite Concurrency with Space Occupancy
**Risk:** PocketBase uses SQLite. The `Space Occupancy Domain` requires atomic, high-concurrency checks to prevent overbooking during `PRE_RESERVADO` and `RESERVADO` transitions.
**Migration Impact:** As traffic grows, SQLite write locks may become a bottleneck. Migrating from SQLite to PostgreSQL later will require rewriting all complex concurrency hooks and `dao.RunInTransaction` logic.

## 2. Hardcoded Approvals vs Dynamic Workflows
**Risk:** If the `Approval Engine` is built tightly coupled to PocketBase collections, migrating to a standard BPMN engine (like Camunda) in the future will require a complete rewrite.
**Migration Impact:** High risk. The Approval Engine must be designed with generic APIs so the underlying implementation can be swapped.

## 3. Facturación Snapshot Schema Drift
**Risk:** Facturación depends on `contract_versions.snapshot_data` (JSON). If the shape of this JSON changes over time, the Billing system might fail to parse older snapshots.
**Migration Impact:** We must enforce a schema versioning strategy (`schema_version: "1.0"`) inside the snapshot payload from day one.

## 4. Audit Log Explosion
**Risk:** Using a single `audit_logs` collection for EVERYTHING will result in millions of rows rapidly.
**Migration Impact:** Querying audit logs will degrade system performance. We must plan a migration strategy for cold storage (e.g., S3 archiving) for audit logs older than 90 days.
