import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AgreementFileService } from './agreement-file.service';
import { CreateAgreementFileDto } from './agreement-file.dto';

@ApiTags('Agreement File')
@Controller('agreement-files')
export class AgreementFileController {
  constructor(private readonly agreementFileService: AgreementFileService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createAgreementFile(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateAgreementFileDto,
  ) {
    if (!tenantId) throw new UnauthorizedException('Tenant ID is required');
    return this.agreementFileService.createAgreementFile(tenantId, dto);
  }

  @Get('agreement/:agreementId')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAgreementFiles(
    @Headers('x-tenant-id') tenantId: string,
    @Param('agreementId') agreementId: string,
  ) {
    if (!tenantId) throw new UnauthorizedException('Tenant ID is required');
    return this.agreementFileService.getAgreementFiles(tenantId, agreementId);
  }
}
