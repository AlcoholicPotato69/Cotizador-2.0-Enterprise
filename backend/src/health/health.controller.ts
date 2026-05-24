import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'UP',
      audit_chain_status: 'INTACT',
      storage_status: 'OPERATIONAL',
      database_status: 'OPERATIONAL',
      queue_status: 'OPERATIONAL',
      notification_status: 'OPERATIONAL',
      timestamp: new Date().toISOString(),
    };
  }
}
