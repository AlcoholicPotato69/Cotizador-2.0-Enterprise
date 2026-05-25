import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientFileService } from './client-file.service';
import {
  CreateClientFileDto,
  AddClientFileDocumentDto,
} from './client-file.dto';
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

@ApiTags('Client File')
@Controller('client-files')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class ClientFileController {
  constructor(private readonly service: ClientFileService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('client-files:write')
  async createClientFile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateClientFileDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.createClientFile(tenantId, dto);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('client-files:read')
  async getClientFiles(
    @Req() req: AuthenticatedRequest,
    @Param('clientId') clientId: string,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.getClientFiles(tenantId, clientId);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('client-files:write')
  async addDocument(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddClientFileDocumentDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.addDocument(tenantId, id, dto);
  }
}
