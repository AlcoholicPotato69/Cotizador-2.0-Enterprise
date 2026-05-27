import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
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

@ApiTags('Catalog')
@Controller('catalog')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('catalog:write')
  async createItem(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCatalogItemDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.createItem(dto),
    );
  }
}
