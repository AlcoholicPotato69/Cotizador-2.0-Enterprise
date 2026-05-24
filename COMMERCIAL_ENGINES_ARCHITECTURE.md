# 🏛️ Phase 6: Commercial Engines Architecture ("El Cotizador Pesado")

## 1. Executive Summary
This document outlines the architectural blueprint for the "Cotizador Enterprise" calculation engine. The system is designed to serve multiple venues (Plaza Mayor, Casa de Piedra) with complex, venue-specific pricing rules, dynamic discount matrices, and multi-tiered approval workflows. The core architectural directive is **Absolute Backend Authority**: the frontend is completely decoupled from pricing logic, serving strictly as an intent-delivery and presentation layer.

## 2. Core Data Models (PocketBase Collections)

### 2.1 Rule Engine & Matrices
*   **`pricing_rules`**
    *   `id`, `plaza_id` (Rel: plazas), `resource_type` (e.g., salon, catering, av_equipment).
    *   `condition_expression` (JSON): Rules based on seasonality, day of week, capacity.
    *   `base_price` (Decimal), `currency` (String).
    *   `effective_date` (DateTime), `expiration_date` (DateTime).
*   **`discount_matrices`**
    *   `id`, `plaza_id`, `client_tier` (e.g., corporate, agency, standard).
    *   `max_auto_discount_pct` (Decimal): Maximum discount applied without manual approval.
    *   `required_approval_role` (String): Role required if requested discount exceeds auto-discount.
*   **`taxes_and_fees`**
    *   `id`, `plaza_id`, `fee_type` (IVA, Service Charge), `percentage` (Decimal).

### 2.2 Quotation State & Ledger
*   **`quotations`**
    *   `id`, `tenant_id`, `plaza_id`, `client_id`.
    *   `status` (Enum: draft, pending_approval, approved, rejected, expired, sealed).
    *   `subtotal` (Decimal), `total_discount` (Decimal), `total_tax` (Decimal), `grand_total` (Decimal) — **Calculated exclusively by the backend.**
    *   `cryptographic_hash` (String): Ensures immutability of the final calculated state.
*   **`quotation_items`**
    *   `id`, `quotation_id`, `resource_id`, `quantity` (Int).
    *   `requested_discount_pct` (Decimal).
    *   `calculated_base_price`, `calculated_final_price` — **Written only by backend hooks.**
*   **`approval_workflows`**
    *   `id`, `quotation_id`, `requested_by`, `approved_by`, `status` (pending, approved, denied), `reason` (Text).

## 3. Backend Execution Hooks (Goja / PocketBase Event Hooks)

To ensure the frontend cannot manipulate pricing, all calculations run via PocketBase transaction hooks.

### 3.1 `OnRecordBeforeSaveRequest("quotation_items")`
*   **Action**: Intercepts any creation or modification of a line item.
*   **Logic**:
    1.  Strips `calculated_base_price` and `calculated_final_price` from the incoming request payload.
    2.  Queries `pricing_rules` based on `resource_id`, `plaza_id`, and event date.
    3.  Injects the authoritative `base_price` into the record before committing to SQLite.
    4.  Triggers a recalculation event on the parent `quotation`.

### 3.2 `CalculateQuotationTotal(quotation_id)` (Internal Trigger)
*   **Action**: A deterministic function that sums the quotation.
*   **Logic**:
    1.  Aggregates all `quotation_items` base prices.
    2.  Evaluates requested discounts against `discount_matrices`.
    3.  If `requested_discount` <= `max_auto_discount_pct`, applies the discount.
    4.  If `requested_discount` > `max_auto_discount_pct`, flags the quotation status as `pending_approval` and locks the record.
    5.  Applies `taxes_and_fees`.
    6.  Writes totals to the `quotations` record and generates the `cryptographic_hash`.

### 3.3 `OnRecordBeforeUpdateRequest("quotations")` (State Machine Enforcement)
*   **Action**: Prevents illegal state transitions.
*   **Logic**: If `status` == `sealed` or `pending_approval`, rejects any modifications to child items unless the user holds the `Director` or `Approver` role executing a workflow action.

## 4. Scalability Note
If PocketBase's embedded JavaScript engine (Goja) faces performance bottlenecks with complex matrix evaluations, this logic will be extracted into an isolated **Pricing Microservice** written in Go, exposing a gRPC or internal REST endpoint called by PocketBase hooks.
