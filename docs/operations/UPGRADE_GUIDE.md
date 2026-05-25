# Software Upgrade & Patch Management Guide

## 1. Upgrade Methodology
The update process is designed to apply new application features, security patches, and database schema migrations with minimal downtime. The process leverages standard Git operations combined with Prisma's automated migration engine.

## 2. Pre-Upgrade Checklist
Before initiating an upgrade on a production system:
1. **Announce Maintenance Window:** Notify users of expected partial downtime (typically < 3 minutes).
2. **Execute Full Backup:** Always generate a fresh database snapshot via `backup-system.bat`.
3. **Verify Git State:** Ensure the local repository has no uncommitted changes that might conflict with the remote branch.

## 3. Execution of the Upgrade

The provided script orchestrates the entire pull and build sequence.

1. **Stop Current Execution:** Terminate the currently running instance of `start-prod.bat` or stop the PM2 service.
2. **Run Update Script:**
   ```powershell
   .\update-system.bat
   ```
3. **Internal Script Workflow:**
   - **Source Sync:** Executes `git pull origin main` to fetch the latest stable release.
   - **Dependency Management:** Runs `npm install` to update packages based on new `package-lock.json` definitions.
   - **Schema Migrations:** Executes `npx prisma migrate deploy`. This command strictly applies new SQL schema changes without destroying existing data.
4. **Restart Services:**
   ```powershell
   .\start-prod.bat
   ```
   *The system will recompile the frontend utilizing the newly pulled code and launch the updated backend.*

## 4. Rollback Procedure
If the upgrade introduces critical failures:
1. **Revert Source Code:** Identify the previous stable Git commit hash.
   ```powershell
   git reset --hard <PREVIOUS_COMMIT_HASH>
   ```
2. **Restore Database:** If the database schema was modified in a way that breaks the older code, you must restore the pre-upgrade database backup using `restore-system.bat`.
3. **Rebuild:** Execute `npm install` and `start-prod.bat` to recompile and launch the stable state.
4. **Log Incident:** Document the failure reason for developer review.
