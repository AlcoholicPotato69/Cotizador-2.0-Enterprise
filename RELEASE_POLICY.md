# Release Policy - Mandato V5.4

## 1. Overview
This document defines the strict policies and procedures that must be followed to release any component of the Cotizador-2.0-Enterprise into the Production environment. As the Release Authority, the final decision for any release is governed by the principles of Source Purity, Role-Based Access Control (RBAC), and Quality Assurance (QA) certifications.

## 2. Release Requirements
- **Source Purity**: All code must reside in the approved version control system. No untracked changes, temporary files, or unverified dependencies are permitted.
- **RBAC**: Only authorized personnel may initiate, approve, or execute a release. Separation of duties is enforced.
- **QA Certification**: All domains must pass rigorous QA testing, including automated unit, integration, regression, and performance tests, prior to being considered for release.

## 3. Approval Workflow
1. **Development Complete**: Code is merged into the staging branch after peer review.
2. **QA Sign-off**: QA team executes test plans and provides a formal certification.
3. **Release Candidate**: A specific immutable build is tagged as a Release Candidate (RC).
4. **Go/No-Go Decision**: Stakeholders convene to evaluate the RC against the `DOMAIN_GO_NO_GO_MATRIX.md`.
5. **Release Authority Approval**: The Release Authority reviews all documentation and issues the `RELEASE_CERTIFICATION`.
6. **Deployment**: Operations team deploys the RC to production during an approved maintenance window.

## 4. Exceptions
Any deviation from this policy requires a formal Emergency Request, documented and approved by the Technical Director and the Release Authority.
