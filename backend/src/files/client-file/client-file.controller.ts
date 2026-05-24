import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ClientFileService } from './client-file.service';
import { CreateClientFileDto, AddClientFileDocumentDto } from './client-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    email: string;
    permissions: string[];
  };
}

@UseGuards(JwtAuthGuard)
@Controller('client-files')
export class ClientFileController {
  constructor(private readonly service: ClientFileService) {}

  @Post()
  async createClientFile(@Req() req: AuthenticatedRequest, @Body() dto: CreateClientFileDto) {
    const tenantId = req.user.tenantId;
    return this.service.createClientFile(tenantId, dto);
  }

  @Get('client/:clientId')
  async getClientFiles(@Req() req: AuthenticatedRequest, @Param('clientId') clientId: string) {
    const tenantId = req.user.tenantId;
    return this.service.getClientFiles(tenantId, clientId);
  }

  @Post(':id/documents')
  async addDocument(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddClientFileDocumentDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.addDocument(tenantId, id, dto);
  }
}
