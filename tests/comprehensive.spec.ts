import { test, expect } from '@playwright/test';
import { waitForLiveSync, expectTable, expandDetailPanel, clickNode } from './utils/helpers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.join(__dirname, 'fixtures/test-model.yaml');

// Use serial mode to ensure tests run in order and don't interfere with the shared YAML file
test.describe.serial('Modscape Main E2E Suite', () => {
  let originalContent: string;

  test.beforeAll(async () => {
    // 1. Read original content from a secure backup or the known base state
    // For now, we assume the fixture is the truth, but we must ensure it's not the 'UPDATED' version
    const content = fs.readFileSync(FIXTURE_PATH, 'utf8');
    originalContent = content.replace('name: UPDATED_USERS', 'name: USERS');
    
    // 2. Force restore BEFORE any test runs
    fs.writeFileSync(FIXTURE_PATH, originalContent, 'utf8');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLiveSync(page);
  });

  test.afterEach(async () => {
    fs.writeFileSync(FIXTURE_PATH, originalContent, 'utf8');
  });

  // 1. Static tests first
  test('Sidebar: Elements present', async ({ page }) => {
    const sidebar = page.locator('.sidebar-content').first();
    await expect(sidebar.locator('h1:has-text("Modscape")')).toBeVisible();
    await expect(page.locator('.cm-editor')).toBeVisible();
  });

  // 2. Modeling interaction (using clean data)
  test('Core modeling: display, click, and detail panel', async ({ page }) => {
    await expectTable(page, 'USERS');
    await clickNode(page, 'USERS');
    await expandDetailPanel(page, 'USERS');
    
    const titleInput = page.locator('input[title="Conceptual Table Name"]');
    await expect(titleInput).toBeVisible({ timeout: 15000 });
    await expect(titleInput).toHaveValue('USERS');
  });

  // 3. Live Sync (this modifies the file)
  test('Live Sync: External file edit reflected instantly', async ({ page }) => {
    await expectTable(page, 'USERS');
    
    // Ensure we are fully ready for sync
    await page.waitForTimeout(1000);
    
    const newContent = originalContent.replace('name: USERS', 'name: UPDATED_USERS');
    fs.writeFileSync(FIXTURE_PATH, newContent, 'utf8');
    
    // Wait for the UI to update - the long timeout handles the debounce and network
    await expect(page.locator('.react-flow__node-table').filter({ hasText: 'UPDATED_USERS' })).toBeVisible({ timeout: 20000 });
  });

  test.skip('Navigation: Right Panel searching and filtering', async ({ page }) => {
    const activityBar = page.locator('.w-14').filter({ has: page.locator('svg.lucide-list-tree') });
    await activityBar.locator('button').filter({ has: page.locator('svg.lucide-list-tree') }).click();
    const searchInput = page.locator('input[placeholder="Search entities..."]');
    if (!(await searchInput.isVisible())) {
        const expandButton = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-left') }).first();
        await expandButton.click();
    }
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('ORDERS');
    const rightPanelContent = page.locator('.sidebar-content').filter({ hasText: 'Tables' });
    await expect(rightPanelContent.getByText('ORDERS').first()).toBeVisible();
  });
});
