import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { SubmitPaymentDto, RejectPaymentDto } from './payments.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('payments:create')
  async submitPayment(@Body() dto: SubmitPaymentDto) {
    const id = await this.service.submitPayment(dto);
    return { id };
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HttpCode(200)
  @Permissions('payments:approve')
  async approvePayment(@Param('id') id: string) {
    await this.service.approvePayment(id);
    return { success: true };
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HttpCode(200)
  @Permissions('payments:reject')
  async rejectPayment(
    @Param('id') id: string,
    @Body() dto: { rejectionReason: string },
  ) {
    await this.service.rejectPayment({
      paymentId: id,
      rejectionReason: dto.rejectionReason,
    });
    return { success: true };
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HttpCode(200)
  @Permissions('payments:refund')
  async refundPayment(
    @Param('id') id: string,
    @Body() dto: { refundReason: string },
  ) {
    await this.service.refundPayment({
      paymentId: id,
      refundReason: dto.refundReason,
    });
    return { success: true };
  }
}
