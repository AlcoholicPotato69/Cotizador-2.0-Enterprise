import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CustomerCreditsService } from './customer-credits.service';
import { AddTransactionDto } from './dto/add-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Customer Credits')
@Controller('customer-credits')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class CustomerCreditsController {
  constructor(
    private readonly customerCreditsService: CustomerCreditsService,
  ) {}

  @Get(':clientId/balance')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('customer-credits:read')
  @Permissions('customer_credits:read')
  async getBalance(
    @CurrentUser() user: any,
    @Param('clientId') clientId: string,
  ) {
    return this.customerCreditsService.getBalance(user.tenantId, clientId);
  }

  @Post('transaction')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('customer-credits:write')
  @Permissions('customer_credits:write')
  async addTransaction(
    @CurrentUser() user: any,
    @Body() dto: AddTransactionDto,
  ) {
    return this.customerCreditsService.addTransaction(
      user.tenantId,
      dto,
      user.id,
    );
  }
}
