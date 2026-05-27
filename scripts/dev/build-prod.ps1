$ErrorActionPreference = "Stop"

# Resolver raiz del proyecto dinamicamente (dos niveles arriba de scripts\dev\)
$rootDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$prodDir = "$rootDir\production-build"

Write-Host "Raiz del proyecto: $rootDir"
Write-Host "Creando estructura de production-build..."

if (Test-Path $prodDir) { Remove-Item -Recurse -Force $prodDir }
New-Item -ItemType Directory -Path $prodDir | Out-Null
New-Item -ItemType Directory -Path "$prodDir\public" | Out-Null
New-Item -ItemType Directory -Path "$prodDir\server" | Out-Null

Write-Host "Compilando Frontend..."
Set-Location "$rootDir\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
Copy-Item -Recurse -Force "$rootDir\frontend\dist\*" "$prodDir\public"

Write-Host "Compilando Backend..."
Set-Location "$rootDir\backend"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }
Copy-Item -Recurse -Force "$rootDir\backend\dist\*" "$prodDir\server"

# Copiar package.json y lock para instalar deps de produccion
Copy-Item -Force "$rootDir\backend\package.json" "$prodDir\"
Copy-Item -Force "$rootDir\backend\package-lock.json" "$prodDir\"

# Copiar .env maestro si existe
if (Test-Path "$rootDir\.env") {
    Copy-Item -Force "$rootDir\.env" "$prodDir\"
}

# Copiar schema de Prisma para migraciones en produccion
New-Item -ItemType Directory -Path "$prodDir\prisma" | Out-Null
Copy-Item -Force "$rootDir\backend\prisma\schema.prisma" "$prodDir\prisma\"

Write-Host "Instalando dependencias de produccion..."
Set-Location $prodDir
npm ci --omit=dev

Write-Host "Build de produccion completado exitosamente!"
Set-Location $rootDir
