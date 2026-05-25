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
const agreements_module_1 = require("./agreements/agreements.module");
const customer_credits_module_1 = require("./customer-credits/customer-credits.module");
const receipts_module_1 = require("./receipts/receipts.module");
const reviews_module_1 = require("./reviews/reviews.module");
const catalog_module_1 = require("./catalog/catalog.module");
const templates_module_1 = require("./templates/templates.module");
const regulations_module_1 = require("./regulations/regulations.module");
const workflow_module_1 = require("./workflows/workflow.module");
const search_module_1 = require("./search/search.module");
const archive_module_1 = require("./archive/archive.module");
const numbering_module_1 = require("./numbering/numbering.module");
const config_1 = require("@nestjs/config");
const env_validation_1 = require("./config/env.validation");
const pdf_module_1 = require("./pdf/pdf.module");
const reports_module_1 = require("./reports/reports.module");
const notifications_module_1 = require("./notifications/notifications.module");
const agenda_module_1 = require("./agenda/agenda.module");
const tenant_context_interceptor_1 = require("./common/interceptors/tenant-context.interceptor");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                validate: env_validation_1.validate,
                isGlobal: true,
            }),
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
            scheduler_module_1.SchedulerWorkerModule,
            agreements_module_1.AgreementsModule,
            customer_credits_module_1.CustomerCreditsModule,
            receipts_module_1.ReceiptsModule,
            reviews_module_1.ReviewsModule,
            catalog_module_1.CatalogModule,
            templates_module_1.TemplatesModule,
            regulations_module_1.RegulationsModule,
            workflow_module_1.WorkflowsModule,
            search_module_1.SearchModule,
            archive_module_1.ArchiveModule,
            numbering_module_1.NumberingModule,
            pdf_module_1.PdfModule,
            reports_module_1.ReportsModule,
            notifications_module_1.NotificationsModule,
            agenda_module_1.AgendaModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: tenant_context_interceptor_1.TenantContextInterceptor,
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map