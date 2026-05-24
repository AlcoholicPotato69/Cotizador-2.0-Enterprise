# ENTERPRISE DATA MODEL FINAL

**Status:** FROZEN_V7.2
**Date:** 2026-05-23

## 1. Foundational
- `Tenant`, `TenantSettings`, `AuditLog`, `Snapshot`, `ApprovalRequest`, `ApprovalStep`, `NumberingSequence`.
- **`FeatureFlag`** (tenant_id, feature_key, enabled, rollout_percentage)
- **`RetentionPolicy`** (tenant_id, entity_type, retention_period_days, legal_hold_supported)
- **`TaxConfiguration`** (tenant_id, tax_name, tax_rate, valid_from, valid_until, is_default)
- **`Currency`** (code, symbol, decimals, is_default)

## 2. Core & Operations
- `Client`, `Space`, `SpaceOccupancy`, `SpaceOccupancyHistory`.
- **`ContractTemplate`** (tenant_id, name, version, template_type, is_active)

## 3. Commercial
- `Quote` (id, tenant_id, client_snapshot_id, occupancy_snapshot_id, currency_code, status: DRAFT..CONTRACT_GENERATED)
- `QuoteItem`, `QuoteVersion`

## 4. Legal & Signature
- `Contract` (id, tenant_id, quote_snapshot_id, currency_code, status: DRAFT..TERMINATED)
- `ContractVersion`, `ContractRenewal`
- `SignatureRequest`, `SignatureParticipant`, `EvidenceVault`

## 5. Financial (Decimal Data Types)
- `Invoice` (id, tenant_id, contract_snapshot_id, currency_code, total_amount, amount_paid, balance_due, payment_status, status: DRAFT..CANCELLED)
- `Payment` (id, tenant_id, invoice_id, currency_code, payment_amount, status: PENDING..REJECTED)
- `CreditNote`, `Adjustment`

## 6. Documents & Communications
- `Document`, `NotificationQueue`
