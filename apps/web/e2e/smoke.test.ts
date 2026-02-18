import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('app should load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ZunftGewerk/i);
  });

  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to landing/login
    expect(page.url()).toContain('localhost:3000');
  });
});
