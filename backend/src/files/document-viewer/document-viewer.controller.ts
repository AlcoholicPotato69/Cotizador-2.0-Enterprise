import { Controller, Get, Query, Req, UseGuards, Res } from '@nestjs/common';
import { DocumentViewerService } from './document-viewer.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import type { Request } from 'express';
import { TenantIsolationGuard } from '../../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    permissions?: string[];
  };
}

const hasPermission = (
  permissions: string[] | undefined,
  permission: string,
): boolean => {
  if (!permissions?.length) {
    return false;
  }

  const dotNotation = permission.replace(/:/g, '.');
  const colonNotation = permission.replace(/\./g, ':');
  return permissions.includes(permission)
    || permissions.includes(dotNotation)
    || permissions.includes(colonNotation);
};

@ApiTags('Document Viewer')
@Controller('document-viewer')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class DocumentViewerController {
  constructor(private readonly service: DocumentViewerService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('generate-url')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('documents:share')
  generateSignedUrl(
    @Req() req: AuthenticatedRequest,
    @Query('entityType') entityType: string,
    @Query('fileId') fileId: string,
    @Query('expiresInMinutes') expiresInMinutes?: number,
  ) {
    const tenantId = req.user.tenantId;
    const url = this.service.generateSignedUrl(
      tenantId,
      entityType,
      fileId,
      expiresInMinutes ? Number(expiresInMinutes) : 60,
    );
    return { url };
  }

  @Get('view')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('files:read')
  async viewDocument(
    @Req() req: AuthenticatedRequest,
    @Query('tenantId') tenantId: string,
    @Query('entityType') entityType: string,
    @Query('fileId') fileId: string,
    @Query('expiresAt') expiresAt: string,
    @Query('signature') signature: string,
    @Res() res: { status: (code: number) => { send: (message: string) => void }; setHeader: (name: string, value: string) => void; redirect: (url: string) => void },
  ) {
    const canCrossTenantRead = hasPermission(
      req.user.permissions,
      'files.read.any_tenant',
    );

    if (!canCrossTenantRead && req.user.tenantId !== tenantId) {
      return res
        .status(403)
        .send('Forbidden: Cannot access documents from another tenant');
    }

    const document = await this.service.viewDocument(
      tenantId,
      entityType,
      fileId,
      Number(expiresAt),
      signature,
    );
    // Asegurar Content-Disposition para el visor del frontend
    res.setHeader(
      'Content-Disposition',
      `inline; filename="document-${fileId}.pdf"`,
    );
    // Redirecting to the actual S3/CDN URL
    return res.redirect(document.url);
  }
}
