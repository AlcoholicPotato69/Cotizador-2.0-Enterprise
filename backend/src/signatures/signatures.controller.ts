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
import { SignaturesService } from './signatures.service';
import { SignContractDto } from './dto/sign-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Signatures')
@Controller('signatures')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class SignaturesController {
  constructor(private readonly service: SignaturesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('signatures:read')
  async getSignature(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.getSignature(id, user.tenantId);
  }

  @Post('sign')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('signatures:write')
  async signContract(@Body() dto: SignContractDto) {
    return this.service.signContract(dto);
  }
}
