import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Prisma, QuoteStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Request } from 'express';
import { tenantContext } from '../prisma/tenant-context';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    @Body() body: Record<string, unknown>,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      () => this.service.create(body as Prisma.QuoteUncheckedCreateInput),
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
}
