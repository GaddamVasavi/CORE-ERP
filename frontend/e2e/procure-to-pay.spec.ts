import { test, expect } from '@playwright/test';

test.describe('Procure-to-Pay (P2P) End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should complete Procure-to-Pay cycle: PR -> PO -> GRN -> Invoice -> GL', async ({ page }) => {
    await page.goto('/procurement');
    await expect(page.locator('h2')).toContainText('Procurement & Sourcing');

    // Create PO
    await page.click('text=Create Purchase Order');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=PO-2026-0810')).toBeVisible();

    // Verify 3-Way Match in Invoices
    await page.goto('/finance');
    await expect(page.locator('h2')).toContainText('Finance & Accounting');
    await expect(page.locator('text=INV-2026-0089')).toBeVisible();
  });
});
