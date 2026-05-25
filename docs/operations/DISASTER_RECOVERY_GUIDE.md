# Disaster Recovery Strategy (DRP)

## 1. Objectives & Metrics
In the event of a catastrophic failure (hardware corruption, severe malware infection, or critical facility outage), this procedure ensures the recovery of the Cotizador 2.0 Enterprise platform.
- **RTO (Recovery Time Objective):** < 15 Minutes (Time from provisioning new hardware to service restoration).
- **RPO (Recovery Point Objective):** Dependent on backup frequency (Standard is 24 hours).

## 2. Pre-Disaster Prerequisites
A successful recovery depends on previously configured mechanisms:
1. Access to the Git repository containing the application source code.
2. An off-site repository of valid database backups (`.sql` dumps).
3. Availability of a standard Windows Server image (2019/2022).

## 3. Disaster Recovery Execution Plan

### Phase 1: Infrastructure Provisioning
1. Provision a new Windows Server instance with required hardware specifications (4+ Cores, 8GB+ RAM).
2. Install prerequisite software: Node.js v20+ and PostgreSQL v16+.
3. Update DNS records (A/CNAME) to point the application's FQDN to the new server's IP address.

### Phase 2: Application Deployment
1. Clone the repository to the new host.
2. Execute the environment validation script:
   ```powershell
   .\validate-install.bat
   ```
   *Resolve any missing dependencies immediately.*

### Phase 3: Data Restoration
1. Retrieve the most recent database backup file from off-site storage.
2. Place the backup file in the application root directory.
3. Execute the restoration sequence:
   ```powershell
   .\restore-system.bat
   ```
4. Follow prompts to apply the data to the newly installed PostgreSQL instance.

### Phase 4: Service Initialization
1. Execute the production startup script:
   ```powershell
   .\start-prod.bat
   ```
2. Enter the new server's IP or FQDN when prompted.
3. The script will rebuild the frontend to target the new infrastructure and start the Node.js monolith.

## 5. Validation & Sign-Off
1. Verify system login using known administrative credentials.
2. Validate recent transactions to confirm the exact Recovery Point.
3. Notify stakeholders of service restoration and document the outage in the incident management system.
