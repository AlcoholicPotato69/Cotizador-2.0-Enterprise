import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DomainEventPublisher } from './events/domain-event-publisher';
import { FsmValidator } from './fsm.validator';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [DomainEventPublisher, FsmValidator],
  exports: [DomainEventPublisher, EventEmitterModule, FsmValidator],
})
export class CommonModule {}
