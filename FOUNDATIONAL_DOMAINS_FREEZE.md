# FOUNDATIONAL DOMAINS FREEZE

**FECHA DE CONGELACIÓN:** 2026-05-23
**AUTORIZADO POR:** Technical Director & Product Owner.

## Declaración
Se declara el congelamiento absoluto de la arquitectura de los dominios fundacionales para el proyecto Cotizador 2.0 Enterprise. Se prohíbe el inicio del desarrollo de dominios de negocio (Clientes, Espacios, etc.) hasta que estos dominios transversales estén 100% implementados, testeados y certificados.

## Dominios Congelados (Requisitos Previos al Desarrollo Core)
1. **Identity & Auth:** Manejo de sesión y autenticación (Completado).
2. **Tenants:** Aislamiento de datos PM/CP (Completado).
3. **RBAC:** Matriz de permisos efectiva y Zero Trust (Completado).
4. **Settings Domain:** Todas las variables duras pasan a colecciones maestras controladas por Tenant.
5. **Audit Engine (Hash Chain):** Registro inviolable con *hash_actual*, *hash_previo*, *hash_encadenado*.
6. **Snapshot Engine:** Fotografía de datos en el tiempo para aislar la facturación y los contratos del negocio vivo.
7. **Approval Engine:** Separación de la máquina de estados de aprobación (Firmas, Cotizaciones, Cancelaciones) del código propio de las entidades.

## Implicaciones para Ingeniería
Cualquier intento de crear un PR, Migración o Hook que pretenda resolver un problema de Settings, Auditoría, Snapshots o Aprobaciones directamente dentro de la tabla de una Cotización o Contrato será automáticamente rechazado.
