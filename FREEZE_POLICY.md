# Freeze Policy - Mandato V5.4

## 1. Purpose
To ensure system stability during critical business periods and prior to major releases, code and configuration freezes are enforced.

## 2. Types of Freezes
- **Code Freeze**: No new features or non-critical bug fixes may be merged into the release branch. Only critical, release-blocking hotfixes are allowed with Release Authority approval.
- **Configuration Freeze**: No changes to production environment configurations, infrastructure, or network settings are permitted.

## 3. Freeze Windows
- **Pre-Release Freeze**: Commences 48 hours prior to any scheduled major release.
- **End-of-Quarter Freeze**: Commences 5 days prior to the end of a fiscal quarter to ensure financial reporting stability.
- **Holiday Freeze**: Defined annually, covering major holidays where support staff availability is reduced.

## 4. Emergency Break-Glass Procedure
In the event of a critical production incident (P1) during a freeze, the Technical Director and Release Authority may jointly authorize an emergency hotfix. This requires a post-incident review (PIR) within 48 hours of resolution.
