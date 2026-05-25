import { Global, Module } from '@nestjs/common';
import { PostgresJobQueueService } from './postgres-job.service';

@Global()
@Module({
  providers: [PostgresJobQueueService],
  exports: [PostgresJobQueueService],
})
export class JobsModule {}
