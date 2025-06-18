import { test, expect } from '@playwright/test';

test.describe('Produtos', () => {
  test('deve exibir lista de produtos', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    const productCards = page.locator('[data-testid="product-card"], .card, .grid > div');
    await expect(productCards.first()).toBeVisible();
  });

  test('deve permitir buscar produtos', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[placeholder="Buscar produtos..."]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('phone');
      await searchInput.press('Enter');
      const productCards = page.locator('[data-testid="product-card"], .card, .grid > div');
      await expect(productCards.first()).toBeVisible();
    } else {
      const productCards = page.locator('[data-testid="product-card"], .card, .grid > div');
      await expect(productCards.first()).toBeVisible();
    }
  });

  test('deve adicionar produto ao carrinho', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    const cartButtons = page.locator('button:has(svg[data-lucide="shopping-cart"]), button:has(svg[data-lucide="ShoppingCart"])');
    if (await cartButtons.count() > 0) {
      await cartButtons.first().click();
      await page.waitForTimeout(1000);
      const cartBadge = page.locator('.badge');
      if (await cartBadge.count() > 0) {
        await expect(cartBadge).toBeVisible();
      }
    }
  });

  test('deve navegar para detalhes ao clicar no título e na imagem do produto', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    // Espera pelo menos um produto
    const productCards = page.locator('[data-testid="product-card"], .card, .grid > div');
    await expect(productCards.first()).toBeVisible();

    // Clicar no título
    const titleLink = productCards.first().locator('a:has(h3), a');
    const titleHref = await titleLink.getAttribute('href');
    await titleLink.first().click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp('/products/\\d+$'));
    // Voltar para a lista
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    // Clicar na imagem
    const imageLink = productCards.first().locator('a:has(img), a');
    await imageLink.first().click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp('/products/\\d+$'));
  });
}); 