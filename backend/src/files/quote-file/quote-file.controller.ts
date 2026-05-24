import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { QuoteFileService } from './quote-file.service';
import { CreateQuoteFileDto } from './quote-file.dto';
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
@Controller('quote-files')
export class QuoteFileController {
  constructor(private readonly service: QuoteFileService) {}

  @Post()
  async createQuoteFile(@Req() req: AuthenticatedRequest, @Body() dto: CreateQuoteFileDto) {
    const tenantId = req.user.tenantId;
    return this.service.createQuoteFile(tenantId, dto);
  }

  @Get('quote/:quoteId')
  async getQuoteFiles(@Req() req: AuthenticatedRequest, @Param('quoteId') quoteId: string) {
    const tenantId = req.user.tenantId;
    return this.service.getQuoteFiles(tenantId, quoteId);
  }
}
