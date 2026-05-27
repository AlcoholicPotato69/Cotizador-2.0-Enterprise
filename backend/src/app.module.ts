import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { RbacModule } from './rbac/rbac.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ClientsModule } from './clients/clients.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuotesModule } from './quotes/quotes.module';
import { ContractsModule } from './contracts/contracts.module';
import { SignaturesModule } from './signatures/signatures.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';

import { PricingModule } from './pricing/pricing.module';
import { SpacesModule } from './spaces/spaces.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ComplianceModule } from './compliance/compliance.module';
import { SchedulerWorkerModule } from './common/scheduler/scheduler.module';
import { FilesModule } from './files/files.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { AgreementsModule } from './agreements/agreements.module';
import { CustomerCreditsModule } from './customer-credits/customer-credits.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { ReviewsModule } from './reviews/reviews.module';

import { CatalogModule } from './catalog/catalog.module';
import { TemplatesModule } from './templates/templates.module';
import { RegulationsModule } from './regulations/regulations.module';
import { WorkflowsModule } from './workflows/workflow.module';
import { SearchModule } from './search/search.module';
import { ArchiveModule } from './archive/archive.module';
import { NumberingModule } from './numbering/numbering.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { PdfModule } from './pdf/pdf.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AgendaModule } from './agenda/agenda.module';

import { TenantContextInterceptor } from './common/interceptors/tenant-context.interceptor';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { TenantIsolationGuard } from './auth/guards/tenant-isolation.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardModule } from './dashboard/dashboard.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api/{*splat}'],
    }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    CommonModule,
    AuthModule,
    TenantsModule,
    RbacModule,
    SettingsModule,
    AuditModule,
    SnapshotsModule,
    ApprovalsModule,
    ClientsModule,
    DocumentsModule,
    PrismaModule,
    QuotesModule,
    ContractsModule,
    SignaturesModule,
    InvoicesModule,
    PaymentsModule,
    FeatureFlagsModule,
    StorageModule,
    HealthModule,
    PricingModule,
    SpacesModule,
    ComplianceModule,
    FilesModule,
    ScheduleModule.forRoot(),
    SchedulerWorkerModule,
    AgreementsModule,
    CustomerCreditsModule,
    ReceiptsModule,
    ReviewsModule,
    CatalogModule,
    TemplatesModule,
    RegulationsModule,
    WorkflowsModule,
    SearchModule,
    ArchiveModule,
    NumberingModule,
    PdfModule,
    ReportsModule,
    NotificationsModule,
    AgendaModule,
    DashboardModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantIsolationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },
  ],
})
export class AppModule {}
