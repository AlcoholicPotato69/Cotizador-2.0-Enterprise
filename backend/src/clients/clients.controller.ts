import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { tenantContext } from '../prisma/tenant-context';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EligibilityEngineService, TransactionType } from './eligibility.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    permissions: string[];
  };
}

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly eligibilityService: EligibilityEngineService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('clients:write')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateClientDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.clientsService.create(data),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('clients:read')
  async findAll(@Req() req: AuthenticatedRequest) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.clientsService.findAll(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('clients:read')
  async findById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.clientsService.findById(id),
    );
  }

  @Get(':id/eligibility/:transactionType')
  @ApiOperation({ summary: 'Evaluate client eligibility for a transaction' })
  @ApiResponse({ status: 200, description: 'Eligibility evaluated' })
  @ApiResponse({ status: 400, description: 'Invalid transaction type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Permissions('clients:read')
  async evaluateEligibility(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('transactionType') transactionType: string,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        const normalized = transactionType.toUpperCase();
        if (!Object.prototype.hasOwnProperty.call(TransactionType, normalized)) {
          throw new BadRequestException(
            `Unsupported transactionType: ${transactionType}`,
          );
        }

        const targetTransaction = TransactionType[
          normalized as keyof typeof TransactionType
        ];

        try {
          await this.eligibilityService.evaluateEligibility(id, targetTransaction);
          return {
            clientId: id,
            transactionType: targetTransaction,
            eligible: true,
            reasons: [],
          };
        } catch (error) {
          if (!(error instanceof ForbiddenException)) {
            throw error;
          }

          const response = error.getResponse();
          const reason = typeof response === 'string'
            ? response
            : (response as { message?: string | string[] }).message;

          return {
            clientId: id,
            transactionType: targetTransaction,
            eligible: false,
            reasons: Array.isArray(reason)
              ? reason
              : [reason || 'Eligibility check failed'],
          };
        }
      },
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('clients:write')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateClientDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.clientsService.update(id, data),
    );
  }
}
