import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const collectYamlFiles = (inputPath) => {
  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) {
    return fs.readdirSync(inputPath)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      .map(f => path.join(inputPath, f));
  }
  return [inputPath];
};

export function extractModels(inputs, options) {
  const outputPath = options.output || 'extracted.yaml';
  const tableIds = options.tables
    ? options.tables.split(',').map(id => id.trim()).filter(Boolean)
    : [];

  if (tableIds.length === 0) {
    console.error('  ❌ --tables option is required. Specify comma-separated table IDs.');
    return;
  }

  // 後勝ちマージ用 Map
  const tableMap = new Map();

  const allFiles = [];
  for (const input of inputs) {
    allFiles.push(...collectYamlFiles(input));
  }

  if (allFiles.length === 0) {
    console.error('  ❌ No YAML files found');
    return;
  }

  for (const filePath of allFiles) {
    try {
      const data = yaml.load(fs.readFileSync(filePath, 'utf8'));
      if (!data) continue;

      let matched = 0;
      for (const table of data.tables || []) {
        if (tableIds.includes(table.id)) {
          tableMap.set(table.id, table); // 後勝ち上書き
          matched++;
        }
      }

      console.log(`  📄 ${filePath} (${matched} matched)`);
    } catch (e) {
      console.error(`  ❌ Failed to read ${filePath}: ${e.message}`);
    }
  }

  // マッチしなかった ID を警告
  for (const id of tableIds) {
    if (!tableMap.has(id)) {
      console.warn(`  ⚠️  Table ID not found: "${id}"`);
    }
  }

  const outputModel = {
    tables: [...tableMap.values()],
  };

  fs.writeFileSync(outputPath, yaml.dump(outputModel), 'utf8');
  console.log(`\n  ✅ Extracted ${tableMap.size} tables → ${outputPath}`);
  console.log(`  🚀 Run 'modscape dev ${outputPath}' to visualize.`);
}
