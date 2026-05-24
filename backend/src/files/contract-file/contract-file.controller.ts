import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ContractFileService } from './contract-file.service';
import { CreateContractFileDto } from './contract-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    role: string;
    email: string;
    permissions: string[];
  };
}

@UseGuards(JwtAuthGuard)
@Controller('contract-files')
export class ContractFileController {
  constructor(private readonly service: ContractFileService) {}

  @Post()
  async createContractFile(@Req() req: AuthenticatedRequest, @Body() dto: CreateContractFileDto) {
    const tenantId = req.user.tenantId;
    return this.service.createContractFile(tenantId, dto);
  }

  @Get('contract/:contractId')
  async getContractFiles(@Req() req: AuthenticatedRequest, @Param('contractId') contractId: string) {
    const tenantId = req.user.tenantId;
    return this.service.getContractFiles(tenantId, contractId);
  }
}
