import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NumberingService } from './numbering.service';
import { GenerateFolioDto } from './dto/generate-folio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Numbering')
@Controller('numbering')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class NumberingController {
  constructor(private readonly numberingService: NumberingService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('numbering:generate')
  @Permissions('numbering:read')
  async generateFolio(@Body() dto: GenerateFolioDto) {
    const folio = await this.numberingService.generateFolio(dto);
    return { folio };
  }
}
