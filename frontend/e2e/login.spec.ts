import { test, expect } from '@playwright/test';

test.describe('Login & Theming & Guards', () => {
  
  test('Navigation Guard redirects to login when no session', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/playground');
    // It should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Login flow applies red theming for Plaza M tenant (PM)', async ({ page }) => {
    // Intercept login
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token-pm',
          user: {
            id: 'user-1',
            email: 'admin@plazam.com',
            tenant_id: 'tenant-pm-123',
            effective_permissions: []
          }
        })
      });
    });

    // Intercept tenant fetch
    await page.route('**/api/v1/tenants/tenant-pm-123', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-pm-123',
          name: 'Plaza M',
          slug: 'pm'
        })
      });
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@plazam.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect to playground
    await expect(page).toHaveURL(/.*\/playground/);
    
    // Check if the body has the 'tenant-pm' class
    await expect(page.locator('body')).toHaveClass(/tenant-pm/);
  });

  test('Login flow applies copper theming for Cobre Plaza tenant (CP)', async ({ page }) => {
    // Intercept login
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token-cp',
          user: {
            id: 'user-2',
            email: 'admin@cobre.com',
            tenant_id: 'tenant-cp-456',
            effective_permissions: []
          }
        })
      });
    });

    // Intercept tenant fetch
    await page.route('**/api/v1/tenants/tenant-cp-456', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-cp-456',
          name: 'Cobre Plaza',
          slug: 'cp'
        })
      });
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cobre.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect to playground
    await expect(page).toHaveURL(/.*\/playground/);
    
    // Check if the body has the 'tenant-cp' class
    await expect(page.locator('body')).toHaveClass(/tenant-cp/);
  });
});
