import { Page, expect } from '@playwright/test';

/**
 * Wait for the Modscape Live badge to appear and pulse,
 * indicating WebSocket connection is established.
 */
export async function waitForLiveSync(page: Page) {
  const liveBadge = page.locator('span:has-text("Live")');
  await expect(liveBadge).toBeVisible({ timeout: 10000 });
}

/**
 * Wait for a specific table to be visible on the React Flow canvas.
 */
export async function expectTable(page: Page, tableName: string) {
  const node = page.locator(`.react-flow__node-table:has-text("${tableName}")`);
  await expect(node).toBeVisible();
}
