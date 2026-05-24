# RBAC Matrix & Access Control Model

## 1. System Roles
The application uses a Role-Based Access Control (RBAC) strategy tightly coupled with strictly enforced Tenant Isolation (`tenant_id`). The roles are hierarchical within a tenant.

| Role | Scope | Description |
|---|---|---|
| **SYSTEM_ADMIN** | Cross-Tenant | Infrastructure management, Feature Flags, Database Migrations. No access to tenant payload data unless explicitly approved by Tenant Admin (via break-glass). |
| **TENANT_ADMIN** | Tenant (`tenant_id`) | Total control over the Tenant's configurations, Users, Roles, Settings. |
| **SALES_MANAGER** | Tenant (`tenant_id`) | Manages CRM aspects: Clients, Quotes, Contracts. Can issue approval requests. |
| **OPERATIONS_MANAGER** | Tenant (`tenant_id`) | Manages Inventory and Operations: Spaces, Occupancy, Work Orders. |
| **FINANCE_MANAGER** | Tenant (`tenant_id`) | Manages Financials: Invoices, Payments, Credit Notes. |
| **AUDITOR** | Tenant (`tenant_id`) | Read-only access to Audit Logs, Hash Chains, Document Trails, Financials. |
| **BASIC_USER** | Tenant (`tenant_id`) | Default role. Can only read specific resources or perform tasks explicitly assigned to them. |

## 2. Resource Permissions Matrix

`C` = Create | `R` = Read | `U` = Update | `D` = Soft Delete | `A` = Approve / Special Action

| Resource | SYSTEM_ADMIN | TENANT_ADMIN | SALES_MANAGER | OPERATIONS_MANAGER | FINANCE_MANAGER | AUDITOR |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Tenant** | C,R,U,D | R,U | R | R | R | R |
| **User/Role** | - | C,R,U,D | R | R | R | R |
| **Settings** | R | C,R,U | R | R | R | R |
| **Client** | - | C,R,U,D | C,R,U,D | R | R | R |
| **Space** | - | C,R,U,D | R | C,R,U,D | R | R |
| **Occupancy** | - | C,R,U,D | R, U* | C,R,U,D | R | R |
| **Quote** | - | C,R,U,D,A | C,R,U | R | R | R |
| **Contract** | - | C,R,U,D,A | C,R,U | R | R | R |
| **Invoice** | - | C,R,U,D | R | R | C,R,U,A | R |
| **Payment** | - | C,R,U,D | R | R | C,R,U,A | R |
| **Document** | - | R,D | C,R,U | C,R,U | C,R,U | R |
| **Snapshot** | - | R | R | R | R | R |
| **AuditLog** | - | R | R | R | R | R |

*(Sales Manager can update occupancy via Quote creation/reservation logic only, not direct direct write)*

## 3. Advanced Contextual Permissions

- **Owner-Based Control:** Basic Users can only UPDATE or DELETE resources where their `user_id` is stamped as `created_by` or `owner_id`.
- **Soft Delete Restriction:** `D` permission translates to setting `deletedAt`. Only `SYSTEM_ADMIN` or automated retention cron jobs can execute Hard Deletes (`DELETE FROM ...`), and only after retention periods expire.
- **Approval Workflows:** `A` actions (e.g., Approving a heavily discounted Quote or Voiding an Invoice) require explicit multi-step `Approvals` domain intervention if thresholds are crossed (e.g. Sales Manager needs Tenant Admin approval for discounts > 20%).
