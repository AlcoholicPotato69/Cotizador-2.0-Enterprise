import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Receipts')
@Controller('receipts')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post('generate/payment/:paymentId')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('reports:generate')
  async generateForPayment(
    @CurrentUser() user: any,
    @Param('paymentId') paymentId: string,
  ) {
    return this.receiptsService.generateReceiptForPayment(
      user.tenantId,
      paymentId,
    );
  }
}
