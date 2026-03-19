import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const getFolderKey = (node) => {
  if (node.resource_type === 'seed') return 'seeds';
  return node.fqn?.[1] || 'default';
};

export async function syncDbt(projectDir, options) {
  const resolvedDir = path.resolve(projectDir || '.');
  const manifestPath = path.join(resolvedDir, 'target', 'manifest.json');

  const dbtProjectPath = path.join(resolvedDir, 'dbt_project.yml');
  let projectName = path.basename(resolvedDir);

  if (fs.existsSync(dbtProjectPath)) {
    const dbtProject = yaml.load(fs.readFileSync(dbtProjectPath, 'utf8'));
    projectName = dbtProject.name || projectName;
  }

  const outputDir = options.output || `modscape-${projectName}`;

  try {
    if (!fs.existsSync(manifestPath)) {
      console.error(`  ❌ manifest.json not found at: ${manifestPath}`);
      console.error(`  💡 Run 'dbt parse' in your dbt project first.`);
      return;
    }

    if (!fs.existsSync(outputDir)) {
      console.error(`  ❌ Output directory not found: ${outputDir}`);
      console.error(`  💡 Run 'modscape dbt import' first.`);
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`  🔍 Parsing dbt manifest: ${manifestPath}`);

    const latestTablesMap = new Map();
    const allNodes = { ...manifest.nodes, ...manifest.sources };

    for (const [uniqueId, node] of Object.entries(allNodes)) {
      if (!['model', 'seed', 'snapshot', 'source'].includes(node.resource_type)) continue;

      const tableId = node.unique_id;

      const columns = [];
      if (node.columns) {
        for (const [colKey, col] of Object.entries(node.columns)) {
          columns.push({
            id: col.name,
            logical: {
              name: col.name,
              type: col.data_type || 'unknown',
              description: col.description || ''
            }
          });
        }
      }

      const lineageUpstream = [];
      if (node.depends_on?.nodes) {
        for (const upstreamId of node.depends_on.nodes) {
          if (allNodes[upstreamId]) {
            lineageUpstream.push(upstreamId);
          }
        }
      }

      latestTablesMap.set(tableId, {
        id: tableId,
        name: node.name,
        logical_name: node.name,
        physical_name: node.alias || node.name,
        appearance: { type: 'table' },
        conceptual: { description: node.description || '' },
        columns,
        lineage: { upstream: lineageUpstream }
      });
    }

    const yamlFiles = fs.readdirSync(outputDir)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

    if (yamlFiles.length === 0) {
      console.error(`  ❌ No YAML files found in: ${outputDir}`);
      return;
    }

    let addedCount = 0;
    let updatedCount = 0;
    const processedTableIds = new Set();

    for (const yamlFile of yamlFiles) {
      const yamlPath = path.join(outputDir, yamlFile);
      const existing = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

      if (!existing || !Array.isArray(existing.tables)) continue;

      const newTables = existing.tables.map(table => {
        const latest = latestTablesMap.get(table.id);
        if (!latest) return table;

        processedTableIds.add(table.id);
        updatedCount++;

        return {
          ...table,
          name: latest.name,
          logical_name: latest.logical_name,
          physical_name: latest.physical_name,
          conceptual: latest.conceptual,
          columns: latest.columns,
          lineage: latest.lineage
        };
      });

      const updated = { ...existing, tables: newTables };
      fs.writeFileSync(yamlPath, yaml.dump(updated), 'utf8');
      console.log(`  📄 Updated: ${yamlPath}`);
    }

    const newTables = [];
    for (const [tableId, latest] of latestTablesMap.entries()) {
      if (!processedTableIds.has(tableId)) {
        newTables.push(latest);
        addedCount++;
      }
    }

    if (newTables.length > 0) {
      const firstYamlPath = path.join(outputDir, yamlFiles[0]);
      const firstYaml = yaml.load(fs.readFileSync(firstYamlPath, 'utf8'));
      firstYaml.tables = [...firstYaml.tables, ...newTables];
      fs.writeFileSync(firstYamlPath, yaml.dump(firstYaml), 'utf8');
      console.log(`  ➕ Added ${addedCount} new tables → ${yamlFiles[0]}`);
    }

    console.log(`  ✅ Sync complete: ${updatedCount} updated, ${addedCount} added`);
    console.log(`  🚀 Run 'modscape dev ${outputDir}' to visualize.`);

  } catch (error) {
    console.error(`  ❌ Failed to sync dbt metadata: ${error.message}`);
  }
}