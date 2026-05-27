@echo off
echo =========================================================
echo Iniciando base de datos (PostgreSQL) y Directus
echo Puerto de Directus: 8055
echo =========================================================

cd /d "h:\Cotizador-2.0-Enterprise\directus"
echo Asegurate de tener PostgreSQL en ejecucion.
npx directus start
