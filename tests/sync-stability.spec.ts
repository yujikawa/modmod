import { test, expect } from '@playwright/test';
import { waitForLiveSync, expectTable, clickNode } from './utils/helpers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.join(__dirname, 'fixtures/test-model.yaml');
const RUNTIME_PATH = path.join(__dirname, 'fixtures/test-model-runtime.yaml');

test.describe.serial('Modscape Sync Stability', () => {
  let originalContent: string;

  test.beforeAll(async () => {
    originalContent = fs.readFileSync(FIXTURE_PATH, 'utf8');
    fs.writeFileSync(RUNTIME_PATH, originalContent, 'utf8');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLiveSync(page);
    
    const nodeFound = await page.locator('.react-flow__node-table').first().isVisible();
    if (!nodeFound) {
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

  test('should NOT trigger refresh when browser itself performs a save', async ({ page }) => {
    await expectTable(page, 'USERS');

    // 1. Trigger a local save via editor
    const editor = page.locator('.cm-content');
    await editor.click();
    await page.keyboard.type(' # local stability test');
    
    // Wait for "Saved" indicator
    await expect(page.locator('text=/Saved/i').first()).toBeVisible({ timeout: 15000 });

    // 2. Immediately overwrite the file from OUTSIDE (within the 3s guard window)
    const externalContent = originalContent.replace('name: USERS', 'name: EXTERNAL_CHANGE');
    fs.writeFileSync(RUNTIME_PATH, externalContent, 'utf8');
    
    // 3. Wait 1 second
    await page.waitForTimeout(1000);
    
    // 4. Verify that 'EXTERNAL_CHANGE' is NOT on the canvas
    const externalNode = page.locator('.react-flow__node-table').filter({ hasText: 'EXTERNAL_CHANGE' });
    await expect(externalNode).not.toBeVisible();
    
    // Original node should still be there
    await expectTable(page, 'USERS');
  });

  test('should trigger refresh when external tool saves and browser is idle', async ({ page }) => {
    await expectTable(page, 'USERS');

    // 1. Wait to ensure we are outside the 3s guard window
    await page.waitForTimeout(4000);

    // 2. Overwrite the file from OUTSIDE
    const externalContent = originalContent.replace('name: USERS', 'name: AI_AGENT_CHANGE');
    fs.writeFileSync(RUNTIME_PATH, externalContent, 'utf8');
    
    // 3. Verify that the UI DOES refresh to AI_AGENT_CHANGE
    await expect(page.locator('.react-flow__node-table').filter({ hasText: 'AI_AGENT_CHANGE' })).toBeVisible({ timeout: 20000 });
  });
});
