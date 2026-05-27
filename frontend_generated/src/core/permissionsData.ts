export interface PermissionMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const PERMISSIONS_METADATA: PermissionMetadata[] = [
  // Dashboard & Views
  { id: 'dashboard.view', name: 'Ver Dashboard', description: 'Acceso a la vista principal', category: 'Navegación' },
  { id: 'admin.access', name: 'Centro de Comando', description: 'Acceso al mapa interactivo y métricas globales', category: 'Navegación' },
  { id: 'clients.read', name: 'CRM y Clientes', description: 'Visualizar directorio de clientes y prospectos', category: 'Navegación' },
  { id: 'schedule.view', name: 'Agenda', description: 'Ver calendario y eventos programados', category: 'Navegación' },
  { id: 'catalog.view', name: 'Catálogo de Espacios', description: 'Ver salones, jardines y tarifas', category: 'Navegación' },
  { id: 'quotes.read', name: 'Ver Cotizaciones', description: 'Ver listado de cotizaciones', category: 'Navegación' },
  { id: 'contracts.read', name: 'Contratos', description: 'Ver contratos comerciales', category: 'Navegación' },
  { id: 'contracts.read', name: 'Convenios', description: 'Ver convenios especiales o corporativos', category: 'Navegación' },
  { id: 'admin.access', name: 'Bóveda de Documentos', description: 'Acceder a expedientes y documentos', category: 'Navegación' },
  { id: 'finance.view', name: 'Finanzas', description: 'Ver ingresos, facturas y pagos', category: 'Navegación' },
  { id: 'admin.access', name: 'Ver Tareas', description: 'Acceso al módulo de tareas', category: 'Navegación' },
  { id: 'admin.access', name: 'Workflows', description: 'Ver automatizaciones y flujos', category: 'Navegación' },
  { id: 'admin.access', name: 'Aprobaciones', description: 'Ver bandeja de aprobaciones pendientes', category: 'Navegación' },
  { id: 'legal.write', name: 'Asuntos Legales', description: 'Ver litigios y seguimiento legal', category: 'Navegación' },
  { id: 'admin.access', name: 'Reglamentos', description: 'Ver reglamentos operativos', category: 'Navegación' },
  { id: 'audit.read', name: 'Reportes', description: 'Generar y ver reportes del sistema', category: 'Navegación' },
  { id: 'audit.read', name: 'Auditoría', description: 'Ver logs y auditoría del sistema', category: 'Navegación' },
  { id: 'admin.access', name: 'Archivo Muerto', description: 'Aceso a documentos y eventos pasados', category: 'Navegación' },
  { id: 'admin.access', name: 'Actividad Reciente', description: 'Ver el desglose de interacciones', category: 'Navegación' },
  { id: 'admin.access', name: 'Snapshots', description: 'Ver el versionado de documentos', category: 'Navegación' },
  { id: 'admin.access', name: 'Operaciones', description: 'Ver módulo logístico y checklist', category: 'Navegación' },
  { id: 'admin.access', name: 'Almacenamiento Global', description: 'Ver reportes de almacenamiento de la nube', category: 'Configuración' },
  { id: 'admin.access', name: 'Gestión de Tenants', description: 'Ver espacios y unidades de negocio', category: 'Configuración' },
  { id: 'admin.access', name: 'Feature Flags', description: 'Ver módulos encendidos/apagados', category: 'Configuración' },
  { id: 'admin.access', name: 'Folios y Numeración', description: 'Ver configuraciones de foliatura de documentos', category: 'Configuración' },
  { id: 'admin.access', name: 'Observabilidad', description: 'Ver telemetría y salud del sistema', category: 'Configuración' },
  { id: 'settings.view', name: 'Configuración Básica', description: 'Aceso a la vista de settings', category: 'Configuración' },

  // Administrative Actions
  { id: 'settings.view', name: 'Gestionar Configuración', description: 'Cambiar colores, metadatos y preferencias', category: 'Administración' },
  { id: 'users.manage', name: 'Gestionar Usuarios', description: 'Crear, editar o desactivar usuarios', category: 'Administración' },
  { id: 'roles.manage', name: 'Gestionar Roles', description: 'Interfase de matriz de roles (RBAC)', category: 'Administración' },

  // General Actions
  { id: 'admin.access', name: 'Crear', description: 'Crear nuevos elementos de forma genérica', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Leer', description: 'Leer el contenido a detalle', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Actualizar', description: 'Actualizar elementos existentes', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Eliminar', description: 'Eliminar de la base de datos de manera lógica', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Archivar', description: 'Mandar al módulo de archivado global', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Restaurar', description: 'Restaurar registros del archivo', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Aprobar', description: 'Dar el VoBo positivo a workflows o documentos', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Rechazar', description: 'Rechazar requerimientos o documentos', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Firmar', description: 'Firma digital de documentos', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Descargar', description: 'Descargar archivos adjuntos o PDFs', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Subir', description: 'Carga de archivos locales al sistema', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Compartir', description: 'Generar links públicos de lectura', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Exportar a CSV/Excel', description: 'Extraer data-tables e informes', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Importar', description: 'Importar datos masivamente', category: 'Acciones Generales' },
  { id: 'admin.access', name: 'Generar PDF', description: 'Ejecución del motor generativo DocGenerative para un PDF', category: 'Acciones Generales' },
  { id: 'invoices.create', name: 'Generar Factura', description: 'Timbrado de recibo CFDI (Mockup)', category: 'Acciones Generales' },
  { id: 'contracts.create', name: 'Generar Contrato', description: 'Compilar plantilla y variables en formato PDF', category: 'Acciones Generales' },
  { id: 'contracts.create', name: 'Generar Convenio', description: 'Crear documentos B2B de convenios', category: 'Acciones Generales' },
  { id: 'payments.create', name: 'Generar Recibo', description: 'Generación de recibo de flujo en caja local', category: 'Acciones Generales' },

  // Domain Specific Actions
  { id: 'quotes.create', name: 'Crear Cotizaciones', description: 'Guardar preliminares en inventario', category: 'Cotizaciones' },
  { id: 'quotes.update', name: 'Editar Cotizaciones', description: 'Redactar descuentos o ajustes en cotizaciones vigentes', category: 'Cotizaciones' },
  { id: 'admin.access', name: 'Eliminar Cotizaciones', description: 'Cancelar o remover cotizaciones en stand-by', category: 'Cotizaciones' },
];

export const getPermissionsByCategory = () => {
  const grouped = PERMISSIONS_METADATA.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, PermissionMetadata[]>);

  return Object.entries(grouped).map(([name, permissions]) => ({ name, permissions }));
};
