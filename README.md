# Cotizador 2.0 Enterprise

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Enterprise-success.svg)

Bienvenido a la documentación oficial de **Cotizador 2.0 Enterprise**. Este sistema representa la evolución de nuestra plataforma de cotizaciones, rediseñada desde cero utilizando una arquitectura moderna, escalable y orientada a microservicios/APIs de alto rendimiento.

## 1. Arquitectura del Sistema

El sistema está dividido en dos capas principales, asegurando una separación de responsabilidades clara y facilitando el mantenimiento y la escalabilidad independiente:

*   **Backend (API Restful):** Desarrollado con **NestJS**, proporcionando un marco robusto, fuertemente tipado (TypeScript) y basado en principios SOLID. Utiliza un enfoque modular, inyección de dependencias y decoradores para garantizar un código limpio y testeable.
*   **Frontend (SPA/PWA):** Construido con **Vue.js**, ofreciendo una interfaz de usuario reactiva, rápida y fluida. Implementa un diseño responsivo y moderno, enfocado en la experiencia del usuario (UX) y el rendimiento corporativo.

## 2. Requisitos Previos

Antes de proceder con la instalación, asegúrese de tener instalados los siguientes componentes:

*   [Node.js](https://nodejs.org/) (v18.x o superior)
*   [pnpm](https://pnpm.io/) (v8.x o superior) - Gestor de paquetes recomendado.
*   [PostgreSQL](https://www.postgresql.org/) (v14.x o superior)
*   [Git](https://git-scm.com/)

## 3. Instalación

Siga estos pasos para configurar el entorno de desarrollo local:

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd Cotizador-2.0-Enterprise
    ```

2.  **Instalar dependencias del Backend:**
    ```bash
    cd backend
    pnpm install
    ```

3.  **Instalar dependencias del Frontend:**
    ```bash
    cd frontend
    pnpm install
    ```

## 4. Variables de Entorno

El sistema requiere configuración a través de variables de entorno. Copie el archivo de ejemplo en cada directorio y ajuste los valores según su entorno.

**En el Backend (`/backend/.env`):**
```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=su_password_seguro
DB_NAME=cotizador_db

# JWT y Seguridad
JWT_SECRET=clave_secreta_para_desarrollo
JWT_EXPIRATION=24h
```

**En el Frontend (`/frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 5. Migraciones

El backend utiliza TypeORM (o Prisma/Sequelize según la configuración final) para gestionar el esquema de la base de datos. Para aplicar los últimos cambios al esquema:

```bash
cd backend
pnpm run migration:run
```

Para revertir la última migración en caso de error:
```bash
pnpm run migration:revert
```

## 6. Seeds (Población de Datos)

Para inicializar la base de datos con datos maestros requeridos (roles, usuarios administrativos por defecto, configuraciones iniciales):

```bash
cd backend
pnpm run seed:run
```
*Nota: Ejecute los seeds únicamente después de haber aplicado las migraciones exitosamente.*

## 7. Build (Construcción)

Para compilar el proyecto y prepararlo para un entorno de producción:

**Construcción del Backend:**
```bash
cd backend
pnpm run build
```
Los archivos compilados se generarán en el directorio `/backend/dist`.

**Construcción del Frontend:**
```bash
cd frontend
pnpm run build
```
Los archivos estáticos listos para producción se generarán en el directorio `/frontend/dist`.

## 8. Deploy (Despliegue)

### Backend
El backend puede ser desplegado utilizando PM2, Docker o cualquier proveedor cloud de Node.js.
Ejemplo con PM2:
```bash
pm2 start dist/main.js --name "cotizador-api"
```

### Frontend
El directorio `/frontend/dist` contiene archivos estáticos que pueden ser servidos por Nginx, Apache, Vercel, AWS S3 + CloudFront, o similares.
Ejemplo de configuración básica de Nginx:
```nginx
server {
    listen 80;
    server_name cotizador.empresa.com;
    root /ruta/al/frontend/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 9. Troubleshooting (Solución de Problemas)

| Problema | Causa Posible | Solución |
| :--- | :--- | :--- |
| **Error de conexión a la BD** | Variables en `.env` incorrectas o servicio PostgreSQL inactivo. | Verifique las credenciales en `backend/.env` y asegúrese de que el servicio esté corriendo en el puerto 5432. |
| **CORS Error en Frontend** | El backend no tiene configurado los orígenes permitidos. | Asegúrese de que `VITE_API_BASE_URL` coincide exactamente con el dominio del backend y que en el `main.ts` de NestJS esté habilitado `app.enableCors()`. |
| **Migraciones fallan** | Esquema previo inconsistente o falta de permisos. | Verifique la tabla de historial de migraciones en la base de datos o recree la base de datos si está en un entorno local de desarrollo seguro. |
| **Módulo no encontrado (NestJS)** | Dependencias faltantes o errores tipográficos en los imports. | Ejecute `pnpm install` nuevamente o revise las rutas de importación relativas/absolutas. |

---
*Documentación generada por el Documentation Architect - MEGA-MANDATO V11.0*
