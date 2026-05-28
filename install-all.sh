#!/bin/bash

echo "======================================================="
echo "Instalador de Dependencias - Cotizador 2.0 Enterprise"
echo "======================================================="
echo ""

echo "[1/2] Instalando dependencias del Frontend (Vite/React)..."
cd frontend_generated || exit
npm install
cd ..
echo "Frontend listo."
echo ""

echo "[2/2] Instalando dependencias del Backend (NestJS)..."
cd backend || exit
export PUPPETEER_SKIP_DOWNLOAD=true
npm install
echo "Generando cliente de Prisma..."
npx prisma generate
echo "Estructurando base de datos..."
npx prisma db push
echo "Sembrando datos iniciales (usuarios, roles, etc)..."
npx prisma db seed
cd ..
echo "[3/3] Configurando Directus..."
cd directus || exit
npm install --ignore-scripts
cd ..

echo ""
echo "=========================================================="
echo "Dependencias instaladas correctamente."
echo "======================================================="
