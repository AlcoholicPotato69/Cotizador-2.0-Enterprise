"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOutbox = void 0;
const withOutbox = (prisma) => {
    return prisma.$extends({
        model: {
            $allModels: {
                async createWithOutbox(args) {
                    const { outboxAggregateType, outboxAggregateId, outboxEventType, outboxPayload, outboxTenantId, outboxCorrelationId, ...operationArgs } = args;
                    return prisma.$transaction(async (tx) => {
                        const result = await tx[this.name].create(operationArgs);
                        await tx.outboxEvent.create({
                            data: {
                                tenantId: outboxTenantId,
                                aggregateType: outboxAggregateType,
                                aggregateId: outboxAggregateId,
                                eventType: outboxEventType,
                                payload: outboxPayload,
                                correlationId: outboxCorrelationId,
                                status: 'PENDING'
                            },
                        });
                        return result;
                    });
                },
                async updateWithOutbox(args) {
                    const { outboxAggregateType, outboxAggregateId, outboxEventType, outboxPayload, outboxTenantId, outboxCorrelationId, ...operationArgs } = args;
                    return prisma.$transaction(async (tx) => {
                        const result = await tx[this.name].update(operationArgs);
                        await tx.outboxEvent.create({
                            data: {
                                tenantId: outboxTenantId,
                                aggregateType: outboxAggregateType,
                                aggregateId: outboxAggregateId,
                                eventType: outboxEventType,
                                payload: outboxPayload,
                                correlationId: outboxCorrelationId,
                                status: 'PENDING'
                            },
                        });
                        return result;
                    });
                },
            },
        },
    });
};
exports.withOutbox = withOutbox;
//# sourceMappingURL=prisma-outbox.extension.js.map