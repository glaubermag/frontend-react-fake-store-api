import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
  test('deve navegar para a página de produtos', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.click('text=Produtos');
    await expect(page).toHaveURL(/.*products/);
  });

  test('deve navegar para o carrinho', async ({ page }) => {
    await page.goto('http://localhost:8080');
    const cartLink = page.locator('a:has(svg)').filter({ hasText: '' });
    await cartLink.first().click();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('deve navegar para a página de login', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
  });
}); 