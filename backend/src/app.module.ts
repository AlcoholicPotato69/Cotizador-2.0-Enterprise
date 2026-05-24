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

@Module({
  imports: [
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
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
