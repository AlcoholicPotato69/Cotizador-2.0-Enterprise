import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector /*, private prisma: PrismaService*/) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.tenantId;

    if (!user || !tenantId) {
      throw new ForbiddenException('No user or tenant in context');
    }

    // Logic to query real permissions
    /*
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.sub },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } }
        }
      }
    });

    const userPermissions = userRoles.flatMap(ur => 
      ur.role.permissions.map(rp => rp.permission.action)
    );

    const hasPermission = requiredPermissions.every(rp => userPermissions.includes(rp));
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
    */

    return true; // Si cumple, pasa.
  }
}
