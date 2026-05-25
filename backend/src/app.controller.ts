import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { TenantIsolationGuard } from './auth/guards/tenant-isolation.guard';
import { Permissions } from './auth/decorators/permissions.decorator';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('common:read')
  getHello(): string {
    return this.appService.getHello();
  }
}
