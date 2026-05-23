# TENANT ADMINISTRATION CENTER ARCHITECTURE

## 1. Misión del Centro de Mando
El Tenant Administration Center (TAC) no es un simple CRUD de configuraciones. Es el cerebro operativo donde el Administrador de Negocio toma control total de su plataforma sin depender del desarrollador original. Su principio rector es: **"Si no puede configurarse en el TAC, es un hardcodeo inaceptable"**.

## 2. Estrategias Base
- **Estrategia de Versionado**: Nada se elimina (`DELETE`). Las reglas, plantillas e impuestos son estrictamente versionados (`v1`, `v2`, `v3`) y los registros antiguos se marcan como `archived`. Los históricos no sufren daños gracias a la Estrategia de Snapshots.
- **Estrategia de Auditoría (Audit Center)**: El sistema almacena un registro inmutable en `admin_audit_log` detallando `[Usuario X] modificó la [Regla IVA] de [v1] a [v2] el [Fecha]`.
- **Estrategia de Rollback**: Al mantener el versionado inmutable, cualquier administrador con el permiso `rule_rollback` puede restaurar una configuración previa activando de nuevo la `v1` y archivando la `v2` con un solo clic.

## 3. Módulos Administrativos y Dependencias
El TAC se compone de 19 Módulos Centrales clasificados en 5 Clústers:

### A) Clúster de Organización y Seguridad
1. **Usuarios**: ABM de personal interno. Depende de Roles.
2. **Roles**: Agrupadores semánticos de permisos.
3. **Permisos**: Unidad atómica de seguridad (Ej. `manage_pricing`, `view_audit`). Administra el RBAC puro.
4. **Tenant Settings**: Configuración global operativa del recinto.
5. **Branding**: Logos y colores dinámicos (inyectados al `branding_snapshot`).

### B) Clúster Catálogo de Espacios (Space Catalog Builder)
Este builder abarca todos los tipos físicos y lógicos (Digital, Mupis, Salones).
6. **Categorías**: Clasificadores padre (Ej. "Publicidad Digital").
7. **Subcategorías**: (Ej. "Tótems", "Pantallas Gigantes").
8. **Espacios**: El catálogo granular.
   - *Dependencias*: Consume Categorías, Subcategorías.
   - *Configurables*: Medidas, capacidades, fotos, planos y tarifas base.
9. **Occupancy Policies**: Configuración de `exclusive`, `shared`, `segmented` para dictar cómo interactúa este espacio con el Availability Engine.

### C) Clúster Motor de Reglas (Rule Builder Visual)
El corazón algorítmico. Interfaz Drag & Drop que soporta operadores lógicos (`AND`, `OR`, `NOT`), prioridades, exclusividad temporal y anidamiento estricto.
10. **Eligibility Rules**: Restricciones documentales o de perfil para permitir que un cliente cotice o contrate.
11. **Document Requirements**: Motor que exige archivos adjuntos bajo ciertas condiciones.
12. **Pricing Rules**: Cargos extra y variables B2B (Premontaje, Horas Extra).
13. **Promotions**: Reglas de descuento (Acumulables y Excluyentes).
14. **Taxes**: Configuración de impuestos aplicables, retenidos y trasladados.

### D) Clúster Legal e Integración
15. **Templates**: Editor visual (WYSIWYG) para cargar machotes de contratos y recibos con `required_variables` dinámicas.
16. **Notifications**: Gestión de alertas multicanal (Correo, SMS) cuando ocurre un hito del workflow.
17. **Automations**: Próxima evolución de los Webhooks o respuestas a eventos (Ej. Si el Contrato cambia a Pagado -> Inyectar Factura).

### E) Clúster Financiero y Auditoría
18. **Invoice Providers (Facturación)**: Configuración abstracta para interconectar PACs (Intelisis, SW Sapien) o forzar Modo Manual Estricto.
19. **Audit Center**: Monitor global donde los Directores auditan la Línea de Tiempo Administrativa.
