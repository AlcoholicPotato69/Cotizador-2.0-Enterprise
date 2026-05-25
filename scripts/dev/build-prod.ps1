$ErrorActionPreference = "Stop"
$rootDir = "h:\Cotizador-2.0-Enterprise"
$prodDir = "$rootDir\production-build"

Write-Host "Creating production-build directory structure..."
if (Test-Path $prodDir) { Remove-Item -Recurse -Force $prodDir }
New-Item -ItemType Directory -Path $prodDir | Out-Null
New-Item -ItemType Directory -Path "$prodDir\public" | Out-Null
New-Item -ItemType Directory -Path "$prodDir\server" | Out-Null

Write-Host "Building frontend..."
Set-Location "$rootDir\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
Copy-Item -Recurse -Force "$rootDir\frontend\dist\*" "$prodDir\public"

Write-Host "Building backend..."
Set-Location "$rootDir\backend"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }
Copy-Item -Recurse -Force "$rootDir\backend\dist\*" "$prodDir\server"

# Copy package.json for backend
Copy-Item -Force "$rootDir\backend\package.json" "$prodDir\"
Copy-Item -Force "$rootDir\backend\package-lock.json" "$prodDir\"
if (Test-Path "$rootDir\.env") {
    Copy-Item -Force "$rootDir\.env" "$prodDir\"
}

# Also copy prisma schema so we can run migrations in production
New-Item -ItemType Directory -Path "$prodDir\prisma" | Out-Null
Copy-Item -Force "$rootDir\backend\prisma\schema.prisma" "$prodDir\prisma\"

Write-Host "Installing production dependencies..."
Set-Location $prodDir
npm ci --only=production

Write-Host "Production build completed successfully!"
