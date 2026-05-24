import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post()
  create(@Body() createDto: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.paymentsService.create(tenantId, createDto);
  }

  @Get()
  findAll() {
    const tenantId = this.tenantContext.getTenantId();
    return this.paymentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.paymentsService.findOne(tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.paymentsService.updateStatus(tenantId, id, status);
  }
}
