import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Agreements')
@Controller('agreements')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agreements:create')
  async create(@CurrentUser() user: any, @Body() dto: CreateAgreementDto) {
    return this.agreementsService.create(user.tenantId, dto, user.id);
  }

  @Put(':id/submit-review')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agreements:write')
  async submitForReview(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agreementsService.submitForReview(user.tenantId, id, user.id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agreements:approve')
  async approve(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agreementsService.approve(user.tenantId, id, user.id);
  }

  @Put(':id/generate-letter')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agreements:write')
  async generateLetter(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('versionId') versionId: string,
  ) {
    return this.agreementsService.generateLetter(user.tenantId, id, versionId);
  }

  @Put(':id/pending-signature')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agreements:write')
  async pendingSignature(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agreementsService.pendingSignature(user.tenantId, id);
  }

  @Put(':id/sign')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agreements:write')
  async markAsSigned(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('signatureId') signatureId: string,
  ) {
    return this.agreementsService.markAsSigned(user.tenantId, id, signatureId);
  }
}
