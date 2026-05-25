import { PrismaClient, Prisma } from '@prisma/client';

export const withOutbox = (prisma: PrismaClient) => {
  return prisma.$extends({
    model: {
      $allModels: {
        async createWithOutbox<T, A>(
          this: T,
          args: Prisma.Args<T, 'create'> & {
            outboxAggregateType: string;
            outboxAggregateId: string;
            outboxEventType: string;
            outboxPayload: Record<string, unknown>;
            outboxTenantId: string;
            outboxCorrelationId?: string;
          },
        ) {
          const {
            outboxAggregateType,
            outboxAggregateId,
            outboxEventType,
            outboxPayload,
            outboxTenantId,
            outboxCorrelationId,
            ...operationArgs
          } = args as Record<string, unknown>;

          return prisma.$transaction(async (tx) => {
            const result = await (
              tx as unknown as Record<
                string,
                { create: (args: unknown) => Promise<unknown> }
              >
            )[(this as { name: string }).name].create(operationArgs);

            await (tx as any).outboxEvent.create({
              data: {
                tenantId: outboxTenantId as string,
                aggregateType: outboxAggregateType as string,
                aggregateId: outboxAggregateId as string,
                eventType: outboxEventType as string,
                payload: outboxPayload,
                correlationId: outboxCorrelationId as string | undefined,
                status: 'PENDING',
              },
            });

            return result;
          });
        },
        async updateWithOutbox<T, A>(
          this: T,
          args: Prisma.Args<T, 'update'> & {
            outboxAggregateType: string;
            outboxAggregateId: string;
            outboxEventType: string;
            outboxPayload: Record<string, unknown>;
            outboxTenantId: string;
            outboxCorrelationId?: string;
          },
        ) {
          const {
            outboxAggregateType,
            outboxAggregateId,
            outboxEventType,
            outboxPayload,
            outboxTenantId,
            outboxCorrelationId,
            ...operationArgs
          } = args as Record<string, unknown>;

          return prisma.$transaction(async (tx) => {
            const result = await (
              tx as unknown as Record<
                string,
                { update: (args: unknown) => Promise<unknown> }
              >
            )[(this as { name: string }).name].update(operationArgs);

            await (tx as any).outboxEvent.create({
              data: {
                tenantId: outboxTenantId as string,
                aggregateType: outboxAggregateType as string,
                aggregateId: outboxAggregateId as string,
                eventType: outboxEventType as string,
                payload: outboxPayload,
                correlationId: outboxCorrelationId as string | undefined,
                status: 'PENDING',
              },
            });

            return result;
          });
        },
      },
    },
  });
};
