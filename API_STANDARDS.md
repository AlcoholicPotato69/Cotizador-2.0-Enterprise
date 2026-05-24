# API Standards

API Standards define how the Cotizador 2.0 Enterprise endpoints are designed and consumed.

## RESTful Principles

1. **Nouns, not Verbs**: Use nouns for resources. Pluralize resource names (e.g., `/users`, not `/user` or `/getUsers`).
2. **HTTP Methods**:
   - `GET`: Retrieve data (Idempotent).
   - `POST`: Create data.
   - `PUT`: Complete replacement of a resource (Idempotent).
   - `PATCH`: Partial update of a resource.
   - `DELETE`: Remove a resource (Idempotent).

## NestJS Controller Best Practices

- Use `@Controller('v1/resource')` for versioning at the controller level or leverage NestJS global versioning (`app.enableVersioning()`).
- Always use specific decorators: `@Get()`, `@Post()`, `@Body()`, `@Param()`, `@Query()`.

## Status Codes

- `200 OK`: Successful GET, PUT, PATCH.
- `201 Created`: Successful POST.
- `204 No Content`: Successful DELETE (if returning nothing).
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Missing or invalid authentication.
- `403 Forbidden`: Authenticated, but insufficient permissions.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Business rule violation (e.g., duplicate email).
- `500 Internal Server Error`: Unhandled system crash.

## Pagination & Filtering

For collection endpoints (`GET /quotes`), use standard query parameters:
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sortBy` (e.g., `createdAt`)
- `sortOrder` (`asc` or `desc`)

**Standard Paginated Response**:
```json
{
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```
