import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreateRbacDto } from './dto/create-rbac.dto';
import { UpdateRbacDto } from './dto/update-rbac.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post()
  @RequirePermissions('rbac.manage')
  create(@Body() createRbacDto: CreateRbacDto) {
    return this.rbacService.create(createRbacDto);
  }

  @Get()
  @RequirePermissions('rbac.read')
  findAll() {
    return this.rbacService.findAll();
  }

  @Get(':id')
  @RequirePermissions('rbac.read')
  findOne(@Param('id') id: string) {
    return this.rbacService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('rbac.manage')
  update(@Param('id') id: string, @Body() updateRbacDto: UpdateRbacDto) {
    return this.rbacService.update(+id, updateRbacDto);
  }

  @Delete(':id')
  @RequirePermissions('rbac.manage')
  remove(@Param('id') id: string) {
    return this.rbacService.remove(+id);
  }
}
