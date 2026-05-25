import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WorkflowEngineService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async executeTransition(
    tenantId: string,
    workflowVersionId: string,
    currentStateId: string,
    actionName: string,
    contextPayload: any,
  ) {
    // 1. Buscar si existe una transición válida
    const transition = await this.prisma.workflowTransition.findFirst({
      where: {
        tenantId,
        workflowVersionId,
        sourceStateId: currentStateId,
        actionName: actionName,
      },
    });

    if (!transition) {
      throw new BadRequestException(
        `Acción ${actionName} no válida para el estado actual.`,
      );
    }

    // 2. Disparar Eventos Asíncronos (Hooks) si es necesario
    // if (transition.hookToTrigger) ...

    return transition.targetStateId;
  }

  private evaluateConditions(conditions: any, context: any): boolean {
    // Aquí podemos integrar librerías de reglas como 'json-rules-engine'
    return true;
  }
}
