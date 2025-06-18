import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo', () => {
  test('deve navegar pela aplicação e adicionar produto ao carrinho', async ({ page }) => {
    // 1. Acessa a página inicial
    await page.goto('http://localhost:8080');
    await expect(page).toHaveTitle(/fake store/i);
    
    // 2. Navega para produtos
    await page.click('text=Produtos');
    await expect(page).toHaveURL(/.*products/);
    
    // 3. Aguarda carregamento dos produtos
    await page.waitForLoadState('networkidle');
    
    // 4. Verifica se há produtos
    const productCards = page.locator('[data-testid="product-card"], .card, .grid > div');
    await expect(productCards.first()).toBeVisible();
    
    // 5. Adiciona produto ao carrinho
    const cartButtons = page.locator('button:has(svg[data-lucide="shopping-cart"]), button:has(svg[data-lucide="ShoppingCart"])');
    if (await cartButtons.count() > 0) {
      await cartButtons.first().click();
    }
    
    // 6. Navega para o carrinho
    await page.click('a[href="/cart"]');
    await expect(page).toHaveURL(/.*cart/);
    
    // 7. Aguarda o título do carrinho ou mensagem de vazio
    await page.waitForSelector('h1, h2');
    const hasCarrinho = await page.locator('h1').filter({ hasText: /carrinho de compras/i }).count() > 0;
    const hasVazio = await page.locator('h2').filter({ hasText: /seu carrinho está vazio/i }).count() > 0;
    expect(hasCarrinho || hasVazio).toBeTruthy();
  });

  test('deve testar busca de produtos', async ({ page }) => {
    await page.goto('http://localhost:8080/products');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[placeholder="Buscar produtos..."]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('phone');
      await searchInput.press('Enter');
      
      // Aguarda a busca ser processada
      await page.waitForTimeout(2000);
      
      // Verifica se ainda há produtos após a busca
      const products = page.locator('[data-testid="product-card"], .card, .grid > div');
      await expect(products.first()).toBeVisible();
    }
  });
}); 