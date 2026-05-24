# Architecture Gaps

1. **Space State Machine Completeness:**
   - The flow `DISPONIBLE -> PRE_RESERVADO -> RESERVADO -> CONTRATADO -> BLOQUEADO -> MANTENIMIENTO -> LIBERADO` lacks definition of the **triggers**. What triggers `BLOQUEADO` vs `PRE_RESERVADO`? There is a gap in defining the actor and timeout for each state (e.g., `PRE_RESERVADO` expires in 24h).

2. **Client State Gap:**
   - Missing `BLACKLIST` and `ARCHIVADO`. The current state machine is incomplete for enterprise B2B compliance.

3. **Signature Flow Complexity:**
   - The architecture mentions `Signatures` but the requirement demands `single, sequential, parallel, partial, rejected, expired, delegated`. This requires a Directed Acyclic Graph (DAG) executor, which is completely missing from the current `Signatures` domain proposal.

4. **Audit Immutability Proof:**
   - "Audit Everything" is a principle, but there is no mechanism designed for **Cryptographic Tamper Evidence** (Hash chaining). If an admin modifies `audit_logs` in SQLite directly, the system won't know.

5. **Billing Isolation Enforcement:**
   - The directive strictly forbids Billing from reading Client/Quote/Space tables. However, no mechanism exists to guarantee this at the database level in SQLite. PocketBase does not support schema-level user isolation. This relies entirely on application-level discipline, which is a massive architectural gap.
