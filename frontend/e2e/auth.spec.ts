import { test, expect } from '@playwright/test';

test.describe('Enterprise Authentication & Multi-Tenancy Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login screen with enterprise branding', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('CoreERP Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should successfully authenticate super administrator', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Executive Dashboard');
  });

  test('should validate invalid login credentials with alert message', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid.user@coreerp.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-rose-700')).toBeVisible();
  });

  test('should navigate to tenant registration page', async ({ page }) => {
    await page.click('text=Register Tenant');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toContainText('Create Tenant Workspace');
  });
});
