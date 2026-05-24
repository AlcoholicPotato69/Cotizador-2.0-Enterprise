# Legal Hold Policy

## Overview
A Legal Hold suspends normal retention and deletion policies for data relevant to legal proceedings, investigations, or audits.

## Activation
- **Authorized Roles**: Only `System Admin`, `Tenant Admin` (with legal privileges), or `Auditor` can activate a Legal Hold.
- **Scope**: Can be applied at the Tenant, User, or specific Document level.

## Mechanism
1. **Flagging**: The record or tenant is flagged with `legal_hold: true`.
2. **Locking**: The Retention Engine skips any record with this flag.
3. **Immutability**: Even authorized users cannot delete or modify records under Legal Hold. The system enforces soft-delete at most, but the data remains physically intact and accessible to Auditors.

## Deactivation
- A Legal Hold can only be removed by a documented and audited API call from an authorized Legal/Auditor role.
- Upon deactivation, standard retention policies resume immediately.
