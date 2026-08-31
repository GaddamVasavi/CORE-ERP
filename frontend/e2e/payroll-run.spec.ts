import { test, expect } from '@playwright/test';

test.describe('HR & Automated Payroll Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should verify Employee Directory and Monthly Payroll Batch', async ({ page }) => {
    await page.goto('/hr');
    await expect(page.locator('h2')).toContainText('Human Resources & Payroll');
    await expect(page.locator('text=EMP-001')).toBeVisible();
  });
});
