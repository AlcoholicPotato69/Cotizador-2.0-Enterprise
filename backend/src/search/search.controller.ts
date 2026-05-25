import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { GlobalSearchEngineService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { tenantContext } from '../prisma/tenant-context';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class SearchController {
  constructor(private readonly searchService: GlobalSearchEngineService) {}

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('read:search')
  @Permissions('search:read')
  async globalSearch(@Query('q') query: string) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) {
      throw new ForbiddenException('Tenant context required');
    }
    return this.searchService.globalSearch(query || '', ctx.tenantId);
  }
}
