import { Controller, Post, Get, Delete, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
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
