"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExpirationEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpirationEngineService = void 0;
const common_1 = require("@nestjs/common");
let ExpirationEngineService = ExpirationEngineService_1 = class ExpirationEngineService {
    logger = new common_1.Logger(ExpirationEngineService_1.name);
    async scanExpirations(tx) {
        this.logger.log('Escaneando expiraciones de documentos y configs fiscales...');
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiringDocuments = await tx.document.findMany({
            where: {
                retentionUntil: {
                    lte: thirtyDaysFromNow,
                    gte: now,
                },
            },
        });
        this.logger.log(`Found ${expiringDocuments.length} documents expiring soon.`);
        if (expiringDocuments.length > 0) {
            await tx.notificationQueue.createMany({
                data: expiringDocuments.map(doc => ({
                    tenantId: doc.tenantId,
                    type: 'DOCUMENT_EXPIRATION_WARNING',
                    recipient: 'TENANT_ADMIN',
                    payload: {
                        documentId: doc.id,
                        retentionUntil: doc.retentionUntil,
                        message: `Document ${doc.id} retention period will expire soon.`,
                    },
                    status: 'PENDING',
                })),
            });
        }
        const expiringTaxes = await tx.taxConfiguration.findMany({
            where: {
                validUntil: {
                    lte: thirtyDaysFromNow,
                    gte: now,
                },
            },
        });
        this.logger.log(`Found ${expiringTaxes.length} tax configurations expiring soon.`);
        if (expiringTaxes.length > 0) {
            await tx.notificationQueue.createMany({
                data: expiringTaxes.map(tax => ({
                    tenantId: tax.tenantId,
                    type: 'TAX_CONFIG_EXPIRATION_WARNING',
                    recipient: 'FINANCE_MANAGER',
                    payload: {
                        taxId: tax.id,
                        taxName: tax.taxName,
                        validUntil: tax.validUntil,
                        message: `Tax configuration ${tax.taxName} validity will expire soon.`,
                    },
                    status: 'PENDING',
                })),
            });
        }
        this.logger.log('Escaneo de expiraciones finalizado.');
    }
};
exports.ExpirationEngineService = ExpirationEngineService;
exports.ExpirationEngineService = ExpirationEngineService = ExpirationEngineService_1 = __decorate([
    (0, common_1.Injectable)()
], ExpirationEngineService);
//# sourceMappingURL=expiration.service.js.map