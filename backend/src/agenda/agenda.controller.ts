import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RescheduleReservationDto } from './dto/reschedule-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { tenantContext } from '../prisma/tenant-context';
import { ApiTags , ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Agenda')
@Controller('agenda')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get()
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agenda:read')
  async findAll(@Req() req: any) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        return await this.agendaService.findAll();
      },
    );
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agenda:read')
  async reserve(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: any,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        return await this.agendaService.reserve(createReservationDto);
      },
    );
  }

  @Put(':id/reschedule')
  @ApiOperation({ summary: 'Execute Put operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agenda:read')
  async reschedule(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleReservationDto,
    @Req() req: any,
  ) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        return await this.agendaService.reschedule(id, rescheduleDto);
      },
    );
  }

  @Patch(':id/release')
  @ApiOperation({ summary: 'Execute Patch operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agenda:read')
  async release(@Param('id') id: string, @Req() req: any) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        return await this.agendaService.release(id);
      },
    );
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Execute Patch operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agenda:read')
  async cancel(@Param('id') id: string, @Req() req: any) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        return await this.agendaService.cancel(id);
      },
    );
  }

  @Patch(':id/expire')
  @ApiOperation({ summary: 'Execute Patch operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('agenda:read')
  async expire(@Param('id') id: string, @Req() req: any) {
    return tenantContext.run(
      { tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role },
      async () => {
        return await this.agendaService.expire(id);
      },
    );
  }
}
