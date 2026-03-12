import { Page, expect } from '@playwright/test';

/**
 * Wait for the Modscape Live badge.
 */
export async function waitForLiveSync(page: Page) {
  // Wait for the badge to be present AND not hidden
  const liveBadge = page.locator('span:has-text("Live")').first();
  await expect(liveBadge).toBeVisible({ timeout: 25000 });
  // Add a small buffer to ensure the socket is actually ready to receive messages
  await page.waitForTimeout(1000);
}

/**
 * Wait for a table on canvas.
 */
export async function expectTable(page: Page, tableName: string) {
  const node = page.locator(`.react-flow__node-table`).filter({ hasText: tableName }).first();
  await expect(node).toBeVisible({ timeout: 15000 });
}

/**
 * Perform a "human-like" click on a node to ensure React Flow triggers events.
 */
export async function clickNode(page: Page, label: string) {
  const node = page.locator('.react-flow__node-table').filter({ hasText: label }).first();
  await node.scrollIntoViewIfNeeded();
  
  const box = await node.boundingBox();
  if (!box) throw new Error(`Could not find bounding box for node: ${label}`);

  // Move and click at the center
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(100);
  await page.mouse.up();
  
  // Verify selection bar appears
  await expect(page.locator('text=/Selected:/i').first()).toBeVisible({ timeout: 15000 });
}

/**
 * Expands the detail panel after an object is selected.
 */
export async function expandDetailPanel(page: Page, expectedName: string) {
  const minimizedBar = page.locator(`text=/Selected:.*${expectedName}/i`).first();
  await expect(minimizedBar).toBeVisible({ timeout: 15000 });
  
  // Check if actually expanded
  const titleInput = page.locator('input[title="Conceptual Table Name"]');
  if (!(await titleInput.isVisible())) {
    await minimizedBar.click({ force: true });
    await expect(titleInput).toBeVisible({ timeout: 10000 });
  }
}
