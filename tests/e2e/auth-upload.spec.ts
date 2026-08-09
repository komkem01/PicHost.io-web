import { test, expect } from '@playwright/test';

test.describe('PicHost.io Core E2E Flows', () => {
  test('landing page loads correctly with title and navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PicHost/i);

    // Check pricing & terms navigation links exist
    const pricingLink = page.locator('a[href="/pricing"]');
    await expect(pricingLink).toBeVisible();
  });

  test('navigate to login page and check form elements', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('navigate to terms and privacy pages', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('h1')).toContainText(/Terms|ข้อตกลง/i);

    await page.goto('/privacy');
    await expect(page.locator('h1')).toContainText(/Privacy|นโยบายความเป็นส่วนตัว/i);
  });
});
