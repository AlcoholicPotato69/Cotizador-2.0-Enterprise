import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post()
  create(@Body() body: { featureKey: string; enabled: boolean; rolloutPercentage: number }) {
    const tenantId = this.tenantContext.getTenantId();
    return this.featureFlagsService.create(tenantId, body.featureKey, body.enabled, body.rolloutPercentage);
  }

  @Get(':featureKey/enabled')
  async isEnabled(@Param('featureKey') featureKey: string) {
    const tenantId = this.tenantContext.getTenantId();
    const enabled = await this.featureFlagsService.isEnabled(tenantId, featureKey);
    return { enabled };
  }

  @Patch(':featureKey/toggle')
  toggle(@Param('featureKey') featureKey: string, @Body('enabled') enabled: boolean) {
    const tenantId = this.tenantContext.getTenantId();
    return this.featureFlagsService.toggleFlag(tenantId, featureKey, enabled);
  }
}
