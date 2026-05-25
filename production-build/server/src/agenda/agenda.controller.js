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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaController = void 0;
const common_1 = require("@nestjs/common");
const agenda_service_1 = require("./agenda.service");
const create_reservation_dto_1 = require("./dto/create-reservation.dto");
const reschedule_reservation_dto_1 = require("./dto/reschedule-reservation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const tenant_context_1 = require("../prisma/tenant-context");
const swagger_1 = require("@nestjs/swagger");
let AgendaController = class AgendaController {
    agendaService;
    constructor(agendaService) {
        this.agendaService = agendaService;
    }
    async reserve(createReservationDto, req) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, async () => {
            return await this.agendaService.reserve(createReservationDto);
        });
    }
    async reschedule(id, rescheduleDto, req) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, async () => {
            return await this.agendaService.reschedule(id, rescheduleDto);
        });
    }
    async release(id, req) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, async () => {
            return await this.agendaService.release(id);
        });
    }
    async cancel(id, req) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, async () => {
            return await this.agendaService.cancel(id);
        });
    }
    async expire(id, req) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, async () => {
            return await this.agendaService.expire(id);
        });
    }
};
exports.AgendaController = AgendaController;
__decorate([
    (0, common_1.Post)('reserve'),
    (0, permissions_decorator_1.Permissions)('agenda:read'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_1.CreateReservationDto, Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "reserve", null);
__decorate([
    (0, common_1.Put)(':id/reschedule'),
    (0, permissions_decorator_1.Permissions)('agenda:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_reservation_dto_1.RescheduleReservationDto, Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Patch)(':id/release'),
    (0, permissions_decorator_1.Permissions)('agenda:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "release", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('agenda:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/expire'),
    (0, permissions_decorator_1.Permissions)('agenda:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "expire", null);
exports.AgendaController = AgendaController = __decorate([
    (0, swagger_1.ApiTags)('Agenda'),
    (0, common_1.Controller)('agenda'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [agenda_service_1.AgendaService])
], AgendaController);
//# sourceMappingURL=agenda.controller.js.map