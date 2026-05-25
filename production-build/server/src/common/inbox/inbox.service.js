"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InboxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InboxService = InboxService_1 = class InboxService {
    prisma;
    logger = new common_1.Logger(InboxService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processIdempotent(tenantId, eventId, eventType, payload, handler) {
        try {
            await this.prisma.inboxEvent.create({
                data: {
                    tenantId,
                    eventId,
                    eventType,
                    payload: payload,
                    status: 'PENDING',
                }
            });
        }
        catch (error) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
                this.logger.warn(`[INBOX] Evento ${eventId} (${eventType}) ignorado (Duplicado / Ya procesado).`);
                return;
            }
            throw error;
        }
        try {
            await handler();
            await this.prisma.inboxEvent.updateMany({
                where: { eventId, tenantId },
                data: {
                    status: 'COMPLETED',
                    processedAt: new Date()
                }
            });
            this.logger.log(`[INBOX] Evento ${eventId} (${eventType}) procesado exitosamente.`);
        }
        catch (handlerError) {
            this.logger.error(`[INBOX] Error al procesar evento ${eventId} (${eventType})`, handlerError);
            await this.prisma.inboxEvent.updateMany({
                where: { eventId, tenantId },
                data: {
                    status: 'FAILED',
                }
            });
            throw handlerError;
        }
    }
};
exports.InboxService = InboxService;
exports.InboxService = InboxService = InboxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InboxService);
//# sourceMappingURL=inbox.service.js.map