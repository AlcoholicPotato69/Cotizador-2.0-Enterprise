# Client Compliance Certification

## 1. Domain Overview
This document certifies the compliance mechanisms within the Clients domain, specifically the blocking flags that prevent illegal operational flows.

## 2. Flags Evaluated
- `isContractBlocked` (`is_contract_blocked`)
- `isInvoiceBlocked` (`is_invoice_blocked`)

## 3. Findings
- **Invoicing Flow:** The `validateForInvoicing` method correctly throws a `BadRequestException` if `isInvoiceBlocked` is set to `true`. Furthermore, it correctly strictly checks that the client's status is `CLIENT`, rejecting invoicing for `LEAD` or `PROSPECT` statuses.
- **Contracting Flow:** The `validateForContract` method properly blocks the generation/approval of contracts if `isContractBlocked` is `true`.
- The `updateComplianceFlags` method allows programmatic and secure updates to these flags via RBAC-protected service calls.

## 4. Certification Result
**STATUS: CERTIFIED**
Compliance flags successfully halt operations that violate business or fiscal rules, conforming to the compliance requirements of Mandato V5.11.
