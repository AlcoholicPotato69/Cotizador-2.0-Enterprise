const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const outDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    try {
        console.log("Navigating to login...");
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(outDir, '01_login_light.png') });

        // Switch to Dark mode
        await page.evaluate(() => document.documentElement.classList.add('dark'));
        await page.screenshot({ path: path.join(outDir, '02_login_dark.png') });

        // Try to Login (PM)
        console.log("Logging in as admin@acme.com...");
        await page.fill('input[type="email"]', 'admin@acme.com');
        await page.fill('input[type="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'networkidle' });
        
        console.log("Navigated to:", page.url());
        await page.screenshot({ path: path.join(outDir, '03_dashboard_dark.png') });

        // Switch back to light
        await page.evaluate(() => document.documentElement.classList.remove('dark'));
        await page.screenshot({ path: path.join(outDir, '04_dashboard_light.png') });

        console.log("Navigating to clients...");
        await page.goto('http://localhost:5173/clients', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(outDir, '05_clients_light.png') });

        // Check if tenant change is visually changing things
        await page.evaluate(() => {
            document.body.classList.remove('tenant-pm');
            document.body.classList.add('tenant-cp');
        });
        await page.screenshot({ path: path.join(outDir, '06_clients_light_cp.png') });

        console.log("Audit screenshots completed!");
    } catch (err) {
        console.error("Error during audit:", err);
    } finally {
        await browser.close();
    }
})();
