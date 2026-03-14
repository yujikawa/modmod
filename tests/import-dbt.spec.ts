import { test, expect } from '@playwright/test';
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const FIXTURE_MANIFEST = 'tests/fixtures/manifest.json';
const OUTPUT_YAML = 'tests/fixtures/import-test-result.yaml';

test.describe('CLI: import-dbt', () => {
  test.afterEach(() => {
    // Ensure the generated YAML is cleaned up after each test
    if (fs.existsSync(OUTPUT_YAML)) {
      fs.unlinkSync(OUTPUT_YAML);
    }
  });

  test('should import dbt manifest and generate valid Modscape YAML', async () => {
    // 1. Run the import command
    // We use node src/index.js directly to avoid issues with bin linking in CI
    const command = `node src/index.js import-dbt ${FIXTURE_MANIFEST} -o ${OUTPUT_YAML}`;
    
    try {
      execSync(command);
    } catch (error) {
      throw new Error(`Import command failed: ${error.message}`);
    }

    // 2. Verify the output file exists
    expect(fs.existsSync(OUTPUT_YAML)).toBe(true);

    // 3. Load and verify the content
    const content = fs.readFileSync(OUTPUT_YAML, 'utf8');
    const model = yaml.load(content) as any;

    expect(model.tables).toBeDefined();
    expect(model.tables.length).toBeGreaterThan(0);

    // Verify conceptual-first mapping (name should contain dbt description)
    const stgOrders = model.tables.find(t => t.id === 'stg_orders');
    expect(stgOrders).toBeDefined();
    expect(stgOrders.name).toContain('staging table'); // from dbt description
    expect(stgOrders.logical_name).toBe('stg_orders'); // from dbt name
    expect(stgOrders.physical_name).toBe('stg_orders_v1'); // from dbt alias

    // Verify lineage
    expect(stgOrders.lineage.upstream).toContain('orders');

    // Verify domains
    expect(model.domains).toBeDefined();
    const stagingDomain = model.domains.find(d => d.id === 'staging');
    expect(stagingDomain).toBeDefined();
    expect(stagingDomain.tables).toContain('stg_orders');
  });

  test('should show error message when manifest is missing', async () => {
    const command = `node src/index.js import-dbt non-existent.json -o ${OUTPUT_YAML}`;
    
    // Use spawnSync to easily get stdout and stderr
    const { stderr } = spawnSync('node', [
      'src/index.js',
      'import-dbt',
      'non-existent.json',
      '-o',
      OUTPUT_YAML
    ]);
    
    const output = stderr.toString();
    expect(output).toContain('target/manifest.json not found');
    expect(fs.existsSync(OUTPUT_YAML)).toBe(false);
  });
});
