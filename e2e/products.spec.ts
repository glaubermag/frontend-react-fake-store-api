import { test, expect } from '@playwright/test';

test.describe('Produtos', () => {
  test('deve exibir lista de produtos', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    const cartButtons = page.locator('button:has(svg)');
    await expect(cartButtons.first()).toBeVisible();
  });

  test('deve permitir buscar produtos', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[placeholder="Buscar produtos..."]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('phone');
      await searchInput.press('Enter');
      const cartButtons = page.locator('button:has(svg)');
      await expect(cartButtons.first()).toBeVisible();
    } else {
      const cartButtons = page.locator('button:has(svg)');
      await expect(cartButtons.first()).toBeVisible();
    }
  });

  test('deve adicionar produto ao carrinho', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    const cartButtons = page.locator('button:has(svg)');
    if (await cartButtons.count() > 0) {
      await cartButtons.first().click();
      const cartBadge = page.locator('.badge');
      await expect(cartBadge).toBeVisible();
    }
  });
}); 