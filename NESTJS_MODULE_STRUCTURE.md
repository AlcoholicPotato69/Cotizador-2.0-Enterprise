# NestJS Module Structure

This document establishes the architecture for individual feature modules inside the NestJS Modular Monolith (`apps/api`).

## Architectural Pattern

We follow a relaxed **Domain-Driven Design (DDD)** combined with Hexagonal Architecture/Clean Architecture principles, adapted for NestJS. 

## Module Directory Template

Each feature module (e.g., `quotes`, `users`, `products`) must follow this internal structure:

```text
src/modules/quotes/
├── quotes.module.ts             # Module definition, providers, imports, controllers
├── controllers/
│   └── quotes.controller.ts     # HTTP endpoints, routing, req/res mapping
├── services/
│   └── quotes.service.ts        # Business logic and use cases orchestration
├── repositories/
│   └── quotes.repository.ts     # Data access layer (abstracts Prisma)
├── dto/
│   ├── create-quote.dto.ts      # Input validation objects
│   ├── update-quote.dto.ts
│   └── quote-response.dto.ts    # Output serialization format
├── entities/
│   └── quote.entity.ts          # Pure domain models (optional, often DTOs handle serialization)
├── exceptions/
│   └── quote-not-found.exception.ts # Domain specific exceptions
└── types/
    └── quotes.types.ts          # Specific interfaces and types for the module
```

## Rules of Engagement

1. **Controllers**: Must ONLY handle HTTP concerns (status codes, headers, extracting body/params/query). They immediately delegate to Services.
2. **Services**: Contain pure business logic. They do NOT know about HTTP (no `req`/`res` objects). They orchestrate Repositories and external integrations.
3. **Repositories**: The ONLY components allowed to inject `PrismaService`. Services do not interact with Prisma directly. This ensures the database can be mocked or swapped, and complex queries are encapsulated.
4. **Cross-Module Communication**: Modules should interact via public Services (e.g., `QuotesService` calling `UsersService`). Do NOT inject another module's Repository directly. For deep decoupling, consider event-driven communication (Event Emitter).
5. **No God Modules**: Keep modules focused on a single bounded context. If a module grows too large, split it logically.
