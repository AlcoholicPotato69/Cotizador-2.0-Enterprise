import { Controller, Post, Body, Param } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('signatures')
export class SignaturesController {
  constructor(
    private readonly signaturesService: SignaturesService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post(':contractId/sign')
  async signContract(@Param('contractId') contractId: string, @Body() signatureData: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.signaturesService.signContract(tenantId, contractId, signatureData);
  }
}
