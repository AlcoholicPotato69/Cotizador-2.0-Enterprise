import { test, expect } from '@playwright/test';

test.describe('Authentication Error Handling', () => {

  test('Shows error on invalid credentials and does not mute the session block', async ({ page }) => {
    // We mock the backend to return 401
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' })
      });
    });

    await page.goto('/login');
    
    // Fill credentials
    await page.fill('input[type="email"]', 'bad@enterprise.com');
    await page.fill('input[type="password"]', 'wrongpass');
    
    // Submit
    await page.click('button[type="submit"]');

    // Wait for the error message
    const errorMsg = page.locator('text="Correo corporativo o contraseña incorrectos."');
    await expect(errorMsg).toBeVisible();

    // Check we are still on the login page (no silent block/reload)
    expect(page.url()).toContain('/login');
  });

  test('Successfully extracts token and redirects to home', async ({ page }) => {
    // We mock a successful backend response
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            token: 'fake-jwt-token',
            user: { id: 1, email: 'admin@plaza.com', tenant_id: 't1', effective_permissions: [] }
          }
        })
      });
    });

    await page.route('**/api/v1/tenants/t1', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 't1',
            name: 'Plaza M',
            slug: 'pm'
          })
        });
      });
      
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'admin@plaza.com');
    await page.fill('input[type="password"]', 'goodpass');
    
    await page.click('button[type="submit"]');

    // Check redirection
    await page.waitForURL('**/playground');
    
    // Verify localStorage has the token
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBe('fake-jwt-token');
  });

});
