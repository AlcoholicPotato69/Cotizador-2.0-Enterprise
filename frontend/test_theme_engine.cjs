const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // INTERCEPT NETWORK TO BYPASS OFFLINE BACKEND FOR VISUAL AUDIT ONLY
    await page.route('**/auth/login', async route => {
        const json = {
            token: "mock-jwt-token",
            user: {
                id: "1",
                email: "admin@acme.com",
                name: "Admin Acme",
                role: "admin",
                tenantId: "pm"
            }
        };
        await route.fulfill({ json });
    });

    await page.route('**/auth/profile', async route => {
        const json = {
            id: "1",
            email: "admin@acme.com",
            name: "Admin Acme",
            role: "admin",
            tenantId: "pm"
        };
        await route.fulfill({ json });
    });

    // Mock clients
    await page.route('**/clients*', async route => {
        const json = [
            { id: 1, name: "Cliente Prueba A", email: "a@cliente.com" },
            { id: 2, name: "Cliente Prueba B", email: "b@cliente.com" }
        ];
        await route.fulfill({ json });
    });

    const outDir = path.join(__dirname, 'screenshots', 'theme_engine');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    try {
        console.log("Navigating to login to test FOUC and initial render...");
        await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500); // Give vue time to mount
        await page.screenshot({ path: path.join(outDir, '01_login_theme_engine.png') });

        // Try to Login to reach Dashboard
        console.log("Logging in as admin@acme.com...");
        await page.fill('input[type="email"]', 'admin@acme.com');
        await page.fill('input[type="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        
        // TEST PM LIGHT
        await page.evaluate(() => {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-tenant', 'pm');
        });
        await page.waitForTimeout(500); // Wait for css transition
        await page.screenshot({ path: path.join(outDir, '02_dashboard_pm_light.png') });

        // TEST PM DARK
        await page.evaluate(() => {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-tenant', 'pm');
        });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, '03_dashboard_pm_dark.png') });

        // TEST CP LIGHT
        await page.evaluate(() => {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-tenant', 'cp');
        });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, '04_dashboard_cp_light.png') });

        // TEST CP DARK
        await page.evaluate(() => {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-tenant', 'cp');
        });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, '05_dashboard_cp_dark.png') });

        console.log("Theme Engine screenshots completed successfully.");
    } catch (err) {
        console.error("Error during audit:", err);
    } finally {
        await browser.close();
    }
})();
