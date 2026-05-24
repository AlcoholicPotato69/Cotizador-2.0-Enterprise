# Monorepo Structure

This document outlines the monorepo structure for Cotizador 2.0 Enterprise. The project utilizes a monorepo architecture (via PNPM Workspaces or Nx) to manage applications and shared libraries effectively.

## Directory Layout

```text
cotizador-2.0-enterprise/
├── apps/
│   ├── api/                   # Main NestJS Modular Monolith API
│   ├── web/                   # Frontend Application (e.g., Next.js / React)
│   └── workers/               # Background jobs/workers (NestJS microservices)
├── packages/
│   ├── database/              # Prisma schema, migrations, and client generation
│   ├── shared-types/          # TypeScript interfaces/types shared across full-stack
│   ├── logger/                # Custom enterprise logging wrapper
│   └── auth/                  # Shared authentication strategies/utilities
├── tools/                     # Scripts for CI/CD, scaffolding, and DevEx
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Key Principles

1. **Separation of Concerns**: The API, Frontend, and Workers reside in `apps/`. Any code reused between them or heavily decoupled from the application lifecycle resides in `packages/`.
2. **Database Package**: Prisma lives in `packages/database`. This ensures the API and Workers can safely import the Prisma client without duplicating the schema or risking version mismatch.
3. **Strict Boundaries**: Apps can depend on packages. Packages can depend on other packages (avoiding circular dependencies). Apps should NOT depend on other apps.
4. **Unified Configuration**: Tools like ESLint, Prettier, and TypeScript base configurations are kept at the root level and extended by individual apps/packages to guarantee enterprise-wide consistency.
