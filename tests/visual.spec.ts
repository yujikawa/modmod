import { test, expect } from '@playwright/test';
import { waitForLiveSync } from './utils/helpers';

test.describe('Modscape Visual Regression', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLiveSync(page);
  });

  test('default view should match snapshot', async ({ page }) => {
    // Wait for the canvas to stabilize
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('default-view.png', {
      mask: [page.locator('.react-flow__controls')],
      maxDiffPixels: 1000 // Allow small variations in font/rendering
    });
  });

  test('sidebar expanded should match snapshot', async ({ page }) => {
    // Ensure sidebar is open (default is open) - Target the sidebar specifically
    await expect(page.locator('.sidebar-content').first()).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('sidebar-open.png', {
      maxDiffPixels: 1000
    });
  });
});
