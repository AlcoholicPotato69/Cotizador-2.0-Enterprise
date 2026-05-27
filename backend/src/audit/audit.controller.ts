import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditRepository } from './audit.repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    email: string;
    permissions: string[];
  };
}

@ApiTags('Audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly auditRepo: AuditRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('audit.read')
  @Permissions('audit:read')
  async findAll(@Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;
    return this.auditRepo.findByTenantId(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('audit.read')
  @Permissions('audit:read')
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.auditRepo.findByIdAndTenant(tenantId, id);
  }
}
