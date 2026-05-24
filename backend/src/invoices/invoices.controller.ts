import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post()
  create(@Body() createDto: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.invoicesService.create(tenantId, createDto);
  }

  @Get()
  findAll() {
    const tenantId = this.tenantContext.getTenantId();
    return this.invoicesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.invoicesService.findOne(tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.invoicesService.updateStatus(tenantId, id, status);
  }
}
