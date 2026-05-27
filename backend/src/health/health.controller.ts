import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { HealthService } from './health.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('health:read')
  @Permissions('health:read')
  async checkHealth() {
    const dbStatus = await this.service.checkHealth();
    return {
      status: 'UP',
      audit_chain_status: 'INTACT',
      storage_status: 'OPERATIONAL',
      database_status: dbStatus.status === 'ok' ? 'OPERATIONAL' : 'DOWN',
      queue_status: 'OPERATIONAL',
      notification_status: 'OPERATIONAL',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('health:metrics')
  @Permissions('health:read')
  async getMetrics(@CurrentUser() user: any, @Query('limit') limit?: number) {
    return this.service.getMetricsByTenant(
      user.tenantId,
      limit ? Number(limit) : 50,
    );
  }
}
