@echo off
setlocal EnableDelayedExpansion

echo =======================================================
echo Instalador de Dependencias - Cotizador 2.0 Enterprise
echo =======================================================
echo.

echo [0/4] Verificando requisitos del sistema...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado o no esta en el PATH.
    echo Por favor instala Node.js antes de continuar.
    pause
    exit /b
) else (
    echo [OK] Node.js detectado.
)

netstat -ano | findstr :5432 >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] No se detecto PostgreSQL en el puerto por defecto 5432.
    echo Si configuraste PostgreSQL en otro puerto, puedes ignorar este mensaje.
) else (
    echo [OK] Servicio PostgreSQL detectado.
)
echo.

echo =======================================================
echo Configuracion de Base de Datos
echo =======================================================
echo (Presiona ENTER para usar los valores entre corchetes)
set "DB_USER=postgres"
set /p DB_USER="Usuario de PostgreSQL [%DB_USER%]: "

set "DB_PASS=admin123"
set /p DB_PASS="Contrasena de PostgreSQL [%DB_PASS%]: "

set "DB_PORT=5432"
set /p DB_PORT="Puerto de PostgreSQL [%DB_PORT%]: "

echo.
echo Actualizando variables de entorno (.env)...

:: Backend .env
echo DATABASE_URL="postgresql://!DB_USER!:!DB_PASS!@127.0.0.1:!DB_PORT!/cotizador_db?schema=public" > backend\.env
echo DOCUMENT_SIGNING_SECRET="clave_secreta_para_documentos_12345" >> backend\.env
echo JWT_SECRET="clave_secreta_para_desarrollo_12345" >> backend\.env
echo JWT_EXPIRATION="24h" >> backend\.env
echo PORT=3000 >> backend\.env
echo NODE_ENV="development" >> backend\.env

:: Directus .env
echo KEY=acbd18db4cc2f85cedef654fccc4a4d8 > directus\.env
echo SECRET=some-secret-key-for-directus-dev-123 >> directus\.env
echo DB_CLIENT=pg >> directus\.env
echo DB_HOST=127.0.0.1 >> directus\.env
echo DB_PORT=!DB_PORT! >> directus\.env
echo DB_DATABASE=cotizador_db >> directus\.env
echo DB_USER=!DB_USER! >> directus\.env
echo DB_PASSWORD=!DB_PASS! >> directus\.env
echo ADMIN_EMAIL=admin@cotizador.com >> directus\.env
echo ADMIN_PASSWORD=admin >> directus\.env
echo CORS_ENABLED="true" >> directus\.env
echo CORS_ORIGIN="true" >> directus\.env
echo CORS_METHODS="GET,POST,PATCH,DELETE,OPTIONS" >> directus\.env

echo [OK] Archivos .env actualizados correctamente.
echo.

echo [1/4] Instalando dependencias del Frontend (Vite/React)...
cd frontend_generated
call npm install
cd ..
echo Frontend listo.
echo.

echo [2/4] Instalando dependencias del Backend (NestJS)...
cd backend
set PUPPETEER_SKIP_DOWNLOAD=true
call npm install
cd ..
echo Backend listo.
echo.

echo [3/4] Instalando dependencias de Directus...
cd directus
if not exist "uploads" mkdir "uploads"
if not exist "extensions" mkdir "extensions"
call npm install --ignore-scripts
if exist "snapshot.yaml" (
    echo Aplicando esquema de Directus...
    call npx directus schema apply ./snapshot.yaml -y
) else (
    echo [ADVERTENCIA] No se encontro snapshot.yaml. La logica de Directus estara vacia.
)
cd ..
echo Directus listo.
echo.

echo [4/4] Configurando Base de Datos...
cd backend
echo Generando cliente de Prisma...
call npx prisma generate
echo Estructurando base de datos (creando tablas)...
call npx prisma db push
echo Sembrando datos iniciales (usuarios, roles, etc)...
call npx prisma db seed
cd ..
echo Base de datos lista.
echo.

echo =======================================================
echo Instalacion completada con exito.
echo Ya puedes ejecutar start-dev.bat para levantar el proyecto.
echo =======================================================
pause
