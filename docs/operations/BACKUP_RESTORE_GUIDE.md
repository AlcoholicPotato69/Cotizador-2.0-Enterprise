# Backup and Restore Procedures

## 1. Policy & Objectives
Data integrity and retention are critical. The current architecture uses PostgreSQL 16+. 
- **Recovery Point Objective (RPO):** Defined by the backup schedule frequency (e.g., 24 hours if backed up daily).
- **Format:** Backups are logical dumps utilizing standard PostgreSQL utilities (`pg_dump` / `pg_restore`), compressed into `.sql` or `.backup` custom formats.

## 2. Automated Backup Execution
A purpose-built orchestration script is provided for creating reliable snapshots of the database.

### 2.1 Manual Execution
To manually trigger a backup:
1. Open an Administrator command prompt.
2. Navigate to the project root.
3. Execute `backup-system.bat`.
4. The script interfaces with `pg_dump.exe`, authenticates against the `cotizador_db` database, and outputs a timestamped file in the root or designated backups directory.

### 2.2 Scheduled Backups (Windows Task Scheduler)
For production systems, backups must be automated:
1. Open **Task Scheduler** (`taskschd.msc`).
2. Create a "Basic Task" named `Cotizador DB Backup`.
3. Set the trigger to **Daily** (e.g., 02:00 AM).
4. Set Action to **Start a Program**, pointing to `cmd.exe` with arguments `/c "C:\Path\To\Cotizador\backup-system.bat"`.
5. Ensure the task is configured to "Run whether user is logged on or not" with highest privileges.

## 3. Data Restoration Procedure

> **[!CAUTION]**
> Executing a restoration will overwrite the existing database schema and data. Ensure you have authorization and have notified stakeholders of potential downtime.

### Restoration Steps
1. Stop the application server to drop active database connections. Close any running instances of `start-prod.bat` or PM2 processes.
2. Execute the interactive restore script:
   ```powershell
   .\restore-system.bat
   ```
3. The script will prompt for the target filename (e.g., `backup_2024-05-20.sql`). Ensure the file is placed in the root directory.
4. The script automatically invokes `pg_restore.exe` (or `psql` for plain SQL), drops existing tables if necessary, and reconstructs the data.
5. Restart the application via `start-prod.bat`.
6. Log into the system and verify data integrity and application functionality.

## 4. Off-site Retention
Local backups protect against logical errors. To protect against physical server failure, it is strongly advised to sync the backup directory to off-site storage (e.g., AWS S3, Azure Blob, or a network NAS) using a script or utility like `rclone` or AWS CLI.
