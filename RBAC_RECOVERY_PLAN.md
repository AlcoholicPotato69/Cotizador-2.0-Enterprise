# RBAC & Governance Recovery Plan

**Project:** Cotizador 2.0 Enterprise
**Target Audience:** Backend Engineers, System Administrators
**Objective:** Restore the Zero Trust Architecture, reactivate Role-Based Access Control (RBAC), and reinstate Multi-Tenant data isolation.

## 1. Phase 1: Schema & Data Foundation Recovery (Unarchiving)
The following migrations must be moved from `backend/pb_migrations/archive/` to the active `backend/pb_migrations/` directory. **Timestamp sequencing must be preserved** to ensure PocketBase applies them in the correct hierarchical order before the existing operational collections (e.g., Contracts, Quotes).

**Action Items:**
1. **Restore Tenants:** Move `1700000000_init_v2.js` to active migrations. This re-establishes the `tenants` collection required for data isolation.
2. **Restore Roles & RBAC:** Move `1710000002_users_rbac.js` to active migrations. This creates the `roles` collection and updates the `users` schema with `roles`, `direct_permissions`, and `effective_permissions`.
3. **Restore Clients:** Move `1710000003_clientes_schema.js` to active migrations.
4. **Restore Inventory:** Move `1710000004_espacios_schema.js` to active migrations.
5. **Reapply Migrations:** Run `./pocketbase migrate up` to enforce these schemas against the SQLite database.

## 2. Phase 2: Security Engine Reactivation (Hooks)
The procedural logic that calculates permissions and enforces auditing must be brought back online.

**Action Items:**
1. **Enable RBAC Hook:** Rename `backend/pb_hooks/rbac.pb.js.disabled` to `backend/pb_hooks/rbac.pb.js`.
2. **Validate Execution:** Ensure that `onRecordCreateRequest` and `onRecordUpdateRequest` for the `users` collection successfully calculate `effective_permissions` without throwing Goja runtime errors.
3. **Validate Cascades:** Ensure that `onRecordUpdate` on the `roles` collection properly loops through associated users and triggers a re-save to propagate permission changes.

## 3. Phase 3: Zero Trust Policy Enforcement (API Rules)
With the schemas and logic restored, backend API rules must be strictly configured to evaluate the newly computed `effective_permissions`.

**Action Items:**
1. **Audit Collection Rules:** Review every collection's `listRule`, `viewRule`, `createRule`, `updateRule`, and `deleteRule`.
2. **Enforce Tenant Isolation:** Ensure all read/write operations require matching `tenant_id` scopes (e.g., `@request.auth.allowed_tenants ?~ tenant`).
3. **Enforce Permission Checks:** Ensure action-specific operations check for exact permissions (e.g., `updateRule: "@request.auth.effective_permissions ?~ 'contracts.update'"`).

## 4. Phase 4: Frontend Security Realignment
The frontend must be purged of insecure mock implementations and realigned with the revived PocketBase security model.

**Action Items:**
1. **Eradicate Mocks:** Delete `DevAuthProvider.ts`. 
2. **Implement Authentic Identity:** Route all login requests through PocketBase's `/api/collections/users/auth-with-password`.
3. **Dynamic UI Rendering:** Update the frontend authorization store to read `pb.authStore.model.effective_permissions`. UI components, menus, and buttons must only render if the authenticated user holds the required string in their `effective_permissions` array.

## 5. Mandatory Acceptance Criteria
- [ ] `roles`, `tenants`, `clientes`, and `espacios` exist in the active database.
- [ ] Creating a user and assigning a role results in a populated `effective_permissions` JSON array on the user record.
- [ ] Modifying a role's permissions automatically cascades and updates the `effective_permissions` of all users holding that role.
- [ ] The frontend cannot authenticate via "superadmin" mock string and requires a valid database user.
- [ ] All API requests originating from the frontend include a valid JWT that respects Multi-Tenant and RBAC boundaries.
