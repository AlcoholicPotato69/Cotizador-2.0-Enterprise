import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuoteFileService } from './quote-file.service';
import { CreateQuoteFileDto } from './quote-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { TenantIsolationGuard } from '../../auth/guards/tenant-isolation.guard';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    email: string;
    permissions: string[];
  };
}

@ApiTags('Quote File')
@Controller('quote-files')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class QuoteFileController {
  constructor(private readonly service: QuoteFileService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('quote-files:write')
  async createQuoteFile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateQuoteFileDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.createQuoteFile(tenantId, dto);
  }

  @Get('quote/:quoteId')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('quote-files:read')
  async getQuoteFiles(
    @Req() req: AuthenticatedRequest,
    @Param('quoteId') quoteId: string,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.getQuoteFiles(tenantId, quoteId);
  }
}
