import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContractFileService } from './contract-file.service';
import { CreateContractFileDto } from './contract-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { TenantIsolationGuard } from '../../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    email: string;
    permissions: string[];
  };
}

@ApiTags('Contract File')
@Controller('contract-files')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class ContractFileController {
  constructor(private readonly service: ContractFileService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('contract-files:write')
  async createContractFile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateContractFileDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.createContractFile(tenantId, dto);
  }

  @Get('contract/:contractId')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('contract-files:read')
  async getContractFiles(
    @Req() req: AuthenticatedRequest,
    @Param('contractId') contractId: string,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.getContractFiles(tenantId, contractId);
  }
}
