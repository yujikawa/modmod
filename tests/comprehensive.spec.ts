import { test, expect } from '@playwright/test';
import { waitForLiveSync, expectTable } from './utils/helpers';

test.describe('Modscape Comprehensive UI Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLiveSync(page);
  });

  test('should search and filter tables in Right Panel', async ({ page }) => {
    // Open Right Panel if closed - Look for the chevron that indicates the panel is collapsed
    const rightPanelContent = page.locator('.sidebar-content').filter({ hasText: 'Tables' });
    if (!(await rightPanelContent.isVisible())) {
        await page.locator('button').filter({ has: page.locator('svg.lucide-chevron-left') }).first().click();
    }

    // Select Tables tab (ListTree icon)
    await page.locator('button').filter({ has: page.locator('svg.lucide-list-tree') }).click();
    
    const searchInput = page.locator('input[placeholder="Search entities..."]');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('ORDERS');
    await expect(page.getByText('ORDERS').first()).toBeVisible();
    await expect(page.getByText('USERS').first()).not.toBeVisible();
  });

  test('should display complete information in Detail Panel when a table is selected', async ({ page }) => {
    // Click USERS node on canvas using its specific handle
    const usersNode = page.locator('.react-flow__node-table').filter({ hasText: 'USERS' });
    await usersNode.locator('.table-drag-handle').click();
    
    // Detailed Panel detection - wait for the indicator bar
    const panelIndicator = page.locator('text=/Selected: USERS/i').first();
    await expect(panelIndicator).toBeVisible({ timeout: 10000 });

    // Ensure it is expanded by clicking the indicator
    await panelIndicator.click();
    
    // Verify properties in expanded view
    // Using a more flexible text search for titles/labels
    await expect(page.getByText('USERS').first()).toBeVisible();
    await expect(page.getByText('System users')).toBeVisible();
    
    // Verify tabs are clickable
    await page.getByRole('button', { name: 'Logical' }).click();
    await expect(page.getByText('ID').first()).toBeVisible();
  });

  test('should verify sidebar elements are present', async ({ page }) => {
    const sidebar = page.locator('.sidebar-content').first();
    await expect(sidebar.locator('h1:has-text("Modscape")')).toBeVisible();
    await expect(sidebar.getByText('YAML Editor')).toBeVisible();
    await expect(page.locator('.cm-editor')).toBeVisible();
  });
});
