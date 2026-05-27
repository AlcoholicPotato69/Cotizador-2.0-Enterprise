import { Controller, Sse, MessageEvent, Get, UseGuards, Req } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly prisma: PrismaService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(30000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
  @Permissions('schedule.view')
  async getEvents(@Req() req: any) {
    return this.prisma.calendarEvent.findMany({
      where: { tenantId: req.user.tenantId }
    });
  }
}
