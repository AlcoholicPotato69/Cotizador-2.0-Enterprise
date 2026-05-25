"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsService = void 0;
const common_1 = require("@nestjs/common");
const snapshots_repository_1 = require("./snapshots.repository");
const crypto = __importStar(require("crypto"));
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
let SnapshotsService = class SnapshotsService {
    repo;
    eventPublisher;
    constructor(repo, eventPublisher) {
        this.repo = repo;
        this.eventPublisher = eventPublisher;
    }
    async createSnapshot(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId) {
            throw new common_1.BadRequestException('Tenant context is missing for Snapshot Creation');
        }
        const payloadString = JSON.stringify(dto.payload);
        const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');
        const lastSnapshot = await this.repo.findLatestByType(dto.entityType, ctx.tenantId);
        const newVersion = lastSnapshot ? lastSnapshot.version + 1 : 1;
        const previousHash = lastSnapshot ? lastSnapshot.chainHash : 'GENESIS';
        const chainHash = crypto.createHash('sha256').update(previousHash + payloadHash).digest('hex');
        let snapshot;
        try {
            snapshot = await this.repo.create({
                tenantId: ctx.tenantId,
                entityType: dto.entityType,
                payloadHash,
                previousHash,
                chainHash,
                version: newVersion,
                payload: dto.payload,
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Snapshot Hash Chain Collision detected. Please retry.');
            }
            throw error;
        }
        await this.eventPublisher.publish({
            eventName: 'snapshot.created',
            tenantId: ctx.tenantId,
            payload: { snapshotId: snapshot.id, entityType: snapshot.entityType, version: snapshot.version },
            timestamp: new Date()
        });
        return snapshot;
    }
};
exports.SnapshotsService = SnapshotsService;
exports.SnapshotsService = SnapshotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [snapshots_repository_1.SnapshotsRepository,
        domain_event_publisher_1.DomainEventPublisher])
], SnapshotsService);
//# sourceMappingURL=snapshots.service.js.map