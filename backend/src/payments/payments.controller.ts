import { Controller, Post, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { SubmitPaymentDto, RejectPaymentDto } from './payments.service';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('submit')
  @RequirePermissions('payments.create')
  async submitPayment(@Body() dto: SubmitPaymentDto) {
    const id = await this.service.submitPayment(dto);
    return { id };
  }

  @Post(':id/approve')
  @HttpCode(200)
  @RequirePermissions('payments.approve')
  async approvePayment(@Param('id') id: string) {
    await this.service.approvePayment(id);
    return { success: true };
  }

  @Post(':id/reject')
  @HttpCode(200)
  @RequirePermissions('payments.reject')
  async rejectPayment(@Param('id') id: string, @Body() dto: { rejectionReason: string }) {
    await this.service.rejectPayment({ paymentId: id, rejectionReason: dto.rejectionReason });
    return { success: true };
  }
}
