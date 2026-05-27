import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Prisma, QuoteStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { tenantContext } from '../prisma/tenant-context';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    permissions: string[];
  };
}

/**
 * Controller responsible for managing Quote entities.
 * Enforces tenant isolation, JWT authentication, and RBAC permissions.
 *
 * @class QuotesController
 */
@ApiTags('Quotes')
@Controller('quotes')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class QuotesController {
  constructor(private readonly service: QuotesService) {}

  /**
   * Creates a new quote within the user's tenant context.
   *
   * @param {AuthenticatedRequest} req - The HTTP request with authenticated user context.
   * @param {Record<string, unknown>} body - The quote payload.
   * @returns {Promise<any>} The newly created quote object.
   */
  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('quotes:write')
  async createQuote(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateQuoteDto,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.create(body as any),
    );
  }

  /**
   * Updates the status of an existing quote, validating Finite State Machine (FSM) rules.
   *
   * @param {AuthenticatedRequest} req - The HTTP request with authenticated user context.
   * @param {string} id - The unique identifier of the quote.
   * @param {QuoteStatus} status - The target status to transition to.
   * @returns {Promise<any>} The updated quote object.
   */
  @Put(':id/status')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('quotes:write')
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('status') status: QuoteStatus,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.updateStatus(id, status),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all quotes for the current tenant' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Permissions('quotes:read')
  async getQuotes(@Req() req: AuthenticatedRequest) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.findAll(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quote by ID' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Permissions('quotes:read')
  async getQuote(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.findById(id),
    );
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Get quote items' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Permissions('quotes:read')
  async getQuoteItems(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.getQuoteItems(id),
    );
  }
}
