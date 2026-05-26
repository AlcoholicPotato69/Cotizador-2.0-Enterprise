import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ContractEngineService } from './contract.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';

@ApiTags('Contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class ContractsController {
  constructor(private readonly service: ContractEngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create contract from quote context' })
  @ApiResponse({ status: 201, description: 'Contract created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Permissions('contracts:write')
  async createContract(
    @Body() body: { clientId: string; quoteId: string; currencyCode?: string },
  ) {
    const id = await this.service.createContract({
      clientId: body.clientId,
      quoteId: body.quoteId,
      currencyCode: body.currencyCode || 'MXN',
    });

    return this.service.getContract(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('contracts:read')
  async getContract(@Param('id') id: string) {
    return this.service.getContract(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts for the current tenant' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Permissions('contracts:read')
  async getContracts() {
    return this.service.findAll();
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update contract status' })
  @ApiResponse({ status: 200, description: 'Contract status updated' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Permissions('contracts:write')
  async updateContractStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const normalizedStatus = status?.toUpperCase();
    if (
      !normalizedStatus
      || !Object.prototype.hasOwnProperty.call(ContractStatus, normalizedStatus)
    ) {
      throw new BadRequestException(`Unsupported status: ${status}`);
    }

    return this.service.updateContractStatus(
      id,
      ContractStatus[normalizedStatus as keyof typeof ContractStatus],
    );
  }
}
