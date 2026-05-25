# Installation & Deployment Guide

## 1. Executive Summary
This document provides comprehensive instructions for deploying the **Cotizador 2.0 Enterprise** platform. The deployment strategy utilizes automated batch scripts to standardize provisioning, validate requirements, and orchestrate the Node.js monolith alongside the PostgreSQL backend on Windows Server environments.

## 2. Infrastructure Requirements

### 2.1 Hardware Specifications
- **CPU:** 4 Cores (Minimum), 8 Cores (Recommended for production)
- **RAM:** 8 GB (Minimum), 16 GB (Recommended)
- **Disk:** 50 GB SSD (NVMe preferred for database I/O)

### 2.2 Software Prerequisites
The runtime environment mandates the following dependencies. Ensure they are globally available in the system `%PATH%`:
- **Node.js:** v20.x LTS or higher
- **PostgreSQL:** v16.x or higher
- **Git:** v2.x (for version control and updates)
- **Operating System:** Windows Server 2019 / 2022 (or Windows 10/11 for local development)
- **Privileges:** Administrator access is strictly required to manage ports and system services.

## 3. Installation Procedure

The installation process is fully automated via orchestration scripts located in the project root.

### Step 1: Repository Acquisition
Clone the enterprise repository to the target server's designated deployment directory (e.g., `C:\Deployments\Cotizador-2.0-Enterprise`):
```powershell
git clone <repository_url> "C:\Deployments\Cotizador-2.0-Enterprise"
cd "C:\Deployments\Cotizador-2.0-Enterprise"
```

### Step 2: Environment Validation
Execute the validation script to verify that all hardware, software, and networking prerequisites are met before proceeding:
```powershell
.\validate-install.bat
```
*Note: This script performs integrity checks on Node.js, npm, PostgreSQL binaries, and available memory/storage. Any failures must be resolved prior to Step 3.*

### Step 3: Automated Provisioning & Launch
Initiate the production startup sequence:
```powershell
.\start-prod.bat
```
During execution, the script will:
1. **Prompt for Network Bindings:** You will be asked to supply the Server IP (LAN or Public) to correctly bind the frontend to the backend API.
2. **Install Dependencies:** Executes `npm install` across all workspaces.
3. **Database Migration:** Applies Prisma schema migrations to ensure the PostgreSQL schema is up-to-date.
4. **Asset Compilation:** Builds the React/Vite frontend for production.
5. **Service Instantiation:** Launches the NestJS monolith. The application serves both the backend API and the static compiled frontend from a single port.

## 4. Post-Installation Validation
Upon successful execution, verify system health:
1. Navigate to `http://<YOUR_IP>:3000` via a web browser to confirm UI availability.
2. Check the API health endpoint (if configured) at `http://<YOUR_IP>:3000/api/v1/health`.
3. Verify that there are no standard error (STDERR) outputs in the active console.

## 5. Security & Maintenance
- **Service Management:** For continuous background execution, it is highly recommended to wrap the Node.js process using a process manager such as PM2 (`npm install -g pm2`) or wrap the batch script inside a Windows Service using NSSM (Non-Sucking Service Manager).
- **Environment Variables:** Production secrets should be managed securely. Review the generated `.env` and `frontend/.env.production` files to ensure no sensitive development credentials are leaked.
