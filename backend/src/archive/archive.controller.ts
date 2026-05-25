import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ArchiveEngineService } from './archive.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Archive')
@Controller('archive')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveEngineService) {}

  @Post('entity/:model/:id')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('write:archive')
  @Permissions('archive:read')
  async archiveEntity(
    @Param('model') model: 'Client' | 'Contract' | 'Quote' | 'Document',
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const archivedBy = req.user?.id || 'admin';
    return this.archiveService.archiveEntity(model, id, archivedBy);
  }

  @Post('simulate-retention')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('write:archive')
  @Permissions('archive:read')
  async simulateRetention() {
    await this.archiveService.applyRetentionPolicies();
    return { success: true };
  }
}
