# TABLE ENGINE ARCHITECTURE (Fase 4.2)

## 1. Renderizado y Server-Side Pagination
Para prevenir colapsos en el navegador con grandes volúmenes de contratos, la `DsTable` delega la paginación a PocketBase (`getList(page, perPage)`). El componente `DsPagination` actualizará la URI (ej. `?page=2`) garantizando que los enlaces sean compartibles.

## 2. Filtros Dinámicos (DsFilters)
Un componente global en la parte superior inyectará `Query Parameters` en la URL, los cuales el *Router* interceptará para armar la cadena `filter` (`status = 'approved'`) requerida por PocketBase.

## 3. Exportación
La exportación a CSV/Excel no será iterada en Frontend. `DsTable` incluirá una acción "Exportar" que detonará un *Worker* en el backend, o descargará la lista completa si el paginador indica < 500 registros.