import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantContext } from '../../prisma/tenant-context';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // El usuario se asume que ha sido insertado en el request por el JwtAuthGuard
    const user = request.user || {};
    
    // Obtenemos el tenantId ya sea de los headers (para staff o system) o del JWT directamente
    const tenantId = request.headers['x-tenant-id'] || user.tenantId || '';
    const userId = user.id || '';
    const role = user.role || '';

    // Ejecutamos la solicitud dentro del contexto del AsyncLocalStorage
    return tenantContext.run({ tenantId, userId, role }, () => {
      return next.handle();
    });
  }
}
