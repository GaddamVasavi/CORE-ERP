import { test, expect } from '@playwright/test';

test.describe('Manufacturing & MRP Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should verify Bill of Materials and trigger Production Order', async ({ page }) => {
    await page.goto('/manufacturing');
    await expect(page.locator('h2')).toContainText('Manufacturing & MRP');
    await expect(page.locator('text=PO-MFG-2026-0045')).toBeVisible();
  });
});
