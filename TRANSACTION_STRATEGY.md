# Transaction Strategy

Handling transactions accurately is critical for data integrity in Cotizador 2.0 Enterprise.

## Prisma Transactions Overview

Prisma offers three transaction approaches:
1. **Nested Writes**: Creating a parent and its children in one query.
2. **Batch/Bulk Transactions**: `$transaction([query1, query2])`.
3. **Interactive Transactions**: `$transaction(async (tx) => { ... })`.

## Enterprise Guidelines

### 1. Default to Nested Writes
Whenever possible, utilize Prisma's nested writes for aggregate roots. If you are creating a Quote and its QuoteItems, do it in a single `.create()` call. This is the most performant and safest method.

### 2. Interactive Transactions for Complex Workflows
When a workflow spans multiple repositories or requires reads followed by conditional writes, use Interactive Transactions.

```typescript
async createComplexOrder(orderData: CreateOrderDto) {
  return await this.prisma.$transaction(async (tx) => {
    // tx is an instance of Prisma Client scoped to the transaction
    const inventory = await tx.inventory.findUnique(...);
    if (!inventory) throw new InsufficientStockException();
    
    await tx.inventory.update(...);
    const order = await tx.order.create(...);
    
    return order;
  }, {
    maxWait: 5000, // default is 2000ms
    timeout: 10000, // default is 5000ms
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable // strictly require for race conditions
  });
}
```

### 3. Repository Layer Implementation
To maintain the rule that "Services don't know about Prisma", we implement a Unit of Work (UoW) pattern or pass the transaction instance (`tx`) explicitly to repository methods.

**Example approach (Passing TX):**
```typescript
// in service
return this.prismaService.$transaction(async (tx) => {
   return this.usersRepository.updateBalance(userId, amount, tx);
});
```
*Note: Type `tx` as `Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>`.*
