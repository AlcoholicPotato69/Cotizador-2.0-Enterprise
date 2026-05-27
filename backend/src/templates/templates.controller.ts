import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, CreateClauseDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { tenantContext } from '../prisma/tenant-context';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
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

@ApiTags('Templates')
@Controller('templates')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('templates:write')
  async createTemplate(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTemplateDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.createTemplate(dto),
    );
  }

  @Post('clauses')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('templates:write')
  async createClause(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateClauseDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.createClause(dto),
    );
  }
}
