# Cotizador 2.0 Enterprise - Architecture

## Principios Arquitectónicos
Todo el sistema está fundamentado en los siguientes pilares inquebrantables:
- **Code First**: La infraestructura, configuraciones y despliegues se definen y gestionan a través de código.
- **Source Purity**: Uso exclusivo de código fuente limpio, testeable y mantenible. No se admiten configuraciones opacas.
- **Zero Trust**: Ningún componente, interno o externo, es confiable por defecto. Todo acceso requiere autenticación y autorización explícita.
- **Audit Everything**: Absolutamente todas las acciones, cambios de estado y accesos son registrados inmutablemente en el dominio de Audit.
- **Multi Tenant**: Arquitectura nativa de múltiples inquilinos, con aislamiento estricto de datos y recursos por Tenant.

## Visión General del Sistema
El sistema se diseña bajo una arquitectura orientada a eventos y microservicios/módulos acotados (Bounded Contexts) que aseguran alta escalabilidad y resiliencia.

## Dominios de la Arquitectura
El sistema se divide en los siguientes dominios principales:
1. **Identity**: Gestión de identidades de usuarios.
2. **Tenants**: Administración de inquilinos, configuración y aislamiento.
3. **RBAC**: Control de acceso basado en roles (Role-Based Access Control).
4. **Clientes**: Gestión del ciclo de vida y datos de clientes.
5. **CRM**: Seguimiento comercial, oportunidades e interacciones.
6. **Quotes**: Motor de cotizaciones, reglas de negocio y precios.
7. **Contracts**: Gestión de contratos generados.
8. **Signatures**: Flujo de firmas electrónicas.
9. **Documents**: Almacenamiento seguro e inmutable de documentos.
10. **Invoices**: Generación y control de facturas.
11. **Payments**: Pasarelas de pago y conciliación.
12. **Notifications**: Motor omnicanal de notificaciones (Email, SMS, Push).
13. **Reports**: Generación de informes analíticos y operativos.
14. **Audit**: Registro inmutable de transacciones y accesos.

## Arquitectura de Despliegue y Red
- **API Gateway**: Punto de entrada único que aplica políticas de Zero Trust, rate limiting y enrutamiento hacia los dominios.
- **Event Bus**: Broker de mensajería para comunicación asíncrona entre dominios.
- **Storage Area**: Bases de datos segregadas por Tenant (lógica o físicamente, según estrategia Code First).
