import { Injectable, ForbiddenException } from '@nestjs/common';

export interface Document {
  legalHold: boolean;
  retentionUntil: Date | null;
}

@Injectable()
export class DocumentPolicyService {
  
  canDelete(document: Document): boolean {
    if (document.legalHold) {
      throw new ForbiddenException('POLICY_ERROR: El documento está sujeto a Retención Legal (Legal Hold). Borrado lógico y físico bloqueado.');
    }
    return true;
  }

  canArchive(document: Document): boolean {
    // El archivado solo mueve el tier de almacenamiento. Permitido por defecto si pasa filtros básicos.
    return true;
  }

  canPurge(document: Document): boolean {
    // Para destrucción definitiva
    this.canDelete(document); // Valida Legal Hold primero
    
    if (document.retentionUntil && new Date() < document.retentionUntil) {
      throw new ForbiddenException(`POLICY_ERROR: Periodo de retención legal activo hasta ${document.retentionUntil.toISOString()}`);
    }
    
    return true;
  }
}
