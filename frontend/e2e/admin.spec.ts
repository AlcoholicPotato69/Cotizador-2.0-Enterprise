import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Security & Operations', () => {
  test('un usuario no autenticado es expulsado al login', async ({ page }) => {
    // Simulamos un acceso directo a la ruta protegida
    await page.goto('/admin');
    
    // Debería redirigir al login
    await expect(page).toHaveURL(/.*login/);
  });

  test('un usuario sin rol administrativo (sin permisos) es redirigido a la raíz', async ({ page }) => {
    await page.route('**/users/me', route => route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: '456',
        email: 'user@cotizador.com',
        tenant_id: 'pm',
        role: 'user',
        effective_permissions: [] // Sin permisos admin ni catalog.view
      })
    }));

    await page.route('**/tenants/*', route => route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 'pm',
        name: 'Plaza Mayor'
      })
    }));

    await page.addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token-user');
      window.localStorage.setItem('auth_user', JSON.stringify({
        id: '456',
        email: 'user@cotizador.com',
        tenant_id: 'pm',
        role: 'user',
        effective_permissions: []
      }));
    });

    await page.goto('/admin');
    
    // Debería redirigir a /playground
    await expect(page).toHaveURL(/.*playground/);
  });

  test('usuario admin puede visualizar el Catálogo Espacial y ver el botón de Nuevo Espacio', async ({ page }) => {
    // Nota: Esta prueba asume que el auth se puede inyectar o mockear. 
    // Para simplificar, validamos la existencia del título si estuviera mockeado.
    // Usaremos page.route para mockear el API y simular estado autenticado
    await page.route('**/users/me', route => route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: '123',
        email: 'admin@cotizador.com',
        tenant_id: 'pm',
        effective_permissions: ['admin:write', 'admin:read']
      })
    }));

    await page.route('**/tenants/*', route => route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 'pm',
        name: 'Plaza Mayor'
      })
    }));

    await page.route('**/spaces*', route => route.fulfill({
      status: 200,
      body: JSON.stringify([])
    }));

    // Simular el inicio de sesión y la navegación
    await page.addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token');
      window.localStorage.setItem('auth_user', JSON.stringify({
        id: '123',
        email: 'admin@cotizador.com',
        tenant_id: 'pm',
        role: 'admin',
        effective_permissions: ['admin:write', 'admin:read', 'catalog.view']
      }));
    });
    
    await page.goto('/catalog');
    
    // Verificar que el título de la vista se renderiza
    await expect(page.locator('h1')).toContainText('Catálogo de Espacios');
    
    // Verificar que el botón CRUD existe
    await expect(page.locator('button', { hasText: 'Nuevo Espacio' })).toBeVisible();
  });
});
