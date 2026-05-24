# DOMAIN INVENTORY

## Authority: TECHNICAL DIRECTOR & PROGRAM GOVERNANCE
## Date: 2026-05-23
## Status: PENDING VERIFICATION

Este documento lista los dominios de negocio teóricos vs. su estado real, los cuales deben ser verificados mediante evidencia en código.

### 1. Core Authentication & Multi-Tenant Domain
- **Componentes:** Autenticación de PocketBase, RBAC, Aislamiento por Tenant (Plaza Mayor, Casa de Piedra).
- **Estado Actual:** FROZEN. Certificaciones previas: Unreliable.
- **Acción Requerida:** Security Architect debe auditar hooks de Auth y migraciones.

### 2. Quote & Contract Management Domain
- **Componentes:** Quotes, Quote Versions, Quote Snapshots, Contracts, Contract Versions.
- **Estado Actual:** FROZEN. Código detectado en backend y migraciones.
- **Acción Requerida:** QA Authority debe establecer pruebas de integración.

### 3. Signatures & Evidence Vault Domain
- **Componentes:** Multi-Signer Workflow, Provider Abstraction (DocuSign/Manual), Evidence Vault.
- **Estado Actual:** FROZEN.
- **Acción Requerida:** QA Authority debe verificar si existe código comprobable de pruebas.

### 4. Retention & Legal Hold Domain
- **Componentes:** Motores de expiración de documentos, Legal Hold, Purga.
- **Estado Actual:** PENDING. Posible código faltante o sin pruebas.

### 5. Financial Domain (Invoices & Payments)
- **Estado Actual:** BLOCKED / NOT STARTED. No se permite desarrollo.
