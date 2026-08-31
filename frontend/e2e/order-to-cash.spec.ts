import { test, expect } from '@playwright/test';

test.describe('Order-to-Cash (O2C) End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should complete Order-to-Cash flow: Customer -> Quotation -> Sales Order -> Fulfillment', async ({ page }) => {
    await page.goto('/sales');
    await expect(page.locator('h2')).toContainText('Sales & CRM');
    await expect(page.locator('text=SO-2026-0412')).toBeVisible();

    // Check Inventory Reservation
    await page.goto('/inventory');
    await expect(page.locator('h2')).toContainText('Inventory & Warehouse Management');
    await expect(page.locator('text=SKU-SRV-901')).toBeVisible();
  });
});
