import { Global, Module } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { DomainEventPublisher } from './domain-event.publisher';
import { AuditEventPublisher } from './audit-event.publisher';

@Global()
@Module({
  providers: [TenantContextService, DomainEventPublisher, AuditEventPublisher],
  exports: [TenantContextService, DomainEventPublisher, AuditEventPublisher],
})
export class CommonModule {}
