"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const tenants_module_1 = require("./tenants/tenants.module");
const rbac_module_1 = require("./rbac/rbac.module");
const settings_module_1 = require("./settings/settings.module");
const audit_module_1 = require("./audit/audit.module");
const snapshots_module_1 = require("./snapshots/snapshots.module");
const approvals_module_1 = require("./approvals/approvals.module");
const clients_module_1 = require("./clients/clients.module");
const documents_module_1 = require("./documents/documents.module");
const prisma_module_1 = require("./prisma/prisma.module");
const quotes_module_1 = require("./quotes/quotes.module");
const contracts_module_1 = require("./contracts/contracts.module");
const signatures_module_1 = require("./signatures/signatures.module");
const invoices_module_1 = require("./invoices/invoices.module");
const payments_module_1 = require("./payments/payments.module");
const feature_flags_module_1 = require("./feature-flags/feature-flags.module");
const storage_module_1 = require("./storage/storage.module");
const health_module_1 = require("./health/health.module");
const common_module_1 = require("./common/common.module");
const pricing_module_1 = require("./pricing/pricing.module");
const spaces_module_1 = require("./spaces/spaces.module");
const schedule_1 = require("@nestjs/schedule");
const compliance_module_1 = require("./compliance/compliance.module");
const scheduler_module_1 = require("./common/scheduler/scheduler.module");
const files_module_1 = require("./files/files.module");
const event_emitter_1 = require("@nestjs/event-emitter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: true,
                delimiter: '.',
            }),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            rbac_module_1.RbacModule,
            settings_module_1.SettingsModule,
            audit_module_1.AuditModule,
            snapshots_module_1.SnapshotsModule,
            approvals_module_1.ApprovalsModule,
            clients_module_1.ClientsModule,
            documents_module_1.DocumentsModule,
            prisma_module_1.PrismaModule,
            quotes_module_1.QuotesModule,
            contracts_module_1.ContractsModule,
            signatures_module_1.SignaturesModule,
            invoices_module_1.InvoicesModule,
            payments_module_1.PaymentsModule,
            feature_flags_module_1.FeatureFlagsModule,
            storage_module_1.StorageModule,
            health_module_1.HealthModule,
            pricing_module_1.PricingModule,
            spaces_module_1.SpacesModule,
            compliance_module_1.ComplianceModule,
            files_module_1.FilesModule,
            schedule_1.ScheduleModule.forRoot(),
            scheduler_module_1.SchedulerWorkerModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map