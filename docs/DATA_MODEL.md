# ERP COTIZADOR 2.0 ENTERPRISE - DATA MODEL

## 1. Domain Separation
Business Domains: Clients, Spaces, Space Occupancy, Documents, Quotes, Contracts, Renewals, Signatures, Invoices, Payments, Notifications, Reports, Analytics.

## 2. Multi-Tenant Architecture
- Every domain entity MUST include `tenant_id` (Plaza Mayor or Casa de Piedra).
- Strict isolation: Frontend and backend filter rigorously by this column.

## 3. Snapshot Strategy (SECTION 14)
Snapshots are immutable and mandatory for:
- Client Snapshot
- Quote Snapshot
- Contract Snapshot
- Invoice Snapshot

Snapshots MUST store:
- `payload` (JSON)
- `hash`
- `version`
- `createdAt`

*Note on Quotes*: Quote creates Quote Snapshot. Quote creates no legal obligation. `desglose_precios` is saved as JSON to survive catalog changes.

## 4. Audit & Tamper Detection (SECTION 15)
- Hash Chain mandatory: `current_hash`, `previous_hash`, `chain_hash`.
- Tamper Detection mandatory: Hourly verification via Scheduled Job.
- If chain broken: Emit `SYSTEM_TAMPERED` event.

## 5. Space Catalog Model (Docs 01-10)
- **Hybrid Nature**: Spaces use `config_b2b` (complex JSON configurations).
- Includes `precios_por_dia` (seasonality) and `dias_bloqueados`.
- Taxes (`impuestos_ids`) are related entities, never hardcoded.

## 6. Financial Ledger
- Invoices read ONLY Contract Snapshot. Never Client, Never Space, Never Quote.
- Payment Reconciliation mandatory (InvoiceBalanceEngine).
