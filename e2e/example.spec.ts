import { test, expect } from '@playwright/test';

test('homepage deve exibir o título da loja', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle(/fake store/i);
});
 