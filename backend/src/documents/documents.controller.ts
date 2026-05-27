import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all documents' })
  @Permissions('admin.access')
  async findAll(@Req() req: any) {
    return this.prisma.document.findMany({
      where: { tenantId: req.user.tenantId }
    });
  }

  @Post('generate-pdf')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('documents:read')
  async generatePdf(
    @CurrentUser() user: any,
    @Body() dto: { documentId: string; templateId: string; data: any },
  ) {
    return this.documentsService.generatePdf(
      user.tenantId,
      dto.documentId,
      dto.templateId,
      dto.data,
    );
  }
}
