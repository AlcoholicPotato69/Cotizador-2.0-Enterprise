"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerWorkerModule = void 0;
const common_1 = require("@nestjs/common");
const scheduler_service_1 = require("./scheduler.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const compliance_module_1 = require("../../compliance/compliance.module");
let SchedulerWorkerModule = class SchedulerWorkerModule {
};
exports.SchedulerWorkerModule = SchedulerWorkerModule;
exports.SchedulerWorkerModule = SchedulerWorkerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, compliance_module_1.ComplianceModule],
        providers: [scheduler_service_1.SchedulerService],
    })
], SchedulerWorkerModule);
//# sourceMappingURL=scheduler.module.js.map