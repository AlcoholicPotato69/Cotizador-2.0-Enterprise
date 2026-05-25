import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreateRbacDto } from './dto/create-rbac.dto';
import { UpdateRbacDto } from './dto/update-rbac.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Rbac')
@Controller('rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post()
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('rbac.manage')
  @Permissions('rbac:write')
  create(@Body() createRbacDto: CreateRbacDto) {
    return this.rbacService.create(createRbacDto);
  }

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('rbac.read')
  @Permissions('rbac:read')
  findAll() {
    return this.rbacService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('rbac.read')
  @Permissions('rbac:read')
  findOne(@Param('id') id: string) {
    return this.rbacService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Execute Patch operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('rbac.manage')
  @Permissions('rbac:write')
  update(@Param('id') id: string, @Body() updateRbacDto: UpdateRbacDto) {
    return this.rbacService.update(+id, updateRbacDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Execute Delete operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @RequirePermissions('rbac.manage')
  @Permissions('rbac:delete')
  remove(@Param('id') id: string) {
    return this.rbacService.remove(+id);
  }
}
