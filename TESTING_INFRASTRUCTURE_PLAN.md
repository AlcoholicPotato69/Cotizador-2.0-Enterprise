# Testing Infrastructure Plan (TDD Foundation)

**Project:** Cotizador 2.0 Enterprise
**Phase:** Fase 3 - QA & Testing Infrastructure
**Objective:** Define the tools, environments, and workflows required to rigorously test PocketBase hooks, API rules, and the Zero Trust / Multi-Tenant architecture.

## 1. Testing Stack

### 1.1 API & Integration Testing (Core Validation)
To test PocketBase API rules and JS hooks (e.g., `rbac.pb.js`), we will use a programmatic approach utilizing the PocketBase JS SDK.
*   **Test Runner:** **Vitest** (or Jest). Provides fast execution, Watch mode, and seamless TypeScript support for writing robust tests.
*   **API Client:** **PocketBase JS SDK**. Used within Vitest to authenticate as different users (Tenants, Roles) and assert API responses.
*   **Assertion Library:** Built-in Vitest assertions to validate status codes, error messages (e.g., 403 Forbidden, 404 Not Found), and returned JSON payloads.

### 1.2 CI/CD Automated Testing
*   **Tool:** **Newman** (Postman CLI) for running predefined API health, security checks, and collection validations during the CI pipeline.
*   **Load Testing:** **k6** to ensure the RBAC hook (`rbac.pb.js`) and complex API rules do not introduce unacceptable latency under concurrent load.

## 2. Test Environment Lifecycle

Testing the database security requires strict isolation to prevent cross-contamination of test data and false positives.

*   **Setup (`beforeAll`):** 
    1. Spin up a dedicated test instance of PocketBase (e.g., `./pocketbase serve --dir ./pb_data_test`).
    2. Run migrations programmatically to ensure schemas are up-to-date with active configurations.
    3. Seed foundational data: Superadmin account, default Tenants (e.g., Plaza Mayor, Casa de Piedra), and Base Roles.
*   **Teardown (`afterAll`):**
    1. Shut down the test instance.
    2. Purge the `./pb_data_test` directory to ensure the next run starts with a clean slate.

## 3. Scope of Testing

*   **Hook Testing (Black-Box):** Hooks like `rbac.pb.js` execute server-side. We test them by triggering their respective events (e.g., creating a user, updating a role via API) and querying the database to assert the side-effects (e.g., verifying `effective_permissions` array is populated correctly).
*   **API Rule Testing:** Making authenticated calls as users with specific roles and asserting that the server responds with 200 OK (authorized) or 403/404 (unauthorized/isolated).

## 4. Execution Rules
*   **No Mocks for Database:** All integration tests must run against a real, temporary SQLite database. Mocking the database invalidates the security test.
*   **TDD Mandate:** Test cases for RBAC and Tenant Isolation must be written and failing *before* the backend engineers are authorized to write the implementation logic. All tests must pass before the QA Authority signs off on the implementation.
