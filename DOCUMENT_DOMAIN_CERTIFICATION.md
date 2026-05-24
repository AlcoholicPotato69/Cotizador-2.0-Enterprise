# Document Domain Certification

## 1. Domain Overview
This certification verifies the core Document entity features as defined by the Enterprise architecture, focusing on litigation holds, retention policies, and storage mapping.

## 2. Features Verified
- **Legal Hold (`legalHold`):** The `setLegalHold` method successfully toggles the hold status. The `deleteDocument` method checks `legalHold` and throws a `BadRequestException` if a deletion attempt is made on a protected document.
- **Retention Policies (`retentionUntil`):** Time-based retention policies are supported at the database schema level (`retention_until` field) and captured during document creation.
- **Storage:** `storageProvider` and `storagePath` accurately point to the physical location of the document, ensuring an abstraction between metadata and blob storage.

## 3. Findings
- Hard deletions are securely blocked when `legalHold` is active, maintaining forensic auditing standards.
- Storage mapping properties are correctly required on document creation.
- *Note:* While `retentionUntil` is stored, strict timestamp validation during deletion could be added in Phase 2 for enhanced lifecycle management.

## 4. Certification Result
**STATUS: CERTIFIED**
The Document Domain meets the required compliance and storage traceability standards for Mandato V5.11.
