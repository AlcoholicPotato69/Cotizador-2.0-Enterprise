import { Controller, Get, Query, Req, UseGuards, Res } from '@nestjs/common';
import { DocumentViewerService } from './document-viewer.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    email: string;
    permissions: string[];
  };
}

@Controller('document-viewer')
export class DocumentViewerController {
  constructor(private readonly service: DocumentViewerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate-url')
  generateSignedUrl(
    @Req() req: AuthenticatedRequest,
    @Query('entityType') entityType: string,
    @Query('fileId') fileId: string,
    @Query('expiresInMinutes') expiresInMinutes?: number,
  ) {
    const tenantId = req.user.tenantId;
    const url = this.service.generateSignedUrl(tenantId, entityType, fileId, expiresInMinutes ? Number(expiresInMinutes) : 60);
    return { url };
  }

  @Get('view')
  async viewDocument(
    @Query('tenantId') tenantId: string,
    @Query('entityType') entityType: string,
    @Query('fileId') fileId: string,
    @Query('expiresAt') expiresAt: string,
    @Query('signature') signature: string,
    @Res() res: any,
  ) {
    const document = await this.service.viewDocument(tenantId, entityType, fileId, Number(expiresAt), signature);
    // Redirecting to the actual S3/CDN URL
    return res.redirect(document.url);
  }
}
