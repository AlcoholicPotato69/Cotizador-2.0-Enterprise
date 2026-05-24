# Error Handling Strategy

Standardized error handling guarantees a predictable API consumption experience.

## Global Exception Filter

A centralized `AllExceptionsFilter` (implementing `ExceptionFilter`) must catch all unhandled exceptions globally. It ensures a consistent JSON structure for the frontend.

## The Standard Error Format (RFC 7807 inspired)

All API errors must return the following structure:

```json
{
  "statusCode": 400,
  "timestamp": "2026-05-23T22:46:18.000Z",
  "path": "/api/v1/quotes",
  "method": "POST",
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "details": [
    {
      "field": "amount",
      "message": "amount must be a positive number"
    }
  ],
  "traceId": "req-uuid-1234"
}
```

## Domain Exceptions

Create custom exceptions for domain rules in `src/modules/*/exceptions`.
They should extend `HttpException` (or a base `DomainException` class mapped to an HTTP status code).

```typescript
export class QuoteExpiredException extends HttpException {
  constructor(quoteId: string) {
    super({
      message: `Quote with ID ${quoteId} has expired.`,
      errorCode: 'QUOTE_EXPIRED'
    }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
```

## Prisma Errors Translation

Do NOT leak raw Prisma errors (like `P2002`) to the client. The Global Exception Filter or an Interceptor must intercept Prisma Client Known Request Errors (`Prisma.PrismaClientKnownRequestError`) and map them to standard HTTP exceptions.
- `P2002` (Unique constraint failed) -> `409 Conflict`
- `P2025` (Record not found) -> `404 Not Found`
