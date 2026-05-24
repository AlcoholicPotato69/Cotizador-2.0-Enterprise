"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("./tenant-context.service");
const domain_event_publisher_1 = require("./domain-event.publisher");
const audit_event_publisher_1 = require("./audit-event.publisher");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [tenant_context_service_1.TenantContextService, domain_event_publisher_1.DomainEventPublisher, audit_event_publisher_1.AuditEventPublisher],
        exports: [tenant_context_service_1.TenantContextService, domain_event_publisher_1.DomainEventPublisher, audit_event_publisher_1.AuditEventPublisher],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map