import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post()
  create(@Body() createDto: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.quotesService.create(tenantId, createDto);
  }

  @Get()
  findAll() {
    const tenantId = this.tenantContext.getTenantId();
    return this.quotesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.quotesService.findOne(tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.quotesService.updateStatus(tenantId, id, status);
  }
}
