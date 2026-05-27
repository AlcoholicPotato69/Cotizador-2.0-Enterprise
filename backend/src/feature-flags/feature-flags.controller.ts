import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Feature Flags')
@Controller('feature-flags')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class FeatureFlagsController {
  constructor(private readonly service: FeatureFlagsService) {}

  @Get(':key')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('feature_flags:read')
  async getFeatureFlag(@Param('key') key: string) {
    return this.service.getFeatureFlag(key);
  }
}
