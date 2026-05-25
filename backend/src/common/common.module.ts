import { Module, Global } from '@nestjs/common';
import { DomainEventPublisher } from './events/domain-event-publisher';
import { FsmValidator } from './fsm.validator';
import { OutboxModule } from './outbox/outbox.module';
import { InboxModule } from './inbox/inbox.module';
import { JobsModule } from './jobs/jobs.module';

@Global()
@Module({
  imports: [OutboxModule, InboxModule, JobsModule],
  providers: [DomainEventPublisher, FsmValidator],
  exports: [
    DomainEventPublisher,
    FsmValidator,
    OutboxModule,
    InboxModule,
    JobsModule,
  ],
})
export class CommonModule {}
