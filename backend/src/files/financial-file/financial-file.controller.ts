import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FinancialFileService } from './financial-file.service';
import { CreateFinancialFileDto } from './financial-file.dto';
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

@ApiTags('Financial File')
@Controller('financial-files')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class FinancialFileController {
  constructor(private readonly service: FinancialFileService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('financial-files:write')
  async createFinancialFile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateFinancialFileDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.createFinancialFile(tenantId, dto);
  }

  @Get('invoice/:invoiceId')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('financial-files:read')
  async getFinancialFiles(
    @Req() req: AuthenticatedRequest,
    @Param('invoiceId') invoiceId: string,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.getFinancialFiles(tenantId, invoiceId);
  }
}
