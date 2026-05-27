import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SpaceConfigurationService } from './space-configuration.service';
import {
  CreateSpaceConfigurationDto,
  CreateSpaceRuleDto,
} from './dto/create-configuration.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { tenantContext } from '../../prisma/tenant-context';
import { TenantIsolationGuard } from '../../auth/guards/tenant-isolation.guard';
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

@ApiTags('Space Configuration')
@Controller('space-configuration')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class SpaceConfigurationController {
  constructor(private readonly service: SpaceConfigurationService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('spaces:config:write')
  async setConfiguration(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateSpaceConfigurationDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.setConfiguration(dto),
    );
  }

  @Post('rules')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('spaces:rules:write')
  async createRule(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateSpaceRuleDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.createRule(dto),
    );
  }
}
