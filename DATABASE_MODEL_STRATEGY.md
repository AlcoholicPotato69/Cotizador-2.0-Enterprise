# Database Model Strategy

This document defines the rules for modeling the PostgreSQL database via Prisma for Cotizador 2.0 Enterprise.

## Naming Conventions

To maintain consistency between the SQL layer and the TypeScript layer:

1. **Tables (Models)**: Use PascalCase and singular nouns in Prisma (e.g., `model User`, `model QuoteItem`). Prisma automatically maps these nicely.
2. **Fields**: Use camelCase for Prisma field names (e.g., `firstName`, `createdAt`). 
3. **Database Mapping**: Use `@map` and `@@map` to map Prisma models/fields to snake_case in the underlying PostgreSQL database.

```prisma
model User {
  id        String   @id @default(uuid())
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## Standard Columns

Every major entity should include:
- `id`: `String @id @default(uuid())` (UUIDv4) for global uniqueness and security against enumeration.
- `createdAt`: `DateTime @default(now())`
- `updatedAt`: `DateTime @updatedAt`
- `deletedAt`: `DateTime?` (Used for Soft Deletes).

## Relations

- Define explicitly. Name relation fields clearly.
- If multiple relations exist between the same two models, use the `@relation(name: "...")` attribute to disambiguate.
- Prefer explicit foreign keys rather than implicit ones to have strict control over indices.

## Soft Deletes

Data is rarely physically deleted in Enterprise systems.
- Use a `deletedAt DateTime?` field.
- The Repository layer is responsible for appending `{ deletedAt: null }` to `findMany`, `findUnique`, etc.
- Prisma Middleware or Extensions can be utilized to automate soft-delete filtering globally.

## Indexing

- Always index Foreign Keys (`@@index([foreignKeyId])`).
- Index fields used commonly in `WHERE`, `ORDER BY`, or `GROUP BY` clauses.
- Use `@@unique` for natural keys (e.g., email, tax_id).
