import { PrismaClient, Prisma } from '@prisma/client';
export declare const withOutbox: (prisma: PrismaClient) => import("@prisma/client/runtime/library").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {
        $allModels: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        user: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        tenant: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        role: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        permission: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        userRole: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        rolePermission: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        auditLog: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        snapshot: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        featureFlag: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        taxConfiguration: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        currency: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        client: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        space: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceOccupancy: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        document: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        notificationQueue: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        quote: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contract: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        signature: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        invoice: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        payment: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        paymentEvidence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        clientFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        clientFileDocument: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        quoteFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        financialFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreement: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementItem: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementApproval: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementSignature: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementEvidence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementSnapshot: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        documentReview: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        documentReviewStep: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        documentReviewDecision: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        customerCreditBalance: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        creditTransaction: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        creditApplication: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogCategory: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogItem: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogPrice: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogSnapshot: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractTemplateVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractClause: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        clauseVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        templateVariable: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        quoteTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        invoiceTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        receiptTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulationTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulation: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulationVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulationAcceptance: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        calendarEvent: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceConfiguration: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceRule: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceAvailabilityRule: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        signatureEvidence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        paymentAllocation: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        outboxEvent: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        outboxDispatch: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        outboxFailure: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        inboxEvent: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobQueue: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobExecution: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobRetry: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobFailure: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowDefinition: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowState: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowTransition: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowRule: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        archivePolicy: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        archiveJob: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        archiveRecord: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        globalSearchIndex: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        numberingSequence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        storageMetadata: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        healthCheckMetric: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        pdfTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        pdfDocument: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_access: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_activity: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_collections: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_comments: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_dashboards: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_deployment_projects: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_deployment_runs: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_deployments: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_extensions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_fields: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_files: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_flows: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_folders: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_migrations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_notifications: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_operations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_panels: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_permissions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_policies: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_presets: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_relations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_revisions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_roles: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_sessions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_settings: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_shares: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_translations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_users: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_versions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        tenantSettings: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        settingsHistory: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
    };
    query: {};
    client: {};
}, Prisma.PrismaClientOptions>, Prisma.TypeMapCb, {
    result: {};
    model: {
        $allModels: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        user: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        tenant: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        role: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        permission: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        userRole: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        rolePermission: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        auditLog: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        snapshot: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        featureFlag: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        taxConfiguration: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        currency: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        client: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        space: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceOccupancy: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        document: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        notificationQueue: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        quote: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contract: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        signature: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        invoice: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        payment: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        paymentEvidence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        clientFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        clientFileDocument: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        quoteFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        financialFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementFile: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreement: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementItem: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementApproval: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementSignature: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementEvidence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        agreementSnapshot: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        documentReview: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        documentReviewStep: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        documentReviewDecision: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        customerCreditBalance: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        creditTransaction: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        creditApplication: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogCategory: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogItem: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogPrice: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        catalogSnapshot: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractTemplateVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        contractClause: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        clauseVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        templateVariable: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        quoteTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        invoiceTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        receiptTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulationTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulation: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulationVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        regulationAcceptance: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        calendarEvent: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceConfiguration: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceRule: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        spaceAvailabilityRule: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        signatureEvidence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        paymentAllocation: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        outboxEvent: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        outboxDispatch: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        outboxFailure: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        inboxEvent: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobQueue: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobExecution: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobRetry: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        jobFailure: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowDefinition: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowVersion: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowState: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowTransition: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        workflowRule: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        archivePolicy: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        archiveJob: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        archiveRecord: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        globalSearchIndex: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        numberingSequence: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        storageMetadata: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        healthCheckMetric: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        pdfTemplate: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        pdfDocument: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_access: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_activity: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_collections: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_comments: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_dashboards: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_deployment_projects: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_deployment_runs: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_deployments: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_extensions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_fields: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_files: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_flows: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_folders: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_migrations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_notifications: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_operations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_panels: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_permissions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_policies: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_presets: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_relations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_revisions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_roles: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_sessions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_settings: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_shares: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_translations: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_users: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        directus_versions: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        tenantSettings: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
        settingsHistory: {
            createWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "create"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
            updateWithOutbox: () => <T, A>(this: T, args: Prisma.Args<T, "update"> & {
                outboxAggregateType: string;
                outboxAggregateId: string;
                outboxEventType: string;
                outboxPayload: Record<string, unknown>;
                outboxTenantId: string;
                outboxCorrelationId?: string;
            }) => Promise<unknown>;
        };
    };
    query: {};
    client: {};
}, {}>;
