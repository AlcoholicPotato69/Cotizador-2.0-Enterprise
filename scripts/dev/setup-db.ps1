$ErrorActionPreference = "Stop"

Write-Host "Configurando Base de Datos usando instalacion nativa de PostgreSQL..."
Write-Host "Ejecutando creacion de BD y roles..."

psql.exe -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres_secure_pass_123';"
psql.exe -U postgres -d postgres -c "CREATE DATABASE cotizador_db;"

Write-Host "Base de datos configurada existosamente."
