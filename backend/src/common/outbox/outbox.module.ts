import { Global, Module } from '@nestjs/common';
import { OutboxProcessorService } from './outbox-processor.service';

@Global()
@Module({
  providers: [OutboxProcessorService],
  exports: [OutboxProcessorService],
})
export class OutboxModule {}
