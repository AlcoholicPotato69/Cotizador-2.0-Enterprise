# 📜 Business Logic Migration & Enforcement Plan

## 1. Objective
This document establishes the strict separation of concerns between the Vue.js Frontend and the PocketBase Backend. The primary goal is to ensure the UI remains a "dumb" presentation layer, completely incapable of altering prices, manipulating discounts, or bypassing approval workflows.

## 2. The "Dumb Frontend" Directive

### 2.1 Forbidden Frontend Actions (STRICTLY PROHIBITED)
The Vue frontend **MUST NOT** perform any of the following operations:
*   ❌ **Price Arithmetic**: `final_price = base_price * quantity` or `total = subtotal - discount + IVA`.
*   ❌ **Discount Validation**: Determining if a 15% discount is permissible for a specific client tier.
*   ❌ **State Determination**: Deciding if a quote goes to "Approved" or "Pending Approval" based on the discount applied.
*   ❌ **Data Hydration with Prices**: Sending payloads like `{ "resource_id": "123", "base_price": 5000 }` to the backend. The API will aggressively reject or silently drop the `base_price` field.

### 2.2 Allowed Frontend Actions (PERMITTED)
The Vue frontend **IS ONLY PERMITTED** to:
*   ✅ **Send Intent**: Dispatch payloads representing user intent, e.g., `{ "action": "ADD_ITEM", "resource_id": "123", "quantity": 2, "requested_discount_pct": 10 }`.
*   ✅ **Render Backend Truth**: Display the exact numerical values provided by the backend's API responses (e.g., displaying `quotation.grand_total`).
*   ✅ **React to State**: Disable "Submit" buttons or show warning banners if the backend returns a status of `pending_approval`.

## 3. Migration Strategy (From Legacy to Enterprise)

### Phase 1: Audit and Extirpation
1.  Scan the existing Vue codebase for any math operations involving money (`+`, `-`, `*`, `/` on monetary variables).
2.  Remove all hardcoded pricing tables, JSON rule files, or configuration objects from the frontend repository.
3.  Remove Vuex/Pinia getters that calculate cart totals.

### Phase 2: API Contract Redesign
1.  Modify frontend forms to only capture `quantity` and `requested_discount`.
2.  Implement polling or Realtime Subscriptions in Vue. When an item is added, the UI waits for the backend to calculate the total and push the updated `quotation` object back via SSE/WebSocket.

### Phase 3: Implementing the "Sealed Total" Concept
1.  The backend will return a `sealed_payload` object containing the quotation totals along with a cryptographic signature.
2.  When the frontend generates a PDF or sends an email, it requests the backend to generate the document using its internal, immutable state. The frontend *never* passes the totals to the PDF generator itself.

## 4. Error Handling and User Feedback
Since the UI cannot validate business rules instantly on the client side, it must elegantly handle backend rejections:
*   **Rule Violation**: If the backend rejects an intent (e.g., "Discount exceeds absolute maximum of 50%"), the UI must catch the HTTP 400/403 error and display the backend's localized error message.
*   **Approval Triggered**: If an intent triggers an approval workflow, the UI transitions to a read-only state and displays: *"Your requested discount of 25% requires Director approval. The quotation is now locked pending review."*
