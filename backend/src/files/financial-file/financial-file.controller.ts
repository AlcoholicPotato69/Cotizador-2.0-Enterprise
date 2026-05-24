import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { FinancialFileService } from './financial-file.service';
import { CreateFinancialFileDto } from './financial-file.dto';
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
@Controller('financial-files')
export class FinancialFileController {
  constructor(private readonly service: FinancialFileService) {}

  @Post()
  async createFinancialFile(@Req() req: AuthenticatedRequest, @Body() dto: CreateFinancialFileDto) {
    const tenantId = req.user.tenantId;
    return this.service.createFinancialFile(tenantId, dto);
  }

  @Get('invoice/:invoiceId')
  async getFinancialFiles(@Req() req: AuthenticatedRequest, @Param('invoiceId') invoiceId: string) {
    const tenantId = req.user.tenantId;
    return this.service.getFinancialFiles(tenantId, invoiceId);
  }
}
