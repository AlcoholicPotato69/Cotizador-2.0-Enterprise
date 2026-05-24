# Evidence Vault: Strict Security Test Cases

**Project:** Cotizador 2.0 Enterprise
**Phase:** Fase 3 - QA & Testing Infrastructure
**Objective:** Definitive test cases that dictate the success criteria for the backend engineering team. If these tests do not pass, the RBAC and Tenant implementation is considered **FAILED**.

## 1. Multi-Tenant Isolation Tests (Zero Trust)

### TC-TENANT-001: Strict Data Segregation (Read)
*   **Pre-conditions:** 
    * Tenant A (Plaza Mayor) and Tenant B (Casa de Piedra) exist.
    * User A belongs to Tenant A; User B belongs to Tenant B.
    * `clientes` and `espacios` exist for both Tenant A and B.
*   **Action:** User A requests `GET /api/collections/clientes/records`.
*   **Expected Result:** 
    * HTTP 200 OK.
    * The response array contains **only** records where `tenant_id === Tenant A`.
    * Zero records from Tenant B are returned.

### TC-TENANT-002: Cross-Tenant Mutation Prevention (Write/Update/Delete)
*   **Pre-conditions:** User A belongs to Tenant A. Contract B belongs to Tenant B.
*   **Action:** User A attempts to `PATCH /api/collections/contracts/records/{Contract_B_ID}`.
*   **Expected Result:** 
    * HTTP 404 Not Found (Preferred for security to prevent ID enumeration) OR HTTP 403 Forbidden.
    * Contract B remains unchanged in the database.

## 2. RBAC & Hook Execution Tests

### TC-RBAC-001: Hook - Automatic Permission Calculation on User Creation
*   **Pre-conditions:** Role "Ventas" exists with permissions `["contracts.create", "clientes.read"]`.
*   **Action:** Admin creates User C and assigns the "Ventas" role.
*   **Expected Result:** 
    * User C is created successfully.
    * The `rbac.pb.js` hook successfully populated User C's `effective_permissions` array with `["contracts.create", "clientes.read"]`.

### TC-RBAC-002: Hook - Permission Cascade on Role Update
*   **Pre-conditions:** User C has role "Ventas".
*   **Action:** Admin updates the "Ventas" role, adding `"contracts.update"` to its permissions.
*   **Expected Result:** 
    * The role updates successfully.
    * The `rbac.pb.js` hook cascades the update to all affected users.
    * Querying User C shows `effective_permissions` now contains `["contracts.create", "clientes.read", "contracts.update"]`.

### TC-RBAC-003: Graceful Failure on Hook Error
*   **Pre-conditions:** The `rbac.pb.js` script contains a syntax error or runtime failure.
*   **Action:** Admin attempts to create a user.
*   **Expected Result:** 
    * The user creation transaction is **aborted**.
    * HTTP 400/500 error is returned to the client.
    * The database is not polluted with users lacking `effective_permissions`.

## 3. API Rule Enforcement Tests

### TC-API-001: Exact Privilege Enforcement (Positive)
*   **Pre-conditions:** User D has `effective_permissions` containing `"espacios.read"`.
*   **Action:** User D requests `GET /api/collections/espacios/records/{ID}`.
*   **Expected Result:** HTTP 200 OK. The record is returned.

### TC-API-002: Exact Privilege Enforcement (Negative)
*   **Pre-conditions:** User D lacks `"espacios.update"` in `effective_permissions`.
*   **Action:** User D requests `PATCH /api/collections/espacios/records/{ID}`.
*   **Expected Result:** HTTP 403 Forbidden. The database record is untouched.

## 4. Frontend Security Reality Check

### TC-FRONT-001: Mocks Forbidden
*   **Pre-conditions:** The frontend is configured for the test environment.
*   **Action:** Attempt to access a protected route using a mocked user object (e.g., `superadmin` without a valid JWT).
*   **Expected Result:** 
    * The frontend router rejects the navigation.
    * User is redirected to `/login`.
    * All API calls lacking a genuine PocketBase JWT receive HTTP 401 Unauthorized.

## 5. Acceptance Criteria for Next Phase
The backend engineering team may NOT proceed to Phase 4 (Integration) until all test cases listed above are implemented in the test runner, executed against the recovered database schemas, and report **100% PASS**.
