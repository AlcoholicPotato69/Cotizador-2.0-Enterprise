export interface CFDIRequest {
  rfc: string;
  subtotal: number;
  taxes: number;
  total: number;
  moneda: string;
  metodo_pago: string;
  uso_cfdi: string;
  pdf_file?: any;
  xml_file?: any;
}

export interface CFDIResponse {
  success: boolean;
  uuid?: string;
  serie?: string;
  folio?: string;
  error_code?: string;
  error_message?: string;
}

/**
 * CFDI Provider Abstraction (Configuration Over Code)
 * Interface base para inyectar Intelisis, Facturama o Manual
 */
export interface IInvoiceProvider {
  /**
   * Valida o emite una factura
   */
  processInvoice(request: CFDIRequest, financialSnapshot: any): Promise<CFDIResponse>;
}

/**
 * Proveedor para validación de CFDI cargados manualmente por usuarios.
 * Aplica Zero-Trust Validation contra el financial_snapshot del Contrato.
 */
export class ManualProvider implements IInvoiceProvider {
  
  public async processInvoice(request: CFDIRequest, financialSnapshot: any): Promise<CFDIResponse> {
    
    // Parse XML placeholder that would extract these from the file (UUID, RFC, Subtotal, etc.)
    // For this demonstration, we assume the `request` object contains the parsed XML data.
    
    const errors: string[] = [];
    
    // 1. Zero Trust: Validar RFC
    const expectedRFC = financialSnapshot.client_snapshot?.rfc;
    if (request.rfc !== expectedRFC) {
      errors.push(`RFC mismatch. Esperado: ${expectedRFC}, Recibido: ${request.rfc}`);
    }

    // 2. Zero Trust: Validar Subtotal
    // Se permite una tolerancia de 0.01 por redondeos
    const expectedSubtotal = financialSnapshot.pricing_snapshot?.subtotal || 0;
    if (Math.abs(request.subtotal - expectedSubtotal) > 0.01) {
      errors.push(`Subtotal mismatch. Esperado: ${expectedSubtotal}, Recibido: ${request.subtotal}`);
    }

    // 3. Zero Trust: Validar Total
    const expectedTotal = financialSnapshot.financial_total || 0; 
    if (Math.abs(request.total - expectedTotal) > 0.01) {
      errors.push(`Total mismatch. Esperado: ${expectedTotal}, Recibido: ${request.total}`);
    }

    // 4. Zero Trust: UUID Validation (Basic Regex for formatting)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!request.xml_file?.uuid || !uuidRegex.test(request.xml_file.uuid)) {
      errors.push("El UUID del XML es inválido o no se encontró.");
    }

    if (errors.length > 0) {
      return {
        success: false,
        error_code: 'VALIDATION_FAILED',
        error_message: errors.join(' | ')
      };
    }

    return {
      success: true,
      uuid: request.xml_file.uuid,
      serie: request.xml_file.serie || 'MANUAL',
      folio: request.xml_file.folio || '001'
    };
  }
}

/**
 * Mock para futura integración con Intelisis ERP
 */
export class IntelisisProvider implements IInvoiceProvider {
  public async processInvoice(_request: CFDIRequest, _financialSnapshot: any): Promise<CFDIResponse> {
    // Aquí iría la comunicación SOAP/REST contra el Web Service de Intelisis
    return {
      success: true,
      uuid: "INTELISIS-PENDING-UUID",
      error_message: "Not implemented yet. Standby for Intelisis phase."
    };
  }
}

/**
 * Mock para integración con Facturama API
 */
export class FacturamaProvider implements IInvoiceProvider {
  public async processInvoice(_request: CFDIRequest, _financialSnapshot: any): Promise<CFDIResponse> {
    // Aquí iría el payload REST hacia api.facturama.mx
    return {
      success: true,
      uuid: "FACTURAMA-PENDING-UUID",
      error_message: "Not implemented yet."
    };
  }
}

export class InvoiceProviderFactory {
  static getProvider(providerName: string): IInvoiceProvider {
    switch (providerName) {
      case 'intelisis':
        return new IntelisisProvider();
      case 'facturama':
        return new FacturamaProvider();
      case 'manual':
      default:
        return new ManualProvider();
    }
  }
}
