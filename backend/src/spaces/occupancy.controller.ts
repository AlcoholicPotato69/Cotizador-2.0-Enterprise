import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OccupancyService } from './occupancy.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { tenantContext } from '../prisma/tenant-context';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: string; tenantId: string; role: string; permissions: string[] };
}

@ApiTags('Occupancy')
@Controller('occupancy')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class OccupancyController {
  constructor(private readonly occupancyService: OccupancyService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('occupancy:write')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() data: Omit<Prisma.SpaceOccupancyUncheckedCreateInput, 'tenantId'>,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.occupancyService.createOccupancy(data),
    );
  }
}
