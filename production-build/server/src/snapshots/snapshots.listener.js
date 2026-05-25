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
var SnapshotsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const snapshots_service_1 = require("./snapshots.service");
const tenant_context_1 = require("../prisma/tenant-context");
let SnapshotsListener = SnapshotsListener_1 = class SnapshotsListener {
    snapshotsService;
    logger = new common_1.Logger(SnapshotsListener_1.name);
    constructor(snapshotsService) {
        this.snapshotsService = snapshotsService;
    }
    async handleDomainEventsForSnapshots(event) {
        if (!event || !event.tenantId || !event.payload)
            return;
        tenant_context_1.tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
            try {
                const entityType = event.eventName ? event.eventName.split('.')[0] : 'Unknown';
                await this.snapshotsService.createSnapshot({
                    entityType: entityType.toUpperCase(),
                    payload: event.payload
                });
                this.logger.log(`Snapshot saved for event: ${event.eventName || 'unknown'}`);
            }
            catch (error) {
                this.logger.error(`Failed to save snapshot for event: ${event.eventName}`, error);
            }
        });
    }
};
exports.SnapshotsListener = SnapshotsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('*.created', { async: true }),
    (0, event_emitter_1.OnEvent)('*.updated', { async: true }),
    (0, event_emitter_1.OnEvent)('*.approved', { async: true }),
    (0, event_emitter_1.OnEvent)('*.generated', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SnapshotsListener.prototype, "handleDomainEventsForSnapshots", null);
exports.SnapshotsListener = SnapshotsListener = SnapshotsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [snapshots_service_1.SnapshotsService])
], SnapshotsListener);
//# sourceMappingURL=snapshots.listener.js.map