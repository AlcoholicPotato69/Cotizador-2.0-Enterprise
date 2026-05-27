import { test, expect } from '@playwright/test';

test.describe('End-to-End Workflow', () => {
  test('Login and navigate to views', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console error: ${msg.text()}`);
      }
    });
    page.on('pageerror', exception => {
      errors.push(`Uncaught exception: ${exception}`);
    });
    page.on('response', response => {
      if (response.status() >= 400) {
        errors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });

    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'superadmin@cotizador.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    try {
      await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
      
      // 2. Dashboard assertions
      await expect(page.locator('body')).toBeVisible();

      // 3. Navigate to Catalog
      await page.goto('/catalog');
      await page.waitForURL(/.*\/catalog/);
      await expect(page.locator('body')).toBeVisible();

      // 4. Navigate to Agenda
      await page.goto('/schedule');
      await page.waitForURL(/.*\/schedule/);
      await expect(page.locator('body')).toBeVisible();
      
    } catch (e) {
      await page.screenshot({ path: 'screenshots/login-error.png' });
      console.error("Errors caught during login:", errors);
      throw e;
    }
  });
});
