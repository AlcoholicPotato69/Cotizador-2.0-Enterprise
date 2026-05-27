import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService, GenerateInvoiceDto } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get('report')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('reports:view')
  async getInvoiceReport() {
    return this.service.getInvoiceReport();
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  @Permissions('invoices.read')
  async findAll() {
    return this.service.getInvoiceReport();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('invoices:read')
  async getInvoice(@Param('id') id: string) {
    return { id, message: 'Invoice endpoint available' };
  }

  @Post('generate')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('invoices:write')
  async generateInvoice(
    @Body() dto: GenerateInvoiceDto & { currencyCode: string },
  ) {
    return this.service.generateInvoice(dto);
  }

  @Post(':id/stamp')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('invoices:stamp')
  async stampInvoice(@Param('id') id: string) {
    return this.service.stampInvoice(id);
  }

  @Post(':id/upload-manual')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('invoices:stamp')
  async uploadManualInvoice(
    @Param('id') id: string,
    @Body() dto: { xmlUrl: string; pdfUrl: string },
  ) {
    return this.service.uploadManualInvoiceFiles(id, dto.xmlUrl, dto.pdfUrl);
  }
}
