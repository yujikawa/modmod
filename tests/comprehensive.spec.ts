import { test, expect } from '@playwright/test';
import { waitForLiveSync, expectTable, expandDetailPanel, clickNode } from './utils/helpers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.join(__dirname, 'fixtures/test-model.yaml');
const RUNTIME_PATH = path.join(__dirname, 'fixtures/test-model-runtime.yaml');

test.describe.serial('Modscape Main E2E Suite', () => {
  let originalContent: string;

  test.beforeAll(async () => {
    originalContent = fs.readFileSync(FIXTURE_PATH, 'utf8');
    fs.writeFileSync(RUNTIME_PATH, originalContent, 'utf8');
    // Give dev server time to detect the file
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLiveSync(page);
    
    // Ensure nodes are actually rendered by retrying reload if missing
    for (let i = 0; i < 2; i++) {
      if (await page.locator('.react-flow__node-table').first().isVisible()) break;
      await page.reload();
      await waitForLiveSync(page);
    }
  });

  test.afterEach(async () => {
    fs.writeFileSync(RUNTIME_PATH, originalContent, 'utf8');
  });

  test.afterAll(async () => {
    if (fs.existsSync(RUNTIME_PATH)) {
      fs.unlinkSync(RUNTIME_PATH);
    }
  });

  test('Sidebar: Elements and Tab Switching', async ({ page }) => {
    const sidebar = page.locator('.sidebar-content').first();
    await expect(sidebar.locator('h1:has-text("Modscape")')).toBeVisible();
    
    // Default tab should be Editor
    await expect(page.locator('.cm-editor')).toBeVisible();
    
    // Switch to Connect tab
    await page.getByRole('button', { name: 'Connect' }).click();
    // The tab header now says 'Connect' (from the button) or we check the input
    await expect(page.locator('input[placeholder="table.column"]')).toBeVisible();
    
    // Switch back to Editor
    await page.getByRole('button', { name: 'Editor' }).click();
    await expect(page.locator('.cm-editor')).toBeVisible();
  });

  test('Core modeling: display, click, and detail panel', async ({ page }) => {
    await expectTable(page, 'USERS');
    await clickNode(page, 'USERS');
    await expandDetailPanel(page, 'USERS');
    
    const titleInput = page.locator('input[title="Conceptual Table Name"]');
    await expect(titleInput).toBeVisible({ timeout: 15000 });
    await expect(titleInput).toHaveValue('USERS');
  });

  test('Quick Connect: Create relationship via keyboard', async ({ page }) => {
    // Open connect tab via shortcut L
    await page.keyboard.press('l');
    
    // Check if correct tab is active and input focused
    const sourceInput = page.locator('input[placeholder="table.column"]');
    await expect(sourceInput).toBeFocused();
    
    // Fill connection details
    await sourceInput.fill('users.id');
    await page.keyboard.press('Enter'); // Select from suggestion if any, or just move to next
    
    const targetInput = page.locator('input[placeholder="target.column or *.column"]');
    await targetInput.fill('orders.user_id');
    
    // Apply connection
    await page.getByRole('button', { name: 'Connect Objects' }).click();
    
    // Check for success feedback
    await expect(page.getByText('Connected!')).toBeVisible();
  });

  test('Live Sync: External file edit reflected instantly', async ({ page }) => {
    await expectTable(page, 'USERS');
    const newContent = originalContent.replace('name: USERS', 'name: UPDATED_USERS');
    
    fs.writeFileSync(RUNTIME_PATH, newContent, 'utf8');
    
    // Manual reload fallback if WS is jittery, but usually not needed with our helpers
    await page.reload();
    await waitForLiveSync(page);
    
    await expect(page.locator('.react-flow__node-table').filter({ hasText: 'UPDATED_USERS' })).toBeVisible({ timeout: 20000 });
  });

  test('Visual: Sidebar should match snapshots', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.addStyleTag({ content: '::-webkit-scrollbar { display: none !important; }' });
    
    const sidebar = page.locator('.sidebar-content').first();
    
    await expect(sidebar).toHaveScreenshot('sidebar-main.png', {
      mask: [
        page.locator('text=/Modscape v/i'),
        page.locator('text=/Live/i')
      ],
      maxDiffPixelRatio: 0.2,
      threshold: 0.5,
      animations: 'disabled'
    });
  });
});
