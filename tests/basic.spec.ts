import { test, expect } from '@playwright/test';
import { waitForLiveSync, expectTable } from './utils/helpers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURE_PATH = path.join(__dirname, 'fixtures/test-model.yaml');

test.describe('Modscape Basic E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLiveSync(page);
  });

  test('should load model and display tables on canvas', async ({ page }) => {
    await expectTable(page, 'USERS');
    await expectTable(page, 'ORDERS');
  });

  test('should open detail panel when a node is clicked', async ({ page }) => {
    // Click USERS table
    const tableNode = page.locator('.react-flow__node-table').filter({ hasText: 'USERS' });
    await tableNode.click({ force: true });
    
    // Attempt to find ANY part of the detail panel that confirms selection
    // We look for the technical ID or the name in any case
    const panelIdentifier = page.locator('text=/USERS/i').first();
    await expect(panelIdentifier).toBeVisible({ timeout: 10000 });

    // If we're lucky and the input is already there, great. 
    // If not, we try to click the panel area to expand it.
    const titleInput = page.locator('input[title="Conceptual Table Name"]');
    if (!(await titleInput.isVisible())) {
        await page.locator('.sidebar-content').first().click();
    }
    
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await expect(titleInput).toHaveValue('USERS');
  });

  test('should show model info in sidebar', async ({ page }) => {
    // Check if YAML Editor title is present
    await expect(page.locator('text=YAML Editor')).toBeVisible();
    
    // Check if auto-sync status is shown
    await expect(page.locator('text=Auto-sync active')).toBeVisible();
  });

  test('should reflect external YAML changes in real-time', async ({ page }) => {
    await expectTable(page, 'USERS');

    // Modify the fixture file
    const originalContent = fs.readFileSync(FIXTURE_PATH, 'utf8');
    const newContent = originalContent.replace('name: USERS', 'name: UPDATED_USERS');
    
    try {
      fs.writeFileSync(FIXTURE_PATH, newContent, 'utf8');
      
      // Wait longer for file watcher + debounce + network + rendering
      await page.waitForTimeout(3000);
      await expectTable(page, 'UPDATED_USERS');
    } finally {
      // Restore original content
      fs.writeFileSync(FIXTURE_PATH, originalContent, 'utf8');
    }
  });
});
