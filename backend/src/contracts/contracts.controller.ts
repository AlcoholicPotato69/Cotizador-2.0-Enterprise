import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post()
  create(@Body() createDto: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.contractsService.create(tenantId, createDto);
  }

  @Get()
  findAll() {
    const tenantId = this.tenantContext.getTenantId();
    return this.contractsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.contractsService.findOne(tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.contractsService.updateStatus(tenantId, id, status);
  }
}
