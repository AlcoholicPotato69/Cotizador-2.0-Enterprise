const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src');

const controllerTemplate = (mod) => {
  const modCamel = mod.replace(/-([a-z])/g, g => g[1].toUpperCase());
  const modPascal = modCamel.charAt(0).toUpperCase() + modCamel.slice(1);
  const isStorage = mod === 'storage';
  const isSignatures = mod === 'signatures';
  const isFeatureFlags = mod === 'feature-flags';

  if (isStorage) {
    return `import { Controller, Post, Get, Delete, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { TenantContextService } from '../common/tenant-context.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: any, @Body('fileName') fileName: string) {
    const tenantId = this.tenantContext.getTenantId();
    // Use buffer if file exists, else use dummy data
    const url = await this.storageService.uploadFile(tenantId, file?.buffer || Buffer.from(''), fileName || 'default.txt');
    return { url };
  }

  @Get('url/:path')
  async getUrl(@Param('path') path: string) {
    const tenantId = this.tenantContext.getTenantId();
    const url = await this.storageService.getFileUrl(tenantId, path);
    return { url };
  }

  @Delete(':path')
  async delete(@Param('path') path: string) {
    const tenantId = this.tenantContext.getTenantId();
    await this.storageService.deleteFile(tenantId, path);
    return { success: true };
  }
}
`;
  }

  if (isSignatures) {
    return `import { Controller, Post, Body, Param } from '@nestjs/common';
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
`;
  }

  if (isFeatureFlags) {
    return `import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
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
`;
  }

  return `import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ${modPascal}Service } from './${mod}.service';
import { TenantContextService } from '../common/tenant-context.service';

@Controller('${mod}')
export class ${modPascal}Controller {
  constructor(
    private readonly ${modCamel}Service: ${modPascal}Service,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post()
  create(@Body() createDto: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.${modCamel}Service.create(tenantId, createDto);
  }

  @Get()
  findAll() {
    const tenantId = this.tenantContext.getTenantId();
    return this.${modCamel}Service.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.${modCamel}Service.findOne(tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    const tenantId = this.tenantContext.getTenantId();
    return this.${modCamel}Service.updateStatus(tenantId, id, status);
  }
}
`;
};

const write = (mod) => fs.writeFileSync(path.join(basePath, mod, mod + '.controller.ts'), controllerTemplate(mod));

['quotes', 'contracts', 'signatures', 'invoices', 'payments', 'feature-flags', 'storage'].forEach(write);

console.log('Controllers generated.');
