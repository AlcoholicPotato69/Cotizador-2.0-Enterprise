# Enterprise Troubleshooting Guide

## 1. System Diagnostics
Before diving into specific errors, run the general diagnostic tool:
```powershell
.\diagnostic.bat
```
This utility verifies port availability, PostgreSQL service status, Node.js health, and environment variables. Review its output first.

## 2. Common Scenarios & Resolutions

### 2.1 EADDRINUSE: Port 3000 is already in use
**Symptom:** The backend fails to start, throwing `Error: listen EADDRINUSE: address already in use :::3000`.
**Root Cause:** A previous instance of the Node.js monolith crashed without releasing the port, or another service (like IIS) is occupying it.
**Resolution:**
1. The `start-prod.bat` script includes an automatic cleanup routine using `taskkill`. Simply restart the script.
2. If it persists manually kill it:
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
   ```

### 2.2 ECONNREFUSED: Database Connection Failure
**Symptom:** The application starts but immediately logs `PrismaClientInitializationError` or `ECONNREFUSED 127.0.0.1:5432`.
**Root Cause:** PostgreSQL is not running, or credentials in `.env` are incorrect.
**Resolution:**
1. Verify PostgreSQL service is running in `services.msc` or via Task Manager.
2. Check the `.env` file at the repository root. Ensure the `DATABASE_URL` uses the correct username, password, and points to port `5432`.
3. Manually test connection: `psql -U postgres -h 127.0.0.1 -d cotizador_db`.

### 2.3 Network Error / CORS / Frontend Cannot Reach Backend
**Symptom:** The UI loads correctly, but API calls fail, displaying network timeouts or CORS policy violations in the browser console.
**Root Cause:** The IP address or FQDN used during frontend compilation does not match the URL the client is currently accessing.
**Resolution:**
1. This is a common configuration oversight. Re-run `start-prod.bat`.
2. When prompted for the network IP, enter the **exact IP address or FQDN** that the client browser uses to reach the server.
3. Verify the generated `frontend/.env.production` contains the correct `VITE_API_BASE_URL`.

### 2.4 High Memory Consumption (OOM)
**Symptom:** The application crashes sporadically with `JavaScript heap out of memory`.
**Root Cause:** Heavy database queries or concurrent user load exceeding the V8 default memory limit.
**Resolution:**
If running via node directly, increase the memory limit by modifying the start script or environment variables:
```powershell
set NODE_OPTIONS=--max-old-space-size=4096
```

## 3. Log Locations
For advanced debugging, inspect the following logs:
- **Application Logs:** Check console stdout/stderr. If using PM2, run `pm2 logs`.
- **Database Logs:** `C:\Program Files\PostgreSQL\16\data\pg_log\`
- **Build Logs:** Review the console output generated during the Vite compilation phase.
