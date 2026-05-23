/**
 * Contract Engine (V2 - Configuration Driven)
 * 
 * Genera el documento final vinculante.
 * Elimina las plantillas hardcodeadas.
 * Solo consume plantillas versionadas de la base de datos y
 * variables matemáticas congeladas (Snapshots inmutables).
 */

import { pb } from '../services/pb';

export interface ContractGenerationResult {
  success: boolean;
  htmlContent: string;
  templateVersion: number;
  templateName: string;
  templateSnapshot?: any;
  error?: string;
}

export const generateContractContent = async (
  tenantId: string, 
  quoteSnapshot: any
): Promise<ContractGenerationResult> => {
  try {
    // 1. Fetch la plantilla activa de tipo "contract" para este Tenant
    // NO HAY HARDCODEO DE PLAZA MAYOR O CASA DE PIEDRA
    const templates = await pb.collection('templates_registry').getFullList({
      filter: `tenant = "${tenantId}" && template_type = "contract" && status = "active"`,
      sort: '-version', // Aseguramos traer la versión más alta si hay varias activas por error
    });

    if (!templates || templates.length === 0) {
      return {
        success: false,
        htmlContent: '',
        templateVersion: 0,
        templateName: '',
        error: 'No se encontró una plantilla de contrato activa para este recinto.'
      };
    }

    const template = templates[0];
    let html = template.html_content;

    // 2. Extraer el Snapshot Inmutable de la Cotización
    // La cotización ya trae el desglose matemático pre-calculado e inmutable.
    const desglose = quoteSnapshot.desglose_precios || {};
    const client = quoteSnapshot.client_snapshot || {};
    const brand = quoteSnapshot.branding_snapshot || {};

    // 3. Mapeo de Variables Exactas (Configuration Driven)
    // Se mapean los campos congelados.
    const mappings: Record<string, string> = {
      '{{QUOTE_ID}}': quoteSnapshot.id,
      '{{CLIENT_NAME}}': client.nombre_completo || 'N/A',
      '{{CLIENT_RFC}}': client.rfc || 'N/A',
      '{{TENANT_NAME}}': brand.tenant_name || 'N/A',
      '{{SPACE_NAME}}': desglose.espacio_nombre || 'N/A',
      '{{START_DATE}}': quoteSnapshot.fecha_inicio || 'N/A',
      '{{END_DATE}}': quoteSnapshot.fecha_fin || 'N/A',
      '{{TOTAL_PRICE}}': formatCurrency(quoteSnapshot.precio_final),
      '{{SUBTOTAL}}': formatCurrency(desglose.subtotal),
      '{{IVA}}': formatCurrency(desglose.iva),
      // Future: iterate over required_variables defined in the template config
    };

    // Replace all mapping keys in HTML
    for (const [key, value] of Object.entries(mappings)) {
      const regex = new RegExp(key, 'g');
      html = html.replace(regex, value);
    }

    // 4. Retornar el HTML final y el Template Snapshot Inmutable
    return {
      success: true,
      htmlContent: html,
      templateVersion: template.version,
      templateName: template.name,
      templateSnapshot: {
        id: template.id,
        name: template.name,
        version_aplicada: template.version,
        html_raw: template.html_content,
        fecha_congelamiento: new Date().toISOString()
      }
    };

  } catch (err) {
    console.error("Contract Engine Error:", err);
    return {
      success: false,
      htmlContent: '',
      templateVersion: 0,
      templateName: '',
      templateSnapshot: null,
      error: 'Error interno al renderizar el contrato.'
    };
  }
};

const formatCurrency = (value: number) => {
  return (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};
